const Exercise = require("../models/exerciseModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");
const multer = require("multer");
const { default: mongoose } = require("mongoose");
const fs = require("fs");
const APIfeatures = require("../util/apifeatures");
const SetsandReps = require("../models/setsandrepsmodel");

exports.exerciseimageuploadmiddleware =
  multer.imageuploadmiddleware.single("image");

// Crear un ejercicio con imagen
exports.createExercise = catchAsync(async (req, res, next) => {
  let { name, days, weeks, superset, video, exercisetype } = req.body;

  if (!name || !days || !weeks || !video || !exercisetype) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  days = JSON.parse(days);
  weeks = JSON.parse(weeks);

  try {
    // Subir la imagen a Cloudinary
    const photo = await cloudinary.uploader.upload_stream((error, result) => {
      if (error) return next(new AppError("Error uploading image to Cloudinary", 400));
      return result;
    }).end(req.file.buffer);

    const exercise = await Exercise.create({
      name,
      days,
      weeks,
      superset: superset,
      video: mongoose.Types.ObjectId(video),
      exercisetype,
      image: photo.secure_url,
    });

    res.status(200).json({
      status: "success",
      data: exercise,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Obtener todos los ejercicios
exports.getAllExercises = catchAsync(async (req, res, next) => {
  const total = await Exercise.find({}).countDocuments();

  const features = new APIfeatures(Exercise.find({}), req.query)
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();
  const exercises = await features.query;

  res.status(200).json({
    status: "success",
    data: exercises,
    total,
  });
});

// Obtener todos los ejercicios de un usuario
exports.getAllUserExercises = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("User ID is required", 400));
  }

  const exercises = await SetsandReps.find({ users: { $in: id } });

  if (exercises.length < 1) {
    return next(new AppError("No exercises found", 404));
  }

  res.status(200).json({
    status: "success",
    data: exercises,
  });
});

// Remover usuario de un ejercicio
exports.removeuserfromexercise = catchAsync(async (req, res, next) => {
  const { exerciseid, userid } = req.params;

  if (!exerciseid || !userid) {
    return next(new AppError("Exercise ID and User ID are required", 400));
  }

  await SetsandReps.findByIdAndUpdate(
    exerciseid,
    {
      $pull: { users: { $eq: userid } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
  });
});
