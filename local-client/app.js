require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const io = require('socket.io-client');


const serverPort = 4444;
const serverHost = 'http://localhost';
const serverUrl = `${serverHost}:${serverPort}/petra`;

console.log(`[SOCKET] Connecting to ${serverUrl}...`);

//initiate server connection with header+handshake authorization
const server = io(serverUrl, {
  auth: {
    token: process.env.CLIENT_IDENTIFIER //socket handshake token
  }
});

//on connection with server
server.on('connect', () => {
  console.log('[SOCKET] Server connection established');
});

//error on connection (most likely invalid token)
server.on('connect_error', err => {
  console.log(`[SOCKET] Connection failed! | ${err.message}`); // error message
  process.exit(1);
});

server.on('test', () => {
  console.log("test received");
  server.emit('test2');
})

server.on('disconnect', () => {
  console.log('[SOCKET] Connection lost!');
})