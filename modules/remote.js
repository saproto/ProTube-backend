const fetch = require('node-fetch');
const client = io.of('/socket/remote')
const youtube = require('../utils/yt');
const logger = require('../utils/logger');
const queue = require('./queue-manager');
const screencode = require('./screencode.js');
const authenticator = require('./authenticator.js');

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
    // console.log(error);
    logger.clientInfo(`Disconnected socket: ${socket.id}`)
  });

  socket.on('fetch-videos', async (query, callback) => {
    const videos = await youtube.search(query);
    callback(videos);
    logger.youtubeInfo('Returned list of music to client (remote)');
  });

  socket.on('fetch-then-add-playlist', async (playlistId, callback) => {
    const user = await authenticator.getSessionData(socket.handshake.headers.cookie);
    const videos = await youtube.getVideosInPlaylist(playlistId);
    videos.forEach(video => video.user = user);
    queue.addAllFair(videos);
    callback({success: true, error: "Successfully added playlist to the queue!"});
  });

  socket.on('fetch-then-add-video', async (videoId, callback) => {
    const video = await youtube.getVideo(videoId);
    video.user = await authenticator.getSessionData(socket.handshake.headers.cookie);
    const result = await addFairWithResult(video);
    callback(result);
  });

  socket.on('add-video-to-queue', async (video, callback) => {
    video.user = await authenticator.getSessionData(socket.handshake.headers.cookie);
    const result = await addFairWithResult(video);
    callback(result);
  });

  const addFairWithResult = async video => {
    const added = queue.addFair(video);
    if (added) {
      return {success: true, error: "Successfully added to the queue!"};
    }
    return {success: false, error: "Video already in the queue!"};
  }
});


