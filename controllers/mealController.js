const Meal = require("../models/mealModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");
const multer = require("../util/multer");

// Crear una comida con imagen
exports.createMeal = catchAsync(async (req, res, next) => {
    const { mealname, mealtype, time, ingredients, instructions } = req.body;

    // Validar campos obligatorios
    if (!mealname || !mealtype || !time) {
        return next(new AppError("Mealname, mealtype, and time are required", 400));
    }

    // Subir imagen a Cloudinary
    let imageUrl = "";
    if (req.file) {
        const uploadResult = await cloudinary.uploader.upload_stream({ folder: "meals" }, (error, result) => {
            if (error) {
                return next(new AppError("Error uploading image to Cloudinary", 500));
            }
            return result;
        }).end(req.file.buffer);
        imageUrl = uploadResult.secure_url;
    } else {
        return next(new AppError("Photo is required", 400));
    }

    // Crear el documento de la comida
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
});

// Obtener detalles de una comida
exports.getMealDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const meal = await Meal.findById(id);

    if (!meal) {
        return next(new AppError("Meal not found", 404));
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
        return next(new AppError("Meal not found", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Meal deleted successfully",
    });
});
