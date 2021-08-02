const express = require('express');
const socket = require("socket.io");
var io = require("socket.io-client");


var serverPort = 3000;
var serverUri = "http://localhost"

console.log("Connecting to: "+serverUri+':'+serverPort+"/petra");

//initiate server connection with header+handshake authorization
const server = io(serverUri+':'+serverPort+"/petra", {
  extraHeaders: {
    Authorization: "123",  //headertoken
  },
  auth: {
    token: "123" //socket handshake token
  }
});

//on connection with server
server.on("connect", function() {
  console.log("Server connection established");
  server.emit("lol");
});

//error on connection (most likely invalid token)
server.on("connect_error", (err) => {
  console.log("Connection failed! : "+err.message); // error message
});

server.on('test', function(){
  console.log("test received");
  server.emit('test2');
  server.send();
})

server.on('disconnect', function(){
  console.log("connection lost!");
})