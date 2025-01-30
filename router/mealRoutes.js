const express = require("express");
const MealController = require("../controllers/mealController");

const mealRouter = express.Router();

// Ruta de prueba para verificar que el endpoint esté funcionando
mealRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Meal endpoint is working!",
  });
});

// Crear una comida con imagen
mealRouter.post(
  "/createMeal",
  MealController.createMeal
);

// Subir o actualizar una imagen de una comida existente
mealRouter.post(
  "/uploadMealImage/:id",
  MealController.uploadMealImage
);

// Obtener detalles de una comida
mealRouter.get("/getMealDetails/:id", MealController.getMealDetails);

// Eliminar una comida
mealRouter.delete("/deleteMeal/:id", MealController.deleteMeal);

module.exports = mealRouter;
