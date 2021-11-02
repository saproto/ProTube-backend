const protube = require('../protube');

const logger = require('../utils/logger');

const screens = io.of('/screen');

screens.on('connection', socket => {
    logger.screenInfo(`Screen connected from ${socket.handshake.address} with socket id ${socket.id}`);

    socket.on('request-player-status', () => {
        socket.emit('player-status', {
            status: protube.getStatus(),
            video: protube.getCurrentVideo()
        });
    });
});

communicator.on('new-timestamp', timestamp => {
    screens.emit('new-timestamp', timestamp);
});

communicator.on('new-video', video => {
    screens.emit('player-status', {
        status: protube.getStatus(),
        video: protube.getCurrentVideo()
    });
});

communicator.on('queue-update', () => {
    
});