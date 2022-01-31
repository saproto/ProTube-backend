const timeFormatter = require('../utils/time-formatter');
const _ = require('lodash');

let queue = [];
let current = {};

//Add a video to the queue
exports.add = video => {
    //Check if the video is already in the queue. If so, stop here.
    if(findDoppelganger(video)) return false;

    //Video is not already in the queue, so add it
    queue.splice(queue.length/2, 0, video);
    if(_.isEmpty(current)) {
        this.moveToNext();
    }
    return true;
}

//Add a video to the first position of the queue
exports.addToTop = video => {
    //Check if the video is already in the queue
    let doppelganger = findDoppelganger(video);
    if(doppelganger) {
        //Found a double! Move the video to the top
        queue.splice(queue.indexOf(doppelganger)).unshift(video);
        return false;
    }
    //Video is not already in the queue, so add it to the top
    queue.unshift(video);
    return true;
}

//Update the current video with the video in queue position 0, and remove it from the queue
exports.moveToNext = () => {
    current = queue[0];
    queue.shift();
    communicator.emit('new-video', current);
}

exports.removeFirst = () => queue.shift();
exports.getCurrent = () => current;
exports.getNext = () => queue[0];
exports.getQueue = () => queue;

//Calculate the total duration of the playlist and return it
exports.getTotalDuration = () => {
    let sum = 0;
    queue.forEach(video => sum += video.seconds);
    return timeFormatter.format_hh_mm_ss(sum);
}

//Check for an identical video in the queue
const findDoppelganger = video => {
    return queue.filter(spot => spot.videoId === video.videoId)[0];
}

communicator.on('video-ended', () => {
    if(queue.length > 0) this.moveToNext();
    else current = {};
});