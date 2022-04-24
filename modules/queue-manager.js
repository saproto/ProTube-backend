const fetch = require('node-fetch');
const timeFormatter = require('../utils/time-formatter');
const logger = require('../utils/logger');
const playbackManager = require('./playback-manager');

let queue = [];
let current = {};

//Add a video to the queue
exports.addFair = video => {
    //Check if the video is already in the queue. If so, stop here.
    if(findDoppelganger(video)) return false;

    performFairAdd(video);
    communicator.emit('queue-update');
    logger.queueInfo(`Added "${video.title}" to queue`);
    return true;
}

exports.addAllFair = videos => {
    for(video of videos) {
        //Check if the video is already in the queue. If so, skip it.
        if(findDoppelganger(video)) continue;

        performFairAdd(video);
    }
    communicator.emit('queue-update');
    logger.queueInfo(`Added ${videos.length} videos to queue`);
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
    communicator.emit('queue-update');
    logger.queueInfo(`Added "${video.title}" to top of queue`);
    return true;
}

//Update the current video with the video in queue position 0, and remove it from the queue
exports.moveToNext = async () => {
    // Queue has an item, can be shifted
    if(queue.length > 0){
        current = queue[0];
        queue.shift();
        if(current.user) {
            await fetch(`${process.env.API_ENDPOINT}/played?` + new URLSearchParams({
                secret: process.env.API_SECRET,
                user_id: current.user.user_id,
                video_id: current.id,
                video_title: current.title
            }));
        }
        communicator.emit('queue-update');
        return true;
    }else if(current && queue.length === 0) {
        current = {};
        communicator.emit('queue-update');
        return true;
    }
    return false;
}

// Removing a specific video from the queue
exports.removeVideo = (video) => {
    let toDeleteIndex = null;
    queue.forEach((item, index) => {
        if(item.id === video.id){
            toDeleteIndex = index;
            return true;
        } return false;
    });
    if(toDeleteIndex >= 0){
        queue.splice(toDeleteIndex, 1);
        communicator.emit('queue-update');
        return true;
    }
    return false;
}

exports.removeFirst = () => queue.shift();
exports.getCurrent = () => current || null;
exports.getNext = () => queue[0];
exports.getQueue = () => queue;
exports.isQueueEmpty = () => queue.length <= 0;

//Calculate the total duration of the playlist and return it
exports.getTotalDuration = () => {
    let sum = 0;
    queue.forEach(video => sum += video.duration);
    return timeFormatter.format_hh_mm_ss(sum);
}

//Check for an identical video in the queue
const findDoppelganger = video => {
    return queue.filter(spot => spot.id === video.id)[0];
}

const performFairAdd = video => {
    //If there is nothing in the queue, play the video.
    if(!this.getCurrent() && this.isQueueEmpty()) {
        queue.push(video);
        this.moveToNext();
    }else{
        //Get a random index in the bottom half of the queue and insert the video there
        let insertIndex = Math.floor(queue.length / 2) + Math.round(((Math.ceil(queue.length / 2) - 1) * Math.random()))
        queue.splice(insertIndex, 0, video);
    }
}

communicator.on('video-ended', () => {
    if(queue.length > 0) this.moveToNext();
    else current = {};
});