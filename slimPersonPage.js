const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');
const pid = urlParams.get('pid');
alert('sessionId=' + sessionId + " pid=" + pid);
