console.log("I am here!")

function submitTranscript() {
  var transcript = document.getElementById('transcript').value
  let spinner = document.getElementById('spinner')
  spinner.style.display = "block"
  axios.post('/api/', {
    transcript: transcript
  })
  .then(function (response) {
    spinner.style.display = "none"
    console.log(response);
    let summarySection = document.getElementById('result')
    if(response.status == 200){
      summarySection.style.display = "block"
    } else {
      summarySection.style.display = "none"
    }
    let studentSummary = document.getElementById('summary-student')
    let tutorSummary = document.getElementById('summary-tutor')
    let agencySummary = document.getElementById('summary-agency')
    let parentSummary = document.getElementById('summary-parent')
    let results = response.data
    studentSummary.innerText = results.student
    agencySummary.innerText = results.agency
    tutorSummary.innerText = results.tutor
    parentSummary.innerText = results.parent
  })
  .catch(function (error) {
    spinner.style.display = "none"
    console.log(error);
  });
}