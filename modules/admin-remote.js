const admin = io.of('/socket/admin');
const logger = require('../utils/logger');
const { getQueue, moveToNext } = require('./queue-manager');
const screenCode = require('./screencode');
const playbackManager = require('./playback-manager')
const userDataFetcher = require('./user');
const { Curl } = require("node-libcurl");

admin.use((socket, next) => {
  logger.adminInfo(`Admin from ${socket.handshake.address} with id ${socket.id} attempted to connect, validating...`);
  if(validateAdmin(socket.handshake.auth.token)){
    //validated admin, generating sessionID
    logger.adminInfo(`Authorized admin ${socket.id}`);
    return next();
  }
  logger.adminInfo(`Failed authentication - ${socket.id}`);
  return next(new Error("Not authorized"));
  //end middleware
}).on('connection', socket => {
  const proto_session_token = socket.handshake.auth.token;
  logger.adminInfo(`Successfully connected - ${socket.id}`);

  socket.on('disconnect', () => {
    logger.adminInfo(`Disconnected admin socket: ${socket.id}`)
  });

  socket.on('get_screen_code', callback => {
    logger.adminInfo(`Requested the screen code: ${socket.id}`);
    callback(screenCode.getScreenCode());
  });

  socket.on('get-user-data', (callback) => {
    logger.adminInfo(`${socket.id} Requested user data`)
    callback(userDataFetcher.getUserData(proto_session_token));
  });

  socket.on('get-video-queue', (callback) => {
    logger.adminInfo(`${socket.id} Requested video queue`)
    callback(getQueue());
  });

  socket.on('create-new-screen-code', () => {
    logger.adminInfo(`${socket.id} Requested new screencode`);
    screenCode.adminResetScreenCode();
  });

  socket.on('set-radio', async (radiostation, callback) => {
    logger.adminInfo(`${socket.id} Set the radio to: ${radiostation}`);
    let station_to_play = await validateRadioStation(radiostation);
    if(station_to_play){
      playbackManager.switchRadio(station_to_play);
      callback(true);
    }
    callback(false);
  });

  socket.on('resume-protube', async (callback) => {
    logger.adminInfo(`${socket.id} Requested to resume ProTube`);
    callback(playbackManager.resumeProTube());
  });

  socket.on('skip-next-in-queue', (callback) => {
    logger.adminInfo(`${socket.id} Requested to skip a video`);
    moveToNext();
    callback(1);
  });
});

communicator.on('newScreenCode', (screenCode) => {
  admin.emit('admin-newscreencode', screenCode);
});

communicator.on('queue-update', () => {
  admin.emit('admin-queue-update', getQueue());
});

// use this function to authorize an incoming admin request (return a boolean)
function validateAdmin(proto_session_token){
  // check if the session token is a valid account and then check if that account has admin rights
  return userDataFetcher.logInUser(proto_session_token) && userDataFetcher.getUserData(proto_session_token).isAdmin;
}

// check if the given radiostation is valid
async function validateRadioStation(radiostation){
  const curler = new Curl();
  curler.setOpt(Curl.option.URL, 'https://www.nederland.fm/common/radio/zenders/nederland.js');

  curler.perform();

  return await new Promise( resolve => {
    curler.on("end", function (statusCode, data, headers) {
      if(statusCode == 200){
        let stations = JSON.parse(data.split(' = ')[1]);
        stations.items.forEach((station) => {
          if(radiostation === station.z){
            resolve(station);
          }
        });
      }
      this.close();
      resolve(false);
    });
  });
}