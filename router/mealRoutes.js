const express = require("express");
const AuthController = require("../controllers/authController");
const MealController = require("../controllers/mealController");
const multer = require("../util/multer");

const mealRouter = express.Router();

// Ruta de prueba para verificar que el endpoint esté funcionando
mealRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "Meal endpoint is working!",
    });
});

// Crear una comida
mealRouter.post(
    "/createMeal",
    multer.imageuploadmiddleware.single("photo"), // Middleware para procesar la imagen
    MealController.createMeal
);

// Obtener detalles de una comida
mealRouter.get("/getMealDetails/:id", MealController.getMealDetails);

// Eliminar una comida
mealRouter.delete("/deleteMeal/:id", MealController.deleteMeal);

module.exports = mealRouter;
