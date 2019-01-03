const http = require('http');
const fs = require('fs');

const hostname = 'localhost';
const port = 8080;

const server = http.createServer(function (req, res) {
  if (req.url.indexOf('.js') !== -1) { // going to just return one js file
    fs.readFile('slimPersonPage.js', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.write(data);
      res.end();
    });
  }
  else if (req.url.indexOf('.css') !== -1) {
    fs.readFile('slimPersonPage.css', function(err, data) { // going to just return one css file
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(data);
      res.end();
    });
  }
  else if (req.url.indexOf('.ico') !== -1) {
    fs.readFile('favicon.png', function(err, data) { // going to just return one icon file
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.write(data);
      res.end();
    });
  }
  else {
    fs.readFile('slimPersonPage.html', function(err, data) { // going to just return one html file
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
