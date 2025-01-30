const Meal = require("../models/mealModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");
const multer = require("multer");

// Configuración de Multer para procesar la imagen
const upload = multer({ storage: multer.memoryStorage() });

// Middleware de subida de imagen para Multer
exports.mealimageuploadmiddleware = upload.single("photo");

// Crear una nueva comida
exports.createMeal = catchAsync(async (req, res, next) => {
  const { dayname, mealname, mealtype, ingredients, instructions, time } = req.body;

  // Verificar si todos los campos obligatorios están presentes
  if (!dayname || !mealname || !mealtype || !ingredients || !instructions || !time) {
    return next(new AppError("All required fields must be provided", 400));
  }

  // Subir imagen a Cloudinary
  let photoUrl = "";
  if (req.file) {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(req.file.buffer);
    });
    photoUrl = uploadResult.secure_url;
  } else {
    return next(new AppError("Photo is required", 400));
  }

  // Crear el documento en la base de datos
  const newMeal = await Meal.create({
    dayname: JSON.parse(dayname), // Convertir de string a array
    mealname,
    mealtype,
    ingredients: JSON.parse(ingredients), // Convertir de string a array
    instructions: JSON.parse(instructions), // Convertir de string a array
    time,
    photo: photoUrl,
  });

  res.status(201).json({
    status: "success",
    data: newMeal,
  });
});
