const express = require("express");
const SetsandRepsController = require("../controllers/setsandrepscontroller");

const setsandrepsrouter = express.Router();

setsandrepsrouter.post(
  "/assignuserexercise",
  SetsandRepsController.assignuserexercise
);
setsandrepsrouter.post(
  "/getuserexercises/:id",
  SetsandRepsController.getUserExercises
);
setsandrepsrouter.post(
  "/searchsetsandreps",
  SetsandRepsController.searchsetsandreps
);

module.exports = setsandrepsrouter;
