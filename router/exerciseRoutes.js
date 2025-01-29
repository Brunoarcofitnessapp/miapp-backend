const express = require('express');
const ExerciseController = require('../controllers/exerciseController')

const exerciseRouter = express.Router();

exerciseRouter.post('/createExercise',ExerciseController.exerciseimageuploadmiddleware,ExerciseController.createExercise)
exerciseRouter.post('/removeuserfromexercise/:id',ExerciseController.removeuserfromexercise)
exerciseRouter.get('/getAllExercise',ExerciseController.getAllExercises)
// exerciseRouter.post('/getExercises/:id',ExerciseController.getExercises)
exerciseRouter.get(
    "/getAllUserExercises/:id",
    ExerciseController.getAllUserExercises
  );

module.exports = exerciseRouter
