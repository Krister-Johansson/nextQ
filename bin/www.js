"use strict";

const app = require('../app.js');
const http = require('http');

const server = http.createServer(app);
const port = (process.env.PORT || '3000');

app.set('port', port);

server.listen(port);

server.on('error', (error) => {
  throw new Error(error);
});

server.on('listening', () => {
  let addr = server.address();
  console.log('Listening on ' + addr.port);
});