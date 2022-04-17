const protube = require('../protube');

const logger = require('../utils/logger');

const screens = io.of('/socket/screen');

screens.on('connection', socket => {
    logger.screenInfo(`Screen connected from ${socket.handshake.address} with socket id ${socket.id}`);

    socket.on('request-player-status', () => {
        updatePlayerStatus(socket)
    });
});

communicator.on('new-timestamp', timestamp => {
    screens.emit('new-timestamp', timestamp);
});

communicator.on('show-screen-code', () => {
    screens.emit('show-screen-code');
});

communicator.on('new-screen-code', screenCode => {
    screens.emit('new-screen-code', screenCode);
});

communicator.on('queue-update', () => {
    updatePlayerStatus(screens);
});

communicator.on('player-update', () => {
    updatePlayerStatus(screens);
})

const updatePlayerStatus = endpoint => {
    endpoint.emit('player-status', protube.getPlayerStatus());
}