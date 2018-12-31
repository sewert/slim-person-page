const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
const pid = urlParams.get('pid');

var tfRequest = new XMLHttpRequest();
tfRequest.open('GET', 'https://integration.familysearch.org/tf/person/' + pid + '?oneHops=cards&includeSuggestions=true&contactNames=true&sessionId=' + sessionId, true);
tfRequest.send();
tfRequest.addEventListener('readystatechange', processTfRequest, false);

function processTfRequest() {
  if (tfRequest.readyState === 4 && tfRequest.status === 200) { // if DONE
    var response = JSON.parse(tfRequest.responseText);
    var body = document.getElementById('bodyId');
    body.innerText = JSON.stringify(response);
  }
}