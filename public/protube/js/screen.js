
const socket = io('http://localhost:3000/screen');

let player;
let current;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
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
            'onReady': youtubePlayerReady,
        }
    });
}
const youtubePlayerReady = (event) => {
    //console.log("ready");
    // player.unMute();
    socket.emit('request-player-status');
    socket.on('player-status', data => {
        nowPlaying = data.video;
        try {
            if(current !== nowPlaying.videoId)
            player.loadVideoById(nowPlaying.videoId);
            player.setPlaybackQuality('highres');
            // setTimeout(() => {
            //     player.playVideo();
            // } ,100);
            current = nowPlaying.videoId;
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
        console.log(timestamp.seconds);
        console.log(player.getCurrentTime() - timestamp.seconds)
        if(Math.abs(player.getCurrentTime() - timestamp.seconds) > 5 )
            player.seekTo(timestamp.seconds, true);
    });
}