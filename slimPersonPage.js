const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
const pid = urlParams.get('pid');

var tfRequest = new XMLHttpRequest();
tfRequest.open('GET', 'https://integration.familysearch.org/tf/person/' + pid + '?oneHops=cards&includeSuggestions=true&contactNames=true&sessionId=' + sessionId, true);
tfRequest.send();
tfRequest.addEventListener('readystatechange', processTfRequest, false);

function processTfRequest() {
  if (tfRequest.readyState === 4 && tfRequest.status === 200) { // if DONE
    var response = JSON.parse(tfRequest.responseText); // object we can work with
    var data = document.getElementById('tfData');
    data.innerText = JSON.stringify(response); // convert back to string
  }
}

var ftUserRequest = new XMLHttpRequest();
ftUserRequest.open('GET', 'https://integration.familysearch.org/ftuser/users/CURRENT' + '?sessionId=' + sessionId, true);
ftUserRequest.send();
ftUserRequest.addEventListener('readystatechange', processFtUserRequest, false);

function processFtUserRequest() {
  if (ftUserRequest.readyState === 4 && ftUserRequest.status === 200) {
    var response = JSON.parse(tfRequest.responseText);
    var data = document.getElementById('ftUserData');
    data.innerText = JSON.stringify(response);
    // TODO: CISID needed for fs-user call
  }
}