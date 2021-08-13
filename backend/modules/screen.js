const protube = require('../protube');

const logger = require('../utils/logger');

const screen = io.of('/screen');

screen.on('connection', socket => {
    logger.screenInfo(`Screen connected from ${socket.handshake.address} with socket id ${socket.id}`);

    socket.on('request-player-status', () => {
        socket.emit('player-status', {
            status: protube.getStatus(),
            video: protube.getCurrentVideo()
        });
    });
});

communicator.on('new-timestamp', timestamp => {
    screen.emit('new-timestamp', timestamp);
});

communicator.on('queueUpdate', () => {
    
});