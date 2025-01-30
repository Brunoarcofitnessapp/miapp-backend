const Meal = require("../models/mealModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("cloudinary").v2;

// Crear una comida con imagen
exports.createMeal = catchAsync(async (req, res, next) => {
    const { mealname, mealtype, dayname, ingredients, instructions, time } = req.body;

    // Verifica que todos los campos estén presentes
    if (!mealname || !mealtype || !dayname || !time) {
        return next(new AppError("All required fields must be provided", 400));
    }

    let imageUrl = "";

    // Subir imagen a Cloudinary si se envía
    if (req.file) {
        const result = await cloudinary.uploader.upload_stream(
            { folder: "meals" }, // Opcional: carpeta en Cloudinary
            (error, result) => {
                if (error) {
                    return next(new AppError("Error uploading image to Cloudinary", 500));
                }
                return result;
            }
        ).end(req.file.buffer);

        imageUrl = result.secure_url;
    }

    // Crear la comida en la base de datos
    const meal = await Meal.create({
        mealname,
        mealtype,
        dayname: JSON.parse(dayname),
        ingredients: JSON.parse(ingredients),
        instructions: JSON.parse(instructions),
        time,
        photo: imageUrl,
    });

    res.status(201).json({
        status: "success",
        data: meal,
    });
});
