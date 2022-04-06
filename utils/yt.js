const logger = require('./logger');
const {format_mm_ss} = require('./time-formatter');

const {Client} = require('youtubei');
const youtube = new Client();

//search for a YouTube video
exports.search = async(query) => {
    logger.youtubeInfo(`Search initiated for query ${query}`);
    const videos = await youtube.search(query, {type: 'video'});
    if(!videos) return new Error('Could not find any videos');
    videos.map(video => sanitizeVideo(video));
    return videos.filter(video => video.duration <= (parseInt(process.env.YOUTUBE_MAX_DURATION) || 600));
}

//get metadata for a single YouTube video
exports.getVideo = async(videoId) => {
    logger.youtubeInfo(`Getting metadata for video ${videoId}`);
    let video = await youtube.getVideo(videoId);
    if(!video) return new Error('Could not find this video');
    video = sanitizeVideo(video);
    if(video.duration > (parseInt(process.env.YOUTUBE_MAX_DURATION) || 600)) return new Error('Video is too long.');
    return video;
}

//get all videos of a playlist and return them
exports.getVideosInPlaylist = async(playlistId) => {
    logger.youtubeInfo(`Getting videos associated with playlist ${playlistId}`);
    let playlist = await youtube.getPlaylist(playlistId);
    if(!playlist) return new Error('Could not find that playlist');
    let {videos} = playlist;
    if(!videos) return new Error('Could not find any videos');
    videos.map(video => sanitizeVideo(video));
    return videos.filter(video => video.duration <= (parseInt(process.env.YOUTUBE_MAX_DURATION) || 600));
}

const sanitizeVideo = video => {
    if(video.related) delete video.related;
    if(video.comments) delete video.comments;
    delete video.client;
    video.channel = video.channel.name;
    video.thumbnail = video.thumbnails[video.thumbnails.length - 1];
    video.durationFormatted = format_mm_ss(video.duration);
    delete video.thumbnails;
    return video;
}
