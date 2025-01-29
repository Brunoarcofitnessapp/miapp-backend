const Template = require("../models/templateModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const Macro = require("../models/assignMacroModal");
const { default: mongoose } = require("mongoose");
const SetsandReps = require("../models/setsandrepsmodel");
const User = require("../models/userModel");
const APIfeatures = require("../util/apifeatures");

exports.createTemplate = catchAsync(async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return next(new AppError("Please provide the title", 400));
  }

  const temp = await Template.create({
    title: title,
  });

  res.status(200).json({
    message: "Template Created SuccessFully",
    data: temp,
  });
});

exports.getTemplateslist = catchAsync(async (req, res, next) => {
  const data = await Template.find({}).select("_id title");

  res.status(200).json({
    message: "Meals fetched SuccessFully",
    data: data,
  });
});

exports.addMealorExercisetoTemplate = catchAsync(async (req, res, next) => {
  const { templateId, mealId, exerciseId, type } = req.body;
  if (!templateId) {
    return next(new AppError("Please provide the templateId", 400));
  }

  console.log(req.body, "bod");

  let queryobj =
    type == "meal"
      ? { meals: new mongoose.Types.ObjectId(mealId) }
      : { exercises: new mongoose.Types.ObjectId(exerciseId) };

  const temp = await Template.findByIdAndUpdate(templateId, {
    $addToSet: queryobj,
  });
  res.status(200).json({
    message: "Meal or Exercise added to template SuccessFully",
    data: temp,
  });
});

exports.adduserstotemplate = catchAsync(async (req, res, next) => {
  let { templateId, users } = req.body;

  users = JSON.parse(users);

  if (!templateId) {
    return next(new AppError("Please provide the templateId", 400));
  }

  const template = await Template.findById(templateId);

  let meals = template.meals;

  let exercises = template.exercises;

  const addUserstomeal = async (id) => {
    try {
      await Macro.findByIdAndUpdate(id, {
        $addToSet: { users: { $each: users } },
      });
    } catch (err) {
      return next(new AppError("Something went wrong", 400));
    }
  };
  const addUserstoexercise = async (id) => {
    try {
      await SetsandReps.findByIdAndUpdate(id, {
        $addToSet: { users: { $each: users } },
      });
    } catch (err) {
      return next(new AppError("Something went wrong", 400));
    }
  };

  try {
    await Promise.all(meals.map((meal) => addUserstomeal(meal._id)));
    await Promise.all(
      exercises.map((exercise) => addUserstoexercise(exercise._id))
    );
    await Template.findByIdAndUpdate(templateId, {
      $addToSet: { users: { $each: users } },
    });
    res.status(200).json({
      message: "Users added to template SuccessFully",
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 400));
  }
});

exports.removeusersfromtemplate = catchAsync(async (req, res, next) => {
  let { templateId, users } = req.body;

  users = JSON.parse(users);

  if (!templateId) {
    return next(new AppError("Please provide the templateId", 400));
  }

  const template = await Template.findById(templateId);

  let meals = template.meals;

  let exercises = template.exercises;

  const addUserstomeal = async (id) => {
    try {
      await Macro.findByIdAndUpdate(id, {
        $pullAll: { users: users },
      });
    } catch (err) {
      return next(new AppError("Something went wrong", 400));
    }
  };
  const addUserstoexercise = async (id) => {
    try {
      await SetsandReps.findByIdAndUpdate(id, {
        $pullAll: { users: users },
      });
    } catch (err) {
      return next(new AppError("Something went wrong", 400));
    }
  };

  try {
    await Promise.all(meals.map((meal) => addUserstomeal(meal._id)));
    await Promise.all(
      exercises.map((exercise) => addUserstoexercise(exercise._id))
    );
    await Template.findByIdAndUpdate(templateId, {
      $pullAll: { users: users },
    });
    res.status(200).json({
      message: "Users removed from template SuccessFully",
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 400));
  }
});

