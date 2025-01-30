const Exercise = require("../models/exerciseModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");
const multer = require("multer");
const { default: mongoose } = require("mongoose");
const fs = require("fs");
const APIfeatures = require("../util/apifeatures");
const SetsandReps = require("../models/setsandrepsmodel");

// Usar correctamente la función de Multer
const { imageuploadmiddleware } = require("../util/multer");

exports.exerciseimageuploadmiddleware = imageuploadmiddleware.single("image");

exports.createExercise = catchAsync(async (req, res, next) => {
  let { name, days, weeks, superset, video, exercisetype } = req.body;

  if (!name || !days || !weeks || !video || !exercisetype) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  // Parsear datos JSON
  let parsedDays, parsedWeeks;
  try {
    parsedDays = JSON.parse(days);
    parsedWeeks = JSON.parse(weeks);
  } catch (error) {
    return next(new AppError("Invalid JSON format for days or weeks", 400));
  }

  // Verificar si se envió una imagen
  if (!req.file) {
    return next(new AppError("Image file is required", 400));
  }

  try {
    // Subir la imagen a Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });

    // Crear el ejercicio en la base de datos
    const exercise = await Exercise.create({
      name,
      days: parsedDays,
      weeks: parsedWeeks,
      superset: superset || false,
      video: mongoose.Types.ObjectId(video),
      exercisetype,
      image: uploadResult.secure_url,
    });

    // Eliminar archivo local después de subir a Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      status: "success",
      data: exercise,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
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
