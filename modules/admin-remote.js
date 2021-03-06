const protube = require('../protube');
const admin = io.of('/socket/admin');
const logger = require('../utils/logger');
const queue = require('./queue-manager');
const screenCode = require('./screencode');
const playbackManager = require('./playback-manager')
// const userDataFetcher = require('./user');
const authenticator = require('./authenticator.js');
const fetch = require('node-fetch');

updateRadioStations();

// needs to be changed with randomness/sufficiently large interval to prevent ip ban
setInterval(async () => {
  await updateRadioStations
}, 1800*1000);

admin.use(async (socket, next) => {
  logger.adminInfo(`Admin from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
  try{
    // if cookie is valid and has admin rights
    if(await authenticator.validateAdmin(socket.handshake.headers.cookie)){
      logger.adminInfo(`Authorized admin ${socket.id}`);
      return next();
      // cookie is valid but no admin
    } else {
      logger.adminInfo(`${socket.id} is unauthorized`);
      return next(new Error("Not authorized"));
    }
  } catch (error){
    logger.adminInfo(`${socket.id} Failed to connect with: ${error.toString()}`)
  }
  // proto_session cookie is invalid/ non existent
  logger.adminInfo(`Failed authentication - ${socket.id}`);
  return next(new Error("Unable to validate"));
}).on('connection', socket => {
  logger.adminInfo(`Successfully connected - ${socket.id}`);

  socket.on('disconnect', () => {
    logger.adminInfo(`Disconnected admin socket: ${socket.id}`)
  });

  socket.on('get_screen_code', callback => {
    logger.adminInfo(`Requested the screen code: ${socket.id}`);
    callback(screenCode.getScreenCode());
  });

  socket.on('get-player-status', callback => {
    callback(protube.getPlayerStatus());
  });

  socket.on('get-user-data', async (callback) => {
    logger.adminInfo(`${socket.id} Requested user data`);
    try{
      callback(await authenticator.getSessionData(socket.handshake.headers.cookie));
    } catch{
      callback(new Error('Unable to fetch userdata'));
    }
  });

  socket.on('get-video-queue', (callback) => {
    logger.adminInfo(`${socket.id} Requested video queue`)
    callback({
      queue: queue.getQueue(),
      duration: queue.getTotalDuration()
    });
  });

  socket.on('remove-video', (video, callback) => {
    logger.adminInfo(`${socket.id} Requested video removal of ${video.title}`)
    const videoStatus = queue.removeVideo(video);
    callback(videoStatus);
  });

  socket.on('toggle-radio-protube', async (callback) => {
    logger.adminInfo(`${socket.id} Toggling protube or radio`);
    playbackManager.toggleType();
    callback(protube.getPlayerStatus());
  });

  socket.on('create-new-screen-code', async () => {
    logger.adminInfo(`${socket.id} Requested new screencode`);
    // authenticator.flushAllSessions();
    await screenCode.adminResetScreenCode();
  });

  socket.on('set-radio', async (station, callback) => {
    logger.adminInfo(`${socket.id} Setting the radio to: ${station}`);
    let newStation = validateRadioStation(station);
    if(newStation) {
      playbackManager.setRadio(newStation);
      callback(true);
    }
    callback(false);
  });

  socket.on('play-pause', async (callback) => {
    logger.adminInfo(`${socket.id} Requested to play/pause the content`);
    callback(playbackManager.playPause());
  });

  socket.on('skip', (callback) => {
    logger.adminInfo(`${socket.id} Requested to skip a video`);
    callback(playbackManager.skipVideo());
  });

  // change the screen's volume 
  socket.on('volume-change', (volume, callback) => {
    logger.adminInfo(`${socket.id} Requested to change the volume to: ${volume}`);
    callback(playbackManager.setVolume(volume));
    admin.emit('admin-new-volume', volume);
  });

  // change the screen's volume 
  socket.on('get-volume', (callback) => {
    callback(playbackManager.getVolume());
  });

  socket.on('get-all-radiostations', (callback) => {
    callback(playbackManager.getStations());
  });
});

communicator.on('new-screen-code', (screenCode) => {
  admin.emit('admin-new-screen-code', screenCode);
});

communicator.on('queue-update', () => {
  admin.emit('admin-queue-update', {
    queue: queue.getQueue(),
    duration: queue.getTotalDuration()
  });
});

communicator.on('player-update', () => {
  admin.emit('admin-player-update', protube.getPlayerStatus());
})

// // broadcast new volume to all connected admins
// communicator.on('new-volume', (volume) => {
//   admin.emit('admin-new-volume', volume);
// });

async function updateRadioStations(){
  try {
    response = await fetch('https://www.nederland.fm/common/radio/zenders/nederland.js');
    const data = await response.text();
    playbackManager.setStations(JSON.parse(await data.split(' = ')[1]).items);
  } catch(e) {
    logger.serverError("Error at updating radio stations!");
  }
}

// check if the radio we're trying to set is really valid
function validateRadioStation(radiostation){
  let foundStation = false;
  playbackManager.getStations().forEach((station) => {
    if(radiostation === station.z){
      //found our specified station in the available stations list, resolve the station
      foundStation = station;
    }
  });
  return foundStation;
}