exports.getTemplatesforDisplay = catchAsync(async (req, res, next) => {
  const { tempId } = req.params;

  const data = await Template.findOne({ _id: tempId }).select("-__v");

  let meals = data.meals;
  let exercises = data.exercises;
  let users = data.users;

  const getmeals = async (id) => {
    const data = await Macro.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "meals",
          localField: "meals",
          foreignField: "_id",
          as: "meal",
        },
      },
      { $unwind: "$meal" },
      {
        $project: {
          _id: 1,
          meal: "$meal.mealname",
          proteins: "$protein",
          fats: "$fats",
          carbs: "$carbs",
          calories: "$calories",
        },
      },
    ]);
    return data[0];
  };
  const getexercises = async (id) => {
    const data = await SetsandReps.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "exercises",
          localField: "exercise",
          foreignField: "_id",
          as: "exercise",
        },
      },
      { $unwind: "$exercise" },
      {
        $project: {
          _id: 1,
          exercise: "$exercise.name",
          exercisereps: "$repetitions",
        },
      },
    ]);
    return data[0];
  };
  const getUsers = async (id) => {
    const data = await User.findById(id).select("firstname lastname email");
    return data;
  };

  try {
    const m = await Promise.all(meals.map((id) => getmeals(id)));
    const e = await Promise.all(exercises.map((id) => getexercises(id)));
    const u = await Promise.all(users.map((id) => getUsers(id)));

    res.status(200).json({
      message: "feched",
      data: {
        meals: m,
        exercises: e,
        users: u,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

exports.getTemplatewithPagination = catchAsync(async (req, res, next) => {
  const totallength = await Template.find({}).count();

  const features = new APIfeatures(Template.find({}), req.query)
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();

  const template = await features.query;

  res.status(200).json({
    message: "feched",
    data: template,
    total: totallength,
  });
});

exports.deleteTemplate = catchAsync(async (req, res, next) => {
  let { templateId, users } = req.body;
  console.log(users, templateId);

  users = JSON.parse(users);

  if (!templateId) {
    return next(new AppError("Please provide the templateId", 400));
  }

  const template = await Template.findById(templateId);

  let meals = template.meals;

  let exercises = template.exercises;

  const removeUsersfrommeal = async (id) => {
    try {
      await Macro.findByIdAndUpdate(id, {
        $pullAll: { users: users },
      });
    } catch (err) {
      return next(new AppError("Something went wrong", 400));
    }
  };
  const removeUsersfromexercise = async (id) => {
    try {
      await SetsandReps.findByIdAndUpdate(id, {
        $pullAll: { users: users },
      });
    } catch (err) {
      return next(new AppError("Something went wrong", 400));
    }
  };

  try {
    await Promise.all(meals.map((meal) => removeUsersfrommeal(meal._id)));
    await Promise.all(
      exercises.map((exercise) => removeUsersfromexercise(exercise._id))
    );
    await Template.findByIdAndDelete(templateId);

    res.status(200).json({
      message: "Template Has been deleted successfully",
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 400));
  }
});

exports.deletesinglemealorexercisefromtemplate = catchAsync(
  async (req, res, next) => {
    let { templateId, mealId, exerciseId, users } = req.body;
    console.log(mealId, exerciseId);

    users = JSON.parse(users);

    const template = await Template.findById(templateId);

    if (!template) {
      return next(new AppError("Template not found", 400));
    }

    if (mealId) {
      await Template.findByIdAndUpdate(templateId, {
        $pull: { meals: mealId },
      });
      await Macro.findByIdAndUpdate(mealId, {
        $pullAll: { users: users },
      });
      return res.status(200).json({
        message: "Meal has been deleted from the template successfully",
      });
    }

    if (exerciseId) {
      await Template.findByIdAndUpdate(templateId, {
        $pull: { exercises: exerciseId },
      });
      await SetsandReps.findByIdAndUpdate(exerciseId, {
        $pullAll: { users: users },
      });
      return res.status(200).json({
        message: "Exercise has been deleted from the template successfully",
      });
    }
  }
);
