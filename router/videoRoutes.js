const express = require("express");
const VideoController = require("../controllers/videoController");

const videorouter = express.Router();

// Subir un video
videorouter.post(
  "/uploadVideo",
  VideoController.uploadvideomiddleware,
  VideoController.createVideo
);

// Obtener todos los videos
videorouter.get("/getAllVideos", VideoController.getAllVideos);

module.exports = videorouter;
