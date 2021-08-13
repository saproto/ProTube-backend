const timeFormatter = require('../utils/time-formatter');

let status = 'idle'; //playing, paused, idle
let timestamp = 0;
let playbackInterval;

exports.playVideo = video => {
    playbackInterval = setInterval(() => {
        if(timestamp < video.seconds) {
            timestamp++;
            communicator.emit('new-timestamp', {
                seconds: timestamp,
                formatted: timeFormatter.format_mm_ss(timestamp)
            });
        }
        else {
            communicator.emit('video-ended');
            this.stopVideo();
        }
    }, 1000);
    status = 'playing';
};

exports.playVideoFromStart = video => {
    timestamp = 0;
    this.playVideo(video);
}

exports.stopVideo = () => {
    timestamp = 0;
    clearInterval(playbackInterval);
    status = 'idle';
}

exports.pauseVideo = () => {
    clearInterval(playbackInterval);
    status = 'paused';
}

exports.getStatus = () => status;

communicator.on('new-video', video => {
    this.playVideoFromStart(video);
});