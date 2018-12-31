const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
const pid = urlParams.get('pid');

const tfRequest = new XMLHttpRequest();
tfRequest.open('GET', 'https://beta.familysearch.org/tf/person/' + pid + '?oneHops=cards&includeSuggestions=true&contactNames=true&sessionId=' + sessionId, true);
tfRequest.setRequestHeader('accept', 'application/json');
tfRequest.send();
tfRequest.addEventListener('readystatechange', processTfRequest, false);

function processTfRequest() {
  if (tfRequest.readyState === 4 && tfRequest.status === 200) { // if DONE
    const response = JSON.parse(tfRequest.responseText); // object we can work with
    const data = document.getElementById('tfData');
    data.innerText = JSON.stringify(response); // convert back to string
  }
}

const ftUserRequest = new XMLHttpRequest();
ftUserRequest.open('GET', 'https://beta.familysearch.org/ftuser/users/CURRENT' + '?sessionId=' + sessionId, true);
ftUserRequest.setRequestHeader('accept', 'application/json');
ftUserRequest.send();
ftUserRequest.addEventListener('readystatechange', processFtUserRequest, false);

function processFtUserRequest() {
  if (ftUserRequest.readyState === 4 && ftUserRequest.status === 200) {
    const response = JSON.parse(ftUserRequest.responseText);
    const data = document.getElementById('ftUserData');
    data.innerText = JSON.stringify(response);
    console.log('displayName=' + response.displayName);
    console.log('cisId=' + response.id);
    // TODO: cisId needed for fs-user call
  }
}

const casRequest = new XMLHttpRequest();
casRequest.open('GET', 'https://beta.familysearch.org/cas-public-api/authorization/v1/authorize?perm=ViewTempleUIPermission&context=FtNormalUserContext&sessionId=' + sessionId, true);
casRequest.setRequestHeader('accept', 'application/json');
casRequest.send();
casRequest.addEventListener('readystatechange', processCasRequest, false);

function processCasRequest() {
  if (casRequest.readyState === 4 && casRequest.status === 200) {
    const response = JSON.parse(casRequest.responseText);
    const data = document.getElementById('casData');
    data.innerText = JSON.stringify(response);
    if (response.authorized === true) {
      console.log('ViewTempleUIPermission=true');
    }
    else {
      console.log('ViewTempleUIPermission=false');
    }
    // TODO: need to combine permission with showLDSTempleInfo preference
    // TODO: needed before calling temple status
  }
}

const watchRequest = new XMLHttpRequest();
watchRequest.open('HEAD', 'https://beta.familysearch.org/service/cmn/watch/watches?resourceId=' + pid + '_p_fs-ft_production-staging-2&sessionId=' + sessionId, true);
// _p_fs-ft_production-staging-2
//_p_fs-ft_ftint
watchRequest.setRequestHeader('accept', 'application/json');
watchRequest.send();
watchRequest.addEventListener('readystatechange', processWatchRequest, false);

function processWatchRequest() {
  if (watchRequest.readyState === 4 && watchRequest.status === 200) {
    const data = document.getElementById('watchData');
    data.innerText = 'pid=' + pid + " is watched";
    console.log('watched=true');
  }
  else if (watchRequest.readyState === 4 && watchRequest.status === 204) {
    const data = document.getElementById('watchData');
    data.innerText = 'pid=' + pid + " is not watched";
    console.log('watched=false');
  }
}

const tpsRequest = new XMLHttpRequest();
tpsRequest.open('GET', 'https://beta.familysearch.org/service/memories/tps/persons/' + pid + '/portrait?sessionId=' + sessionId, true);
tpsRequest.setRequestHeader('accept', 'application/json');
tpsRequest.send();
tpsRequest.addEventListener('readystatechange', processTpsRequest, false);

function processTpsRequest() {
  if (tpsRequest.readyState === 4 && tpsRequest.status === 200) {
    const response = JSON.parse(tpsRequest.responseText);
    const data = document.getElementById('tpsData');
    data.innerText = JSON.stringify(response);
    console.log('awsPortraitUrl=' + response.portraitUrls.thumbSquareUrl);
  }
  else if (tpsRequest.readyState === 4 && tpsRequest.status === 404) {
    const data = document.getElementById('tpsData');
    data.innerText = JSON.stringify('No portrait for pid=' + pid);
    console.log('No portrait for pid=' + pid);
  }
}

const memoriesManagerRequest = new XMLHttpRequest();
memoriesManagerRequest.open('GET', 'https://beta.familysearch.org/service/memories/manager/persons/personsByTreePersonId/' + pid + '/summary?includeArtifactCount=true&sessionId=' + sessionId, true);
memoriesManagerRequest.setRequestHeader('accept', 'application/json');
memoriesManagerRequest.send();
memoriesManagerRequest.addEventListener('readystatechange', processMemoriesManagerRequest, false);

function processMemoriesManagerRequest() {
  if (memoriesManagerRequest.readyState === 4 && memoriesManagerRequest.status === 200) {
    const response = JSON.parse(memoriesManagerRequest.responseText);
    const data = document.getElementById('memoriesManagerData');
    data.innerText = JSON.stringify(response);
    console.log('memoryCount=' + response.artifactCount); // this call is only to display how many memories there are on the person
    console.log('tpsPortraitUrl=' + response.thumbSquareUrl); // this also returns the thumbnail for the PID using tps/stream instead of AWS s3
  }
}

const labelsRequest = new XMLHttpRequest();
labelsRequest.open('GET', 'https://beta.familysearch.org/service/tree/labels/persons?personId=' + pid + '&includeLabels=true&sessionId=' + sessionId, true);
labelsRequest.setRequestHeader('accept', 'application/json');
labelsRequest.send();
labelsRequest.addEventListener('readystatechange', processLabelsRequest, false);

function processLabelsRequest() {
  if (labelsRequest.readyState === 4 && labelsRequest.status === 200) {
    const response = JSON.parse(labelsRequest.responseText);
    const data = document.getElementById('labelsData');
    data.innerText = JSON.stringify(response);
    const labels = response.personAttachments;
    for (let i = 0; i < labels.length; i++) {
      console.log('label=' + labels[i].label.name);
    }
  }
}