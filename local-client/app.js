require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const io = require('socket.io-client');
const musicPlayer = require("sound-play");
const electron = require('electron');
const app = electron.app; 
const { BrowserWindow, BrowserView } = require('electron')
let win, soundboardWin;

const serverUrl = process.env.SOCKET_URL;

//initiate server connection with header+handshake authorization
const server = io(serverUrl, {
  auth: {
    token: process.env.CLIENT_IDENTIFIER //socket handshake token
  },
  reconnection: true,
  autoConnect: true,
});



//on connection with server
server.on('connect', () => {
  console.log('[SOCKET] Server connection established');
  //on successfull socket connection display the protube screen
  win.loadURL(process.env.SCREEN_URL);
  view = new BrowserView();
  view.setAutoResize({ width: true, height: true, horizontal: true, vertical: true });
  win.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, width: Number(process.env.CODE_SIZE), height: Number(process.env.CODE_SIZE) });
});

//error on connection (most likely invalid token)
server.on('connect_error', err => {
  console.log(`[SOCKET] Connection failed! | ${err.message}`); // error message
});

//on socket disconnect, display the fancy loading screen again
server.on('disconnect', () => {
  console.log('[SOCKET] Connection lost!');
  win.loadURL(`file://${__dirname}/webpages/loading_screen/index.html`);
})

server.on('newScreenCode', (code) => {
  console.log(`[SOCKET] Received new screen code: ${code}`);
  view.webContents.loadURL(`file://${__dirname}/webpages/code_overlay/index.html?code=${code}`);
});

//on received of playsound, mutes the protube, pops up a small overlay+site and videoname and plays.
//resumes to protube when the soundboard is done
server.on('playsound', (sound) => {
  console.log(`[SOUNDBOARD] Soundboard requested`);
  win.webContents.setAudioMuted(true);  //mute protube screen
  soundboardWin.setSize(win.getSize()[0], win.getSize()[1], false); //set overlay to protube screens format
  soundboardWin.loadURL(`file://${__dirname}/webpages/audio_playing/index.html?sound=${sound}`);  //set text to the soundboard screen
  //soundboardWin.webContents.openDevTools();
  soundboardWin.show();
  //play the soundboard sound
  console.log(`[SOUNDBOARD] Playing sound ${sound}...`);
  musicPlayer.play(`${process.env.SOUND_LIBRARY_ABSOLUTE_PATH}${sound}`).catch((err) => {
    //catch errors and resume as if nothing happened
    console.log(`[SOUNDBOARD] Error during playing of ${process.env.SOUND_LIBRARY_ABSOLUTE_PATH}${sound}`);
    console.log(`[SOUNDBOARD] ${err}`);
    soundboardWin.hide();
    win.webContents.setAudioMuted(false);
  }).then((response) => {
    //audio finished, resume protube
    console.log(`[SOUNDBOARD] Playing sound ${sound} finished, resumed protube screen`);
    soundboardWin.hide();
    win.webContents.setAudioMuted(false);
  });
})

app.on('ready', () => {
    //setting up main window
    win = new BrowserWindow({ width: 800, height: 600 })
    //fancy loading screen before it has connected to protube
    win.loadURL(`file://${__dirname}/webpages/loading_screen/index.html`);
    win.isClosable(true);
    win.isFullScreenable(true);
    //win.setFullScreen(true);
    //setup small screen popup for soundboard
    soundboardWin = new BrowserWindow({ width: 800, height: 600, parent: win ,modal: true, show: false})
    soundboardWin.setBackgroundColor("#242f3f");
    console.log(`[SOCKET] Connecting to ${serverUrl}...`);
})
