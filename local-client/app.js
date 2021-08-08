require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const io = require('socket.io-client');

var videoPlayer = require("./videoPlayer");

const serverPort = 4444;
const serverHost = 'http://localhost';
const serverUrl = `${serverHost}:${serverPort}/petra`;
const reconnectDelay = 5000;
const reconnectAttempts = 5;
//initiate server connection with header+handshake authorization
const server = io(serverUrl, {
  auth: {
    token: process.env.CLIENT_IDENTIFIER //socket handshake token
  },
  reconnection: true,
  autoConnect: true,
  reconnectionAttempts: reconnectAttempts,
  reconnectionDelay: reconnectDelay,
  timeout: 5000,
});

//on connection with server
server.on('connect', () => {
  console.log('[SOCKET] Server connection established');
  connectionSuccessfull();
});

//error on connection (most likely invalid token)
server.on('connect_error', err => {
  console.log(`[SOCKET] Connection failed! | ${err.message}`); // error message
  serverConnectionFailed();
  //process.exit(1);
});

server.on('disconnect', () => {
  console.log('[SOCKET] Connection lost!');
})

//should be in a second file
const electron = require('electron');
const app = electron.app; 
const { BrowserWindow } = require('electron')
let win;// = new BrowserWindow({ width: 800, height: 600 })

let reconnectCounter = 0;

app.on('ready', () => {
    win = new BrowserWindow({ width: 800, height: 600 })
    console.log(`[SOCKET] Connecting to ${serverUrl}...`);
    serverConnectionAttempt();
    socket
    //win.loadURL('https://www.youtube.com/embed/LDU_Txk06tM')
})

function serverConnectionFailed() {
  //win.loadURL('https://www.youtube.com/embed/LDU_Txk06tM');
  //win.setProgressBar(0.2);
  reconnectCounter++;
  if (reconnectCounter < reconnectAttempts) {
    var html = [
      "<body>",
      `<h1>Connection failed! (${reconnectCounter})</h1>`,
      `<h2>Reconnecting in ${reconnectDelay / 1000} seconds</h2>`,
      "</body>",
    ].join("");
    win.loadURL('data:text/html;charset=utf-8,' + encodeURI(html));
  } else{
    serverOffline();
  }
  //console.log('[SOCKET] Connection failed!');
}

function serverConnectionAttempt(){
  //win.loadURL('https://www.youtube.com/embed/LDU_Txk06tM');
  //win.setProgressBar(0.2);
  server.connect();
  var html = [
    "<body>",
      "<h1>Attempting to connect...</h1>",
    "</body>",
  ].join("");
  win.loadURL('data:text/html;charset=utf-8,' + encodeURI(html));
}

function serverOffline(){
  var html = [
    "<body>",
      `<h1>Multiple unsuccessfull connections</h1>`,
      `<h2>ProTube was unable to start, retry starting ProTube in 15 minutes</h2>`,
      `<h2>HYTTIOAOAC has been notified of this error</h2>`,
    "</body>",
  ].join("");
  win.loadURL('data:text/html;charset=utf-8,' + encodeURI(html));
}

function connectionSuccessfull(){
  win.loadURL('https://www.youtube.com/embed/LDU_Txk06tM');
}