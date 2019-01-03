const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
const pid = urlParams.get('pid');
const cisId = urlParams.get('cisId');

const tfRequest = new XMLHttpRequest();
tfRequest.open('GET', 'https://beta.familysearch.org/tf/person/' + pid + '?oneHops=cards&includeSuggestions=true&contactNames=true&sessionId=' + sessionId, true);
tfRequest.setRequestHeader('accept', 'application/json');
tfRequest.send();
tfRequest.addEventListener('readystatechange', processTfRequest, false);

function processTfRequest() {
  if (tfRequest.readyState === 4 && tfRequest.status === 200) { // if DONE
    const response = JSON.parse(tfRequest.responseText);
    let data = document.getElementById('personFullNameHeader');
    let html =  response.fullName;
    data.innerText = html;
    data = document.getElementById('personHeader');
    html = 'Lifespan (tree-data adds in living/deceased and determines if we use original/normalized): ' + response.summary.lifespanBegin.date.original + ' - ' + response.summary.lifespanEnd.date.original;
    html += '\n' + response.id + ' ' + response.summary.gender;
    data.innerText = html;
    data.className += response.summary.gender;

    data = document.getElementById('sourcesCount');
    data.innerText = 'sourcesCount=' + response.summary.sourcesCount;

    data = document.getElementById('collaborateCount');
    data.innerText = 'collaborate count is the sum of notes/discussions ' + 'notesCount=' + response.summary.notesCount + " discussionsCount=" + response.summary.discussionsCount;

    let facts = response.facts;
    html = '---LIFE SKETCH---:\n';
    for (let i = 0; i < facts.length; i++) {
      if (facts[i].value.type === "http://familysearch.org/v1/LifeSketch") {
        html += facts[i].value.value + '\n';
      }
    }
    data = document.getElementById('lifeSketch');
    data.innerText = html;

    html = '---OTHER INFORMATION---\n';
    for (let i = 0; i < facts.length; i++) {
      if (facts[i].value.type !== "http://familysearch.org/v1/LifeSketch" &&
        facts[i].value.type !=='http://gedcomx.org/BirthName' &&
        facts[i].value.type !=='http://gedcomx.org/Male' &&
        facts[i].value.type !=='http://gedcomx.org/Female' &&
        facts[i].value.type !=='http://gedcomx.org/Birth' &&
        facts[i].value.type !=='http://gedcomx.org/Christening' &&
        facts[i].value.type !=='http://gedcomx.org/Burial' &&
        facts[i].value.type !=='http://gedcomx.org/Death') {
        html += JSON.stringify(facts[i]) + '\n\n';
      }
    }
    data = document.getElementById('otherInformation');
    data.innerText = html;

    html = '---VITALS---:\n';
    html += 'Name: ' + JSON.stringify(response.name) + '\n\n';
    html += 'Sex: ' + JSON.stringify(response.gender) + '\n\n';
    html += 'Birth: ' + JSON.stringify(response.birth) + '\n\n';
    html += 'Christening: ' + JSON.stringify(response.christening) + '\n\n';
    html += 'Death: ' + JSON.stringify(response.death) + '\n\n';
    html += 'Burial: ' + JSON.stringify(response.burial) + '\n\n';
    data = document.getElementById('vitals');
    data.innerText = html;

    data = document.getElementById('deletePerson');
    data.innerText = 'Person deletable='+ response.deletable;

    html = '---FAMILY MEMBERS---\n';
    html += JSON.stringify(response.oneHopRelativeCards);
    data = document.getElementById('familyMembers');
    data.innerText = html;

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
    data.innerText = 'Welcome, ' + response.displayName;
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
    if (response.authorized === true) {
      data.innerText ='ViewTempleUIPermission=true';
    }
    else {
      data.innerText = 'ViewTempleUIPermission=false';
    }
  }
}

const watchRequest = new XMLHttpRequest();
watchRequest.open('HEAD', 'https://beta.familysearch.org/service/cmn/watch/watches?resourceId=' + pid + '_p_fs-ft_production-staging-2&sessionId=' + sessionId, true);
// _p_fs-ft_production-staging-2
//_p_fs-ft_ftint
watchRequest.send();
watchRequest.addEventListener('readystatechange', processWatchRequest, false);

function processWatchRequest() {
  if (watchRequest.readyState === 4 && watchRequest.status === 200) {
    const data = document.getElementById('watchData');
    data.innerText = 'watched=true';
  }
  else if (watchRequest.readyState === 4 && watchRequest.status === 204) {
    const data = document.getElementById('watchData');
    data.innerText = 'watched=false';
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
    const data = document.getElementById('personPortrait');
    data.src = response.portraitUrls.thumbSquareUrl;
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
    const data = document.getElementById('memoriesCount');
    data.innerText = 'memoriesCount=' + response.artifactCount;
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
    const data = document.getElementById('labels');
    const labels = response.personAttachments;
    let html = '';
    for (let i = 0; i < labels.length; i++) {
      html += labels[i].label.name + '\n';
    }
    data.innerText = html;
  }
}

const possibleDuplicatesRequest = new XMLHttpRequest();
possibleDuplicatesRequest.open('GET', 'https://beta.familysearch.org/platform/tree/persons/' + pid + '/matches?confidence=4&count=100&sessionId=' + sessionId, true);
possibleDuplicatesRequest.setRequestHeader('accept', 'application/json');
possibleDuplicatesRequest.send();
possibleDuplicatesRequest.addEventListener('readystatechange', processPossibleDuplicatesRequest, false);

