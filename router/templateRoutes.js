const TemplateController = require("../controllers/templatecontroller");
const express = require("express");

const templateRouter = express.Router();

templateRouter.get("/", TemplateController.getTemplatewithPagination);
templateRouter.post("/createTemplate", TemplateController.createTemplate);
templateRouter.get("/getTemplateslist", TemplateController.getTemplateslist);
templateRouter.put(
  "/addMealorExercisetoTemplate",
  TemplateController.addMealorExercisetoTemplate
);
templateRouter.post(
  "/adduserstotemplate",
  TemplateController.adduserstotemplate
);
templateRouter.post(
  "/removeusersfromtemplate",
  TemplateController.removeusersfromtemplate
);
templateRouter.get(
  "/getTemplatesforDisplay/:tempId",
  TemplateController.getTemplatesforDisplay
);

templateRouter.put("/deleteTemplate", TemplateController.deleteTemplate);
templateRouter.put(
  "/deletemealorexercise",
  TemplateController.deletesinglemealorexercisefromtemplate
);

module.exports = templateRouter;
