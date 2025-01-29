const mongoose = require("mongoose");
const SetsandReps = require("../models/setsandrepsmodel");

const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");

exports.assignuserexercise = catchAsync(async (req, res, next) => {
  let { repetitions, users, days, weeks, exercise, superset, id } = req.body;
  // const {id} = req.params
  console.log(req.body);

  if (!repetitions || !users || !days || !weeks || !exercise) {
    return next(new AppError("Please provide all the fields", 400));
  }

  console.log(id);

  repetitions = JSON.parse(repetitions);
  users = JSON.parse(users);
  days = JSON.parse(days);
  weeks = JSON.parse(weeks);

  if (id !== undefined) {
    const findedsets = await SetsandReps.findById(id);

    if (!findedsets) {
      return next(new AppError("No document existed with this id", 404));
    }

    await SetsandReps.findByIdAndUpdate(id, {
      repetitions,
      users,
      days,
      weeks,
      superset,
      exercise: new mongoose.Types.ObjectId(exercise),
    });

    res.status(200).json({
      status: "success",
      data: "Sets And Reps Have been updated Successfully",
    });
  } else {
    await SetsandReps.create({
      repetitions,
      users,
      days,
      weeks,
      superset,
      exercise: new mongoose.Types.ObjectId(exercise),
    });

    res.status(200).json({
      status: "success",
      data: "Sets And Extras Have been created Successfully",
    });
  }
});

exports.getUserExercises = catchAsync(async (req, res, next) => {
  const { day, week } = req.body;
  const { id } = req.params;

  console.log(day, week, id);

  if (!day || !week || !id) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  const exercises = await SetsandReps.find({
    users: { $elemMatch: { $eq: id } },
    days: { $elemMatch: { $eq: day } },
    weeks: { $elemMatch: { $eq: week } },
  })
    .select("-days -weeks -users")
    .sort({ superset: -1 });

  console.log(exercises);

  if (exercises.length === 0) {
    return res.status(200).json({
      status: "success",
      data: [],
    });
  }

  res.status(200).json({
    status: "success",
    data: exercises,
  });
});

exports.searchsetsandreps = catchAsync(async (req, res, next) => {
  const { page, limit } = req.query;

  const { type, search } = req.body;

  console.log(type, search);

  const pageing = page * 1 || 1;
  const limiting = limit * 1 || 10;
  const skip = (pageing - 1) * limiting;

  const searchobj =
    type === "exename"
      ? { $match: { "exercise.name": { $regex: search, $options: "i" } } }
      : {
          $match: {
            "exercise.exercisetype": { $regex: search, $options: "i" },
          },
        };

  const totallength = await SetsandReps.aggregate([
    {
      $lookup: {
        from: "exercises",
        localField: "exercise",
        foreignField: "_id",
        as: "exercise",
      },
    },

    { $unwind: "$exercise" },

    searchobj,

    { $count: "total" },
  ]);

  const data = await SetsandReps.aggregate([
    {
      $lookup: {
        from: "exercises",
        localField: "exercise",
        foreignField: "_id",
        as: "exercise",
      },
    },

    { $unwind: "$exercise" },

    searchobj,
  ])
    .skip(skip)
    .limit(limiting);

  res.status(200).json({
    data: data,
    status: "success",
    total: totallength?.[0]?.total,
  });
});
