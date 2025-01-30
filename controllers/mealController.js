const Meal = require("../models/mealModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");

// Crear una comida con imagen
exports.createMeal = catchAsync(async (req, res, next) => {
    const { name, description, calories, protein, carbs, fats } = req.body;

    // Subir imagen a Cloudinary
    let imageUrl = "";
    if (req.file) {
        const uploadResult = await cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
                return next(new AppError("Error uploading image to Cloudinary", 500));
            }
            return result;
        }).end(req.file.buffer);
        imageUrl = uploadResult.secure_url;
    }

    // Crear el documento de la comida
    const meal = await Meal.create({
        name,
        description,
        calories,
        protein,
        carbs,
        fats,
        image: imageUrl,
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
    const uploadResult = await cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
            return next(new AppError("Error uploading image to Cloudinary", 500));
        }
        return result;
    }).end(req.file.buffer);

    // Actualizar la imagen en la comida
    const updatedMeal = await Meal.findByIdAndUpdate(
        id,
        { image: uploadResult.secure_url },
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

// Enviar ingredientes por email
exports.Sendmealingridientstoemail = catchAsync(async (req, res, next) => {
    const { email, ingredients } = req.body;

    if (!email || !ingredients) {
        return next(new AppError("Email and ingredients are required", 400));
    }

    // Aquí puedes implementar el envío de correo con los ingredientes
    res.status(200).json({
        status: "success",
        message: "Ingredients sent to email",
    });
});

// Obtener todos los ingredientes de un usuario
exports.getAllIngridientslist = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const meals = await Meal.find({ user: id });

    if (!meals) {
        return next(new AppError("No meals found for this user", 404));
    }

    const ingredients = meals.flatMap((meal) => meal.ingredients);

    res.status(200).json({
        status: "success",
        data: ingredients,
    });
});

// Eliminar un usuario de una comida
exports.removeuserfrommeal = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const updatedMeal = await Meal.findByIdAndUpdate(
        id,
        { $unset: { user: "" } },
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
