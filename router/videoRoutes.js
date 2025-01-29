const express = require('express')
const VideoController = require('../controllers/videoController')

const videorouter = express.Router()

videorouter.post('/uploadVideo',VideoController.uploadvideomiddleware,VideoController.createVideo)
videorouter.get('/getAllVideos',VideoController.getAllVideos)


module.exports = videorouter