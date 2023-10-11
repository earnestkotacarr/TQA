require('dotenv').config()
const OpenAI = require('openai')
const postmark = require("postmark");



const path = require('path')
const openai = new OpenAI({
  apiKey: process.env.OPENAIKEY, // defaults to process.env["OPENAI_API_KEY"]
});
const fastify = require(`fastify`)({
  logger: true
})

var client = new postmark.ServerClient(process.env.POSTMARKAPIKEY);

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
})

fastify.post(`/api/`, async function (request, reply) {
  console.log(request)
  let transcript = request.body.transcript
  if (!transcript) {
    throw new Error('there is no transcript')
  }
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        "role": "system",
        "content":
          `You are an evaluator of tutoring sessions for a tutoring agency. You will be given the transcript of a tutoring session.

      Goal: Your goal is to understand and evaluate the session. You will produce 4 short reports to show various stakeholders. 
      
      Requirements: The summary is from the perspective of an evaluator and addressed to each respective stakeholder.
      
      Format: Format your output as a JSON object. The key will be the audience (one of "student", "tutor", "agency" and "parent"). The values in the object will be strings containing the summary.
      
      Here are the respective audiences for the four summaries: the parents of the student, the tutor, the tutoring agency's manager, and the student themselves.
      Produce each summary accordingly.
      They should appear in this order.
      
      Tone: Spartan, casual but professional, helpful. Do not over-explain
      `},
      {
        "role": "user",
        "content":
          `IMPORTANT: each summary is from the perspective of an evaluator and addressed to each respective stakeholder.


        Here is the tutoring transcript to process:
        ${transcript} 
        `},// string interpolation in javascript
    ],
    model: 'gpt-3.5-turbo',
  });
  if (chatCompletion.choices.length == 0) {
    throw new Error('No choices')
  }
  console.log(chatCompletion.choices)
  let firstChoice = chatCompletion.choices[0]
  var firstMessage = firstChoice.message.content
  const parsedMessage = JSON.parse(firstMessage) // use parentheses for methods and inputs of fuctions, use curly to define blocks of code- bodies of code 
  reply.send(parsedMessage)

  let studentEmail = ""
  let tutorEmail = ""
  let agencyEmail = "support@tokyotutor.com"
  let parentEmail = ""

client.sendEmail({
  "From": "earnestcarr@tokyotutor.com",
  "To": agencyEmail,
  "Subject": "Tutoring Quality Assurance Incorporated LLC (New look, same great taste)",
  "TextBody": parsedMessage.agency
});


})

fastify.listen({ port: process.env.PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})