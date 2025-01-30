const express = require("express");
const ExerciseController = require("../controllers/exerciseController");

const exerciseRouter = express.Router();

// Crear un ejercicio con imagen
exerciseRouter.post(
  "/createExercise",
  ExerciseController.exerciseimageuploadmiddleware,
  ExerciseController.createExercise
);

// Obtener todos los ejercicios
exerciseRouter.get("/getAllExercise", ExerciseController.getAllExercises);

// Obtener todos los ejercicios de un usuario
exerciseRouter.get(
  "/getAllUserExercises/:id",
  ExerciseController.getAllUserExercises
);

// Remover un usuario de un ejercicio
exerciseRouter.post(
  "/removeuserfromexercise/:exerciseid/:userid",
  ExerciseController.removeuserfromexercise
);

module.exports = exerciseRouter;
