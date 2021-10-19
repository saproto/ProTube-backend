const logger = require('./logger');

const youtubeSearch = require('yt-search');

//Search for a YouTube video
exports.search = async(query) => {
    logger.youtubeInfo(`Search initiated for query ${query}`);

    const {videos} = await youtubeSearch(query);
    if(!videos) return new Error('Could not find any videos');
    return videos.filter(video => video.seconds <= (parseInt(process.env.YOUTUBE_MAX_DURATION) || 600));
}
