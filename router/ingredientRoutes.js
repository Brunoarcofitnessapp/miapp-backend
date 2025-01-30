const express = require('express');
const IngredientController = require('../controllers/ingredientController');

const ingredientRouter = express.Router();

// Ruta para crear un ingrediente con imagen
ingredientRouter.post(
  '/createIngredient',
  IngredientController.ingridentimageuploadmiddleware,
  IngredientController.createIngredient
);

// Ruta para obtener todos los ingredientes
ingredientRouter.get('/getAllIngredients', IngredientController.getIngredients);

module.exports = ingredientRouter;
