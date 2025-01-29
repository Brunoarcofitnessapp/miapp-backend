const User = require("../models/userModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");
const multer = require("multer");
const path = require("path");

// Configuración de Multer para manejar la carga de imágenes
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware de Multer para manejar una sola imagen
exports.uploadUserPhoto = upload.single("image");

// Endpoint: Subir imagen del cuerpo del usuario
exports.uploadUserBodyImage = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!req.file) {
    return next(new AppError("No image provided", 400));
  }

  // Subir imagen a Cloudinary
  const result = await cloudinary.uploader.upload_stream(
    {
      folder: "user_photos",
    },
    (error, uploadedImage) => {
      if (error) return next(new AppError("Image upload failed", 500));
      return uploadedImage;
    }
  ).end(req.file.buffer);

  // Guardar URL de la imagen en MongoDB
  const user = await User.findByIdAndUpdate(
    id,
    { $push: { photos: { image: result.secure_url } } },
    { new: true }
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// Los demás métodos no necesitan modificaciones si no trabajan con imágenes
exports.updateUserMeasurables = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("User Id is required", 400));
  }

  let updatekey;
  let updatevalue;

  Object.entries(req.body).forEach(([key, value]) => {
    updatekey = key;
    updatevalue = value;
  });

  const FindedUser = await User.findByIdAndUpdate(
    id,
    {
      [updatekey]: updatevalue,
      $push: {
        [`${updatekey}Record`]: { date: new Date(), value: updatevalue },
      },
    },
    { new: true }
  );
  if (!FindedUser) {
    return next(new AppError("User Not Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: FindedUser,
  });
});

exports.updateusername = catchAsync(async (req, res, next) => {
  const { firstname, lastname, phoneNumber, dob, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      firstname,
      lastname,
      phone: phoneNumber,
      dob,
      $set: { address },
    },
    { new: true }
  );

  if (!user) {
    return next(new AppError("No User Found with this Id", 400));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateuserimage = catchAsync(async (req, res, next) => {
  const { image } = req.body;

  if (!image) {
    return next(new AppError("Image is required", 400));
  }

  const data = await cloudinary.uploader.upload(image);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { image: data.secure_url },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentpassword, newpassword } = req.body;

  if (!currentpassword || !newpassword) {
    return next(new AppError("Please provide the new and previous passwords", 400));
  }

  const user = await User.findOne({
    _id: req.user._id,
    password: currentpassword,
  });

  if (!user) {
    return next(new AppError("Your Old Password is incorrect. Please try again."));
  }

  user.password = newpassword;
  await user.save();

  res.status(200).json({
    status: "success",
    data: user,
  });
});
