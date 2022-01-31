const express = require('express');
const bearerToken = require('express-bearer-token')
exports.apiRouter = express.Router();
const protube = require('../protube');
const admin_remote = require('../modules/admin-remote')

//api authentication with bearer token -everything below is authorized
this.apiRouter.use(bearerToken());
this.apiRouter.use(function (req, res, next) {
    if (req.token == process.env.API_KEY) next();
    res.status(401).json({
        success: false,
        message: 'Not Authorized for this API'
    });
});

//volume management
this.apiRouter.get('/setvolume/:type/:volume', (req, res) => {
    volume = parseInt(req.params.volume);
    type = req.params.type;

    if (typeof volume !== 'number' || isNaN(volume) || volume < 0 || volume > 100) {
        return res.json({
            success: false,
            message: 'incorrect volume'
        });
    }
    if (type === "radio" || type === "master" || type === "youtube") {
        return admin_remote.changeVolume(type, volume);
    }
    res.json({
        success: false,
        modified: type,
        message: 'incorrect type'
    });
});

//fetch current item playing
this.apiRouter.get('/currentlyplaying', (req, res) => {
    return res.json({
        success: true,
        video: protube.getCurrentVideo(),
        status: protube.getStatus(),
        message: 'currently playing'
    });
});

//fetch queue
this.apiRouter.get('/queue', (req, res) => {
    return res.json({
        success: true,
        video_queue: protube.getQueue(),
        total_duration: protube.getQueueDuration(),
        message: 'queue - bug: returns video even though it has ended'
    });
});

//unmatched paths
this.apiRouter.use(function (req, res) {
    return res.json({
        success: false,
        message: 'not a path'
    });
});

//allow/block queue input

//play/pause video etc

//set to radio or livestream maybe?