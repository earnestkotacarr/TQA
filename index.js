require('dotenv').config()
const path = require('path')
const fastify = require(`fastify`)({
    logger: true
})

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
  })

fastify.get(`/api/`, function(request,reply){
    let ipAddress = request.ip
    let response = {
        "message": "Hello two G's in a pod",
        "ip": ipAddress
    }

    reply.send(response)
})

fastify.listen({ port: process.env.PORT }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    // Server is now listening on ${address}
  })