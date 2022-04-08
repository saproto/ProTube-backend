const timeFormatter = require('../utils/time-formatter');
const queueManager = require('./queue-manager');

let status = 'idle'; //playing, paused, idle
let type = 'video'; //video, radio
let lastStation = '';
let timestamp = 0;
let playbackInterval;

exports.playVideo = video => {
    type = 'video';
    status = 'playing';

    //create an interval to continuously emit the timestamp so the screen stays updated in case of e.g. buffering
    playbackInterval = setInterval(() => {
        if(timestamp < video.duration) {
            timestamp++;
            communicator.emit('new-timestamp', {
                seconds: timestamp,
                formatted: timeFormatter.format_mm_ss(timestamp)
            });
        }
        else {
            this.stopVideo();
            communicator.emit('video-ended');
            timestamp = 0;
        }
    }, 1000);
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

exports.skipVideo = () => {
    timestamp = 0;
    queueManager.moveToNext();
}

exports.toggleType = () => {
    if(type === 'video'){
        //add the current playing video back into the queue
        let video = queueManager.getCurrent();
        if(video) queueManager.addToTop(video);
        this.stopVideo();
        type = 'radio';

        //if previously a station was selected, automatically go to it
        if(lastStation) this.setRadio(lastStation);
        return;
    }
    type = 'video';
    this.skipVideo();
}

exports.setRadio = (station) => {
    if(type === 'video') this.toggleType();
    lastStation = station;
    communicator.emit('new-radio', station);
}


// play or pause the current video/radio stream
exports.playPause = () => {
    if(type === 'video'){
        if(status === 'playing' || status === 'idle') {
            this.pauseVideo();
        }else{
            if(queueManager.getCurrent()) {
                this.playVideo(queueManager.getCurrent());
            }else if(!queueManager.isQueueEmpty()) {
                queueManager.moveToNext();
                this.playVideoFromStart(queueManager.getCurrent());
            }else{
                status = 'idle';
            }
        }
        return true;
    }
    return false;
}

exports.getType = () => type;
exports.getStatus = () => status;
exports.getLastStation = () => lastStation;

communicator.on('queue-update', () => {
    if(status === 'idle' && queueManager.getCurrent()) {
        this.playVideoFromStart(queueManager.getCurrent());
    }
});