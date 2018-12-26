const http = require('http');
const url = require('url');

const hostname = 'localhost';
const port = 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var urlparsed = url.parse(req.url, true);
  var sessionId= urlparsed.query.sessionId;
  var personId = urlparsed.pathname;
  res.write('personId=' + personId + ' sessionId=' + sessionId);
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
