const express = require('express')
const IngredientController = require('../controllers/ingredientController')

const ingredientRouter = express.Router()

ingredientRouter.post('/createIngredient',IngredientController.ingridentimageuploadmiddleware,IngredientController.createIngredient)
ingredientRouter.get('/getAllIngredients',IngredientController.getIngredients)

module.exports = ingredientRouter