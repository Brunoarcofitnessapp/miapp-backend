const express = require("express");
const AdminController = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.get("/users", AdminController.getAllUsers);
adminRouter.get("/meals", AdminController.getAllMeals);
adminRouter.get("/macros", AdminController.getMacros);
adminRouter.get("/setsandreps", AdminController.getSetsAndReps);

adminRouter.post("/edituser/:id", AdminController.edituser);
adminRouter.post("/createUser", AdminController.createUser);

adminRouter.get("/getSingleUser/:id", AdminController.getSingleUser);
adminRouter.get("/getSingleExercise/:id", AdminController.getSingleExercise);

adminRouter.get("/getSingleMeal/:id", AdminController.getSingleMeal);

adminRouter.get(
  "/getUsersAndingsformeal",
  AdminController.getUsersAndingsformeal
);
adminRouter.get(
  "/getUserMealsForAdmin/:id",
  AdminController.getUserMealsForAdmin
);
adminRouter.post("/searchmeals", AdminController.searchformeal);
adminRouter.get(
  "/getUserExerciseForAdmin/:id",
  AdminController.getUserExercisesForAdmin
);
adminRouter.delete("/deleteuser/:id", AdminController.deleteuser);
adminRouter.delete("/deleteexercise/:id", AdminController.deleteexercise);
adminRouter.delete("/deletemeal/:id", AdminController.deletemeal);
adminRouter.delete("/deleteing/:id", AdminController.deleteing);
adminRouter.delete("/deletemacros/:id", AdminController.deletemacro);
adminRouter.delete("/deletesetsandreps/:id", AdminController.deletesetsandreps);
adminRouter.delete("/deletevideo/:id/:publicid", AdminController.deletevideo);
adminRouter.post(
  "/editexercise/:id",
  AdminController.imagemiddleware,
  AdminController.editexercise
);
adminRouter.post(
  "/editmeal/:id",
  AdminController.imagemiddleware,
  AdminController.editMeal
);
adminRouter.delete(
  "/removeuserfromexercise/:exerciseid/:userid",
  AdminController.removeuserfromexercise
);
adminRouter.delete(
  "/removeuserfrommeal/:mealid/:userid",
  AdminController.removeuserfrommeal
);
adminRouter.post("/adminLogin", AdminController.adminLogin);
adminRouter.post("/adminSignup", AdminController.Adminsignup);

module.exports = adminRouter;
