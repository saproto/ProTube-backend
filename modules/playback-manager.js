const timeFormatter = require('../utils/time-formatter');
const queueManager = require('./queue-manager');
const remote = require('./remote');

let status = 'idle'; //playing, paused, idle, radio
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
            this.stopVideo();
            communicator.emit('video-ended');
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

exports.switchRadio = (station) => {
    if(status != 'radio'){
        this.stopVideo();
        status = 'radio';
        queueManager.addToTop(queueManager.getCurrent());
        remote.blockQueue();
    }
    queueManager.setRadio(station);
}

exports.resumeProTube = () => {
    if(status == 'radio'){
        if(queueManager.getQueue().length > 0){
            this.playVideoFromStart(queueManager.getNext());
            queueManager.removeFirst();
            communicator.emit('queue-update');
        } else {
            return false;
        }
        remote.enableQueue();
        return true;
    }
    return false;
}

exports.getStatus = () => status;

communicator.on('new-video', video => {
    clearInterval(playbackInterval);
    this.playVideoFromStart(video);
});