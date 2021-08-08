require('dotenv').config();
const {search} = require('./yt');
const queue = require('./queue-manager');

(async() => {
    let videos = await search('never gonna give you up');
    queue.add(videos[0]);
    queue.add(videos[1]);
    console.log(queue.getTotalDuration()); 
    queue.moveToNext();
    console.log(`Now playing: ${queue.getCurrent().title}, next up: ${queue.getNext().title}`);
    console.log(queue.getTotalDuration());
})();

