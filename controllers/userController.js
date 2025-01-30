const User = require("../models/userModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");
const multer = require("multer");

// Configuración de Multer para la subida de imágenes
const upload = multer({ storage: multer.memoryStorage() });

exports.updateUserMeasurables = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new AppError("User ID is required", 400));
    }

    let updateKey;
    let updateValue;

    Object.entries(req.body).forEach(([key, value]) => {
        updateKey = key;
        updateValue = value;
    });

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            [updateKey]: updateValue,
            $push: {
                [`${updateKey}Record`]: { date: new Date(), value: updateValue },
            },
        },
        { new: true }
    );

    if (!updatedUser) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: updatedUser,
    });
});

exports.uploadUserBodyImage = [
    upload.single('image'), // Middleware para procesar la imagen
    catchAsync(async (req, res, next) => {
        const { id } = req.params;

        if (!req.file) {
            return next(new AppError("Image file is required", 400));
        }

        const uploadResult = await cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
                return next(new AppError("Error uploading image to Cloudinary", 500));
            }
            return result;
        }).end(req.file.buffer);

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $push: { photos: { image: uploadResult.secure_url } } },
            { new: true }
        );

        if (!updatedUser) {
            return next(new AppError("User not found", 404));
        }

        res.status(200).json({
            status: "success",
            data: updatedUser,
        });
    }),
];

exports.deleteImageOfUserBody = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { imageId } = req.body;

    if (!id || !imageId) {
        return next(new AppError("User ID and Image ID are required", 400));
    }

    const user = await User.findByIdAndUpdate(
        id,
        { $pull: { photos: { _id: imageId } } },
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

exports.updateUserBodyMeasureRecord = catchAsync(async (req, res, next) => {
    const { id, measure } = req.params;

    if (!id || !measure) {
        return next(new AppError("User ID and measure are required", 400));
    }

    const user = await User.findById(id);

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $pull: { [`${measure}Record`]: { date: { $lte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } } } },
        { new: true }
    );

    res.status(200).json({
        status: "success",
        data: updatedUser,
    });
});

exports.updateusername = catchAsync(async (req, res, next) => {
    const { firstname, lastname } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { firstname, lastname },
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

exports.updateuserimage = [
    upload.single('image'),
    catchAsync(async (req, res, next) => {
        if (!req.file) {
            return next(new AppError("Image file is required", 400));
        }

        const uploadResult = await cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
                return next(new AppError("Error uploading image to Cloudinary", 500));
            }
            return result;
        }).end(req.file.buffer);

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { image: uploadResult.secure_url },
            { new: true }
        );

        res.status(200).json({
            status: "success",
            data: user,
        });
    }),
];

exports.changePassword = catchAsync(async (req, res, next) => {
    const { currentpassword, newpassword } = req.body;

    const user = await User.findOne({ _id: req.user._id, password: currentpassword });

    if (!user) {
        return next(new AppError("Your old password is incorrect", 400));
    }

    user.password = newpassword;
    await user.save();

    res.status(200).json({
        status: "success",
        data: user,
    });
});
