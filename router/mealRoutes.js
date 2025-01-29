const express = require("express");
const AuthController = require("../controllers/authController");
const MealController = require("../controllers/mealController");

const mealRouter = express.Router();

mealRouter.post(
  "/createMeal",
  MealController.mealimageuploadmiddleware,
  MealController.createMeal
);
mealRouter.get("/getMeal/:id/:day", MealController.getMeal);
mealRouter.get("/getMealDetails/:id", MealController.getMealDetails);
mealRouter.get("/getMealIngs/:id/:day", MealController.getMealIngridients);
mealRouter.post("/sendingstoemail", MealController.Sendmealingridientstoemail);
mealRouter.post("/getallings/:id", MealController.getAllIngridientslist);
mealRouter.post("/removeuserfrommeal/:id", MealController.removeuserfrommeal);
mealRouter.post("/createmacros/:id", MealController.createMacro);
// mealRouter.get("/getmacros/:id", MealController.getSingleMacro);

module.exports = mealRouter;
