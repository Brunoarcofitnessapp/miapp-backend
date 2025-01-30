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

// Rutas para las operaciones de meals
mealRouter.post(
    "/createMeal",
    multer.imageuploadmiddleware.single("photo"), // Middleware para procesar la imagen (clave: "photo")
    MealController.createMeal
);

mealRouter.post(
    "/uploadMealImage/:id",
    multer.imageuploadmiddleware.single("photo"), // Middleware para procesar la imagen (clave: "photo")
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
