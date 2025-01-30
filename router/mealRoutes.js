const express = require("express");
const AuthController = require("../controllers/authController"); // Si este no es necesario, lo puedes eliminar.
const MealController = require("../controllers/mealController");
const multer = require("../util/multer"); // Middleware para la carga de imágenes.

const mealRouter = express.Router();

// Ruta de prueba para verificar que el endpoint esté funcionando.
mealRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "Meal endpoint is working!",
    });
});

// Rutas para las operaciones de meals.
mealRouter.post(
    "/createMeal",
    multer.imageuploadmiddleware.single("image"), // Middleware para procesar la imagen.
    MealController.createMeal
);

mealRouter.post(
    "/uploadMealImage/:id",
    multer.imageuploadmiddleware.single("image"), // Middleware para procesar la imagen.
    MealController.uploadMealImage
);

mealRouter.get("/getMeal/:id/:day", MealController.getMeal);
mealRouter.get("/getMealDetails/:id", MealController.getMealDetails);
mealRouter.get("/getMealIngs/:id/:day", MealController.getMealIngridients);

mealRouter.post("/sendingstoemail", MealController.Sendmealingridientstoemail);
mealRouter.post("/getallings/:id", MealController.getAllIngridientslist);
mealRouter.post("/removeuserfrommeal/:id", MealController.removeuserfrommeal);

mealRouter.post("/createmacros/:id", MealController.createMacro);

module.exports = mealRouter;
