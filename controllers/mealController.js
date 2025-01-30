const Meal = require("../models/mealModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");
const multer = require("multer");

// Configuración de Multer para procesar imágenes
const upload = multer({ storage: multer.memoryStorage() });

// Crear una comida con imagen
exports.createMeal = [
  upload.single("photo"), // Middleware para procesar la imagen
  catchAsync(async (req, res, next) => {
    const { mealname, mealtype, time, ingredients, instructions } = req.body;

    // Validar campos obligatorios
    if (!mealname || !mealtype || !time) {
      return next(new AppError("mealname, mealtype y time son obligatorios", 400));
    }

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "meals" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    // Crear la comida en la base de datos
    const meal = await Meal.create({
      mealname,
      mealtype,
      time,
      photo: imageUrl,
      ingredients: ingredients ? JSON.parse(ingredients) : [],
      instructions: instructions ? JSON.parse(instructions) : [],
    });

    res.status(201).json({
      status: "success",
      data: meal,
    });
  }),
];

// Subir o actualizar la imagen de una comida
exports.uploadMealImage = [
  upload.single("photo"),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!req.file) {
      return next(new AppError("La imagen es obligatoria", 400));
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "meals" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      { photo: uploadResult.secure_url },
      { new: true }
    );

    if (!updatedMeal) {
      return next(new AppError("No se encontró la comida", 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedMeal,
    });
  }),
];

// Obtener detalles de una comida
exports.getMealDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findById(id);

  if (!meal) {
    return next(new AppError("No se encontró la comida", 404));
  }

  res.status(200).json({
    status: "success",
    data: meal,
  });
});

// Eliminar una comida
exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findByIdAndDelete(id);

  if (!meal) {
    return next(new AppError("No se encontró la comida", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Comida eliminada correctamente",
  });
});
