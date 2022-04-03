const client = io.of('/socket/remote')
const youtube = require('../utils/yt');
const logger = require('../utils/logger');
const queue = require('./queue-manager');
const screencode = require('./screencode.js');
const authenticator = require('./authenticator.js');

// A new screencode was generated
communicator.on('newScreenCode', (code) => {
  //disconnect all sockets
  client.disconnectSockets(false);
});

// A remote connection is attempted
client.use(async (socket, next) => {
  try{
    // if cookie is valid
    logger.clientInfo(`${socket.id} attempts to connect to the remote`);
    if(await authenticator.validateClient(socket.handshake.headers.cookie, socket.handshake.auth.token == screencode.getScreenCode())){
      const existingSession = await authenticator.getSessionData(socket.handshake.headers.cookie);
      // if screencode is also valid, continue
      if(existingSession && existingSession.screencode_correct){
        return next();
      }
      // valid cookie, invalid screencode
      logger.clientInfo(`${socket.id} Failed to connect with incorrect screencode`);
      return next(new Error("Invalid screencode"));
    }
  } catch (error){
    logger.clientInfo(`${socket.id} Failed to connect with: ${error.toString()}`)
  }
  // proto_session cookie is invalid/ non existent
  return next(new Error("Not authorized"));
}).on('connection', (socket) => {
  logger.clientInfo(`Successfully connected - ${socket.id}`);

  socket.on('disconnect', (error) => {
    console.log(error);
    logger.clientInfo(`Disconnected socket: ${socket.id}`)
  });

  socket.on('retrieveVideos', async (search_string, callback) => {
    const videos = await youtube.search(search_string);
    callback(videos);
    logger.youtubeInfo('Returned list of music to client (remote)');
  });

  socket.on('addVideoToQueue', (video, callback) => {
      const added = queue.addFair(video);
      if (added) {
        callback({success: true, error: "Successfully added to the queue!"});
      } else {
        callback({success: false, error: "Video already in the queue!"});
      }
  });
});
