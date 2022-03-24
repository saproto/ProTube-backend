const io = window.io = require('socket.io-client');
let socket = null;
import { eventBus } from '@/js/eventbus.js';
let player;
let current;
let radio = false;
let nowPlaying;

// called by the yt iframe api, this triggers the entire screen
export { onYouTubeIframeAPIReady }
function onYouTubeIframeAPIReady() {
    socket = new io('http://localhost:3000/screen');

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
    socket.emit('request-player-status');
    socket.on('player-status', data => {
        console.log(data);
        nowPlaying = data.video;
        try {
            if(current !== nowPlaying.videoId && data.status != 'radio' && data.status != 'radio-ending'){
                player.loadVideoById(nowPlaying.videoId);
                player.setPlaybackQuality('highres');
                setTimeout(() => {
                    player.playVideo();
                } ,100);
                current = nowPlaying.videoId;
            } else if( data.status == 'radio' || data.status == 'radio-ending'){
                eventBus.emit('radio_playing', nowPlaying);
            }
            if( data.status == 'radio-ending'){
                eventBus.emit('show-screencode');
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

    // used for video synchronizations
    socket.on('new-timestamp', timestamp => {
        if(radio){
            socket.emit('request-player-status');
            radio = false;
            eventBus.emit('radio_playing', "");
            player.playVideo();
        }
        console.log(timestamp.seconds);
        console.log(player.getCurrentTime() - timestamp.seconds)
        if(Math.abs(player.getCurrentTime() - timestamp.seconds) > 5 )
            player.seekTo(timestamp.seconds, true);
    });

    // a radio station was requested
    socket.on('new-radio', new_radio => {
        player.stopVideo();
        radio = true;
        eventBus.emit('radio_playing', new_radio);
    });

    // update the screencode on the screen 
    socket.on('new-screencode', new_code => {
        eventBus.emit('new-screencode', new_code);
    }); 

    // re-show screencode on radio -> protube switch
    socket.on('show-screencode', () => {
        eventBus.emit('show-screencode');
    });
}