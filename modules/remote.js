const client = io.of('/socket/remote')
const youtube = require('../utils/yt');
const logger = require('../utils/logger');
const queue = require('./queue-manager');
const screencode = require('./screencode.js');
const authenticator = require('./authenticator.js');

// A new screencode was generated
communicator.on('newScreenCode', (code) => {
  authenticator.flushAllSessions();
  //disconnect all sockets
  client.disconnectSockets(false);
});

// A remote connection is attempted
client.use( async (socket, next) => {
  try{
    // if cookie is valid
    if(await authenticator.validateClient(socket.handshake.headers.cookie, socket.handshake.auth.token == screencode.getScreenCode())){
      const existingSession = await authenticator.getSessionData(socket.handshake.headers.cookie);
      if(existingSession && existingSession.screencode_correct){
        return next();
      }
    } else if(socket.handshake.auth.token != screencode.getScreenCode()){
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
    if(queue.queueIsEnabled()){
      const added = queue.add(video);
      if (added) callback({success: true, error: "Successfully added to the queue!"});
      else callback({success: false, error: "Video already in the queue!"});
    }
    callback({success: false, error: "No videos are allowed!"});
  });
});
