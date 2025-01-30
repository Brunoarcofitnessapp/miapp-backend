const express = require("express");
const IngredientController = require("../controllers/ingredientController");

const ingredientRouter = express.Router();

// Crear un ingrediente con imagen
ingredientRouter.post(
  "/createIngredient",
  IngredientController.createIngredient
);

// Obtener todos los ingredientes
ingredientRouter.get("/getAllIngredients", IngredientController.getIngredients);

module.exports = ingredientRouter;
