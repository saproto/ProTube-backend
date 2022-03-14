const io = window.io = require('socket.io-client');
const socket = new io('http://localhost:3000/screen');
import { eventBus } from '@/eventbus.js';
let player;
let current;
let radio = false;
let nowPlaying;

export { onYouTubeIframeAPIReady }
function onYouTubeIframeAPIReady() {
    player = new window.YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: '',
        playerVars: {
            autoplay: 1,
            mute: 0,
            enablejsapi: 1,
            modestbranding: 1
        },
        events: {
            'onReady': window.youtubePlayerReady,
        }
    });
}
export { youtubePlayerReady }
// eslint-disable-next-line
const youtubePlayerReady = (event) => {
    //console.log("ready");
    // player.unMute();
    socket.emit('request-player-status');
    socket.on('player-status', data => {
        nowPlaying = data.video;
        try {
            if(current !== nowPlaying.videoId && data.status != 'radio'){
                player.loadVideoById(nowPlaying.videoId);
                player.setPlaybackQuality('highres');
                setTimeout(() => {
                    player.playVideo();
                } ,100);
                current = nowPlaying.videoId;
            } else if( data.status == 'radio'){
                eventBus.emit('radio_playing', nowPlaying);
            }
            // setTimeout(() => {
            //     document.elementFromPoint(500, 500).click();
            // }, 4000)
        }catch(e) {
            //We're either not playing anything or the data was sent wrong.
        }
        switch(data.status) {
            case 'playing': player.playVideo(); break;
            case 'paused': player.pauseVideo(); break;
            case 'idle': player.stopVideo(); break;
        }
    });

    socket.on('new-timestamp', timestamp => {
        if(radio){
            radio = false;
            eventBus.emit('radio_playing', "");
            player.playVideo();
        }
        console.log(timestamp.seconds);
        console.log(player.getCurrentTime() - timestamp.seconds)
        if(Math.abs(player.getCurrentTime() - timestamp.seconds) > 5 )
            player.seekTo(timestamp.seconds, true);
    });

    socket.on('new-radio', new_radio => {
        player.stopVideo();
        radio = true;
        eventBus.emit('radio_playing', new_radio);
    });
}