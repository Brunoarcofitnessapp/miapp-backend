const Meal = require("../models/mealModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");

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
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "meals" }, (error, result) => {
                if (error) {
                    return reject(new AppError("Error uploading image to Cloudinary", 500));
                }
                resolve(result);
            });
            stream.end(req.file.buffer);
        });

        imageUrl = result.secure_url;
    } else {
        return next(new AppError("Photo is required", 400));
    }

    // Crear el documento de la comida
    const meal = await Meal.create({
        mealname,
        mealtype,
        time,
        photo: imageUrl,
        ingredients: JSON.parse(ingredients || "[]"),
        instructions: JSON.parse(instructions || "[]"),
    });

    res.status(201).json({
        status: "success",
        data: meal,
    });
});

// Subir o actualizar una imagen de una comida existente
exports.uploadMealImage = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!req.file) {
        return next(new AppError("Image file is required", 400));
    }

    // Subir imagen a Cloudinary
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "meals" }, (error, result) => {
            if (error) {
                return reject(new AppError("Error uploading image to Cloudinary", 500));
            }
            resolve(result);
        });
        stream.end(req.file.buffer);
    });

    // Actualizar la imagen en la comida
    const updatedMeal = await Meal.findByIdAndUpdate(
        id,
        { photo: result.secure_url },
        { new: true }
    );

    if (!updatedMeal) {
        return next(new AppError("Meal not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: updatedMeal,
    });
});

// Obtener una comida por ID y día
exports.getMeal = catchAsync(async (req, res, next) => {
    const { id, day } = req.params;

    const meal = await Meal.findOne({ _id: id, day });

    if (!meal) {
        return next(new AppError("Meal not found", 404));
    }

    res.status(200).json({
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

// Obtener los ingredientes de una comida
exports.getMealIngridients = catchAsync(async (req, res, next) => {
    const { id, day } = req.params;

    const meal = await Meal.findOne({ _id: id, day });

    if (!meal || !meal.ingredients) {
        return next(new AppError("Ingredients not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: meal.ingredients,
    });
});

// Crear macros para una comida
exports.createMacro = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { calories, protein, carbs, fats } = req.body;

    const updatedMeal = await Meal.findByIdAndUpdate(
        id,
        { calories, protein, carbs, fats },
        { new: true }
    );

    if (!updatedMeal) {
        return next(new AppError("Meal not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: updatedMeal,
    });
});