function processPossibleDuplicatesRequest() {
  if (possibleDuplicatesRequest.readyState === 4 && possibleDuplicatesRequest.status === 200) {
    const response = JSON.parse(possibleDuplicatesRequest.responseText);
    const data = document.getElementById('possibleDuplicates');
    data.innerText = JSON.stringify(response);
    console.log('possibleDuplicates=' + response.results);
  }
  else if (possibleDuplicatesRequest.readyState === 4 && possibleDuplicatesRequest.status === 204) {
    const data = document.getElementById('possibleDuplicates');
    data.innerText = JSON.stringify('No possible duplicates for pid=' + pid);
    console.log('possibleDuplicates=0')
  }
}

const recordHintsRequest = new XMLHttpRequest();
recordHintsRequest.open('GET', 'https://beta.familysearch.org/platform/tree/persons/' + pid + '/matches?confidence=4&count=100&includeSummary=true&collection=https://familysearch.org/platform/collections/records&status=Pending&status=Rejected&sessionId=' + sessionId, true);
recordHintsRequest.setRequestHeader('accept', 'application/json');
recordHintsRequest.send();
recordHintsRequest.addEventListener('readystatechange', processRecordHintsRequest, false);

function processRecordHintsRequest() {
  if (recordHintsRequest.readyState === 4 && recordHintsRequest.status === 200) {
    const response = JSON.parse(recordHintsRequest.responseText);
    const data = document.getElementById('recordHints');
    data.innerText = JSON.stringify(response);
    const entries = response.entries;
    for (let i = 0; i < entries.length; i++) {
      console.log('recordHintLink=' + entries[i].id);
      console.log('recordHintTitle=' + entries[i].title)
    }
    console.log('recordHintsCount=' + response.results);
  }
  else if (recordHintsRequest.readyState === 4 && recordHintsRequest.status === 204) {
    const data = document.getElementById('recordHintsData');
    data.innerText = JSON.stringify('No record hints for pid=' + pid);
    console.log('No record hints')
  }
}

const templeStatusRequest = new XMLHttpRequest();
templeStatusRequest.open('GET', 'https://beta.familysearch.org/tree/temple-status/person/' + pid + '/icon?sessionId=' + sessionId, true);
templeStatusRequest.setRequestHeader('accept', 'application/json');
templeStatusRequest.send();
templeStatusRequest.addEventListener('readystatechange', processTempleStatusRequest, false);

function processTempleStatusRequest() {
  if (templeStatusRequest.readyState === 4 && templeStatusRequest.status === 200) {
    const response = JSON.parse(templeStatusRequest.responseText);
    const data = document.getElementById('templeStatusIcon');
    data.innerText = 'templeStatusIcon=' + response.status;
  }
}

const fsUserRequest = new XMLHttpRequest();
fsUserRequest.open('GET', 'https://beta.familysearch.org/fs-user/users/' + cisId + '/preferences?name=tree.showLDSTempleInfo&sessionId=' + sessionId, true);
fsUserRequest.setRequestHeader('accept', 'application/json');
fsUserRequest.send();
fsUserRequest.addEventListener('readystatechange', processFsUserRequest, false);

function processFsUserRequest() {
  if (fsUserRequest.readyState === 4 && fsUserRequest.status === 200) {
    const response = JSON.parse(fsUserRequest.responseText);
    const data = document.getElementById('fsUserData');
    data.innerText = '---USER PREFERENCES---\n Additional preferences should be added to the list fs-user call\n' + JSON.stringify(response);
  }
}

const recentsRequest = new XMLHttpRequest();
recentsRequest.open('GET', 'https://beta.familysearch.org/platform/users/' + cisId + '/history?sessionId=' + sessionId, true);
recentsRequest.setRequestHeader('accept', 'application/json');
recentsRequest.send();
recentsRequest.addEventListener('readystatechange', processRecentsRequest, false);

function processRecentsRequest() {
  if (recentsRequest.readyState === 4 && recentsRequest.status === 200) {
    const response = JSON.parse(recentsRequest.responseText);
    const data = document.getElementById('recentsData');
    data.innerText = JSON.stringify(response);
    const entries = response.entries;
    // for (let i = 0; i < entries.length; i++) {
    //   console.log('recentDisplayName=' + entries[i].content.gedcomx.persons[0].display.name); //  TODO: need to null check
    //   console.log('recentPid=' + entries[i].id);
    // }
      console.log('recentDisplayName=' + entries[0].content.gedcomx.persons[0].display.name);
      console.log('recentPid=' + entries[0].id);
  }
}

const changeSummary = new XMLHttpRequest();
changeSummary.open('GET', 'https://beta.familysearch.org/tf/person/' + pid + '/changes/summary?sessionId=' + sessionId, true);
changeSummary.setRequestHeader('accept', 'application/json');
changeSummary.send();
changeSummary.addEventListener('readystatechange', processChangesSummaryRequest, false);

function processChangesSummaryRequest() {
  if (changeSummary.readyState === 4 && changeSummary.status === 200) {
    const response = JSON.parse(changeSummary.responseText);
    const data = document.getElementById('changeLogSummary');
    data.innerText = JSON.stringify(response);
    console.log('recentDisplayName=' + response.changes.length);
  }
}