const logger = require('../utils/logger');

const screen = io.of('/screen');

screen.on('connection', socket => {
    logger.screenInfo(`Screen connected from ${socket.handshake.address} with socket id ${socket.id}`);
});

communicator.on('queueUpdate', () => {
    
});