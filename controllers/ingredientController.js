const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const Ingredient = require("../models/ingredientModel");
const cloudinary = require("../util/cloudinary");
const multer = require("../util/multer");
const fs = require("fs");
const APIfeatures = require("../util/apifeatures");

exports.ingridentimageuploadmiddleware =
  multer.imageuploadmiddleware.single("image");

exports.createIngredient = catchAsync(async (req, res, next) => {
  const { name, unit } = req.body;

  if (!name || !unit) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  const photo = await cloudinary.uploader.upload(req.file.path);

  if (photo.secure_url) {
    const ingredient = await Ingredient.create({
      name,
      unit,
      image: photo.secure_url,
    });
    fs.unlinkSync(req.file.path);
    res.status(200).json({
      status: "success",
      data: ingredient,
    });
  }
});

exports.getIngredients = catchAsync(async (req, res, next) => {
  
    // const ingredients = await Ingredient.find({})

    const total = await Ingredient.find({}).countDocuments();

  const features = new APIfeatures(Ingredient.find({}), req.query)
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();
  const ingredients = await features.query;
  res.status(200).json({
    status: "success",
    data: ingredients,
    total,
  });
});
