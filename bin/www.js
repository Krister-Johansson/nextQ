var app = require('../app');
var http = require('http');

var port = (process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError (error) {
    console.error(error);
    process.exit(1);
}

function onListening() {
  var addr = server.address();
  console.log('Listening on ' + addr.port);
}