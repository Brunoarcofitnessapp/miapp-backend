const catchAsync = require("./catchAsync");
const AppError = require("./appError");
const cloudinary = require("./cloudinary");
const Video = require("../models/videoModel");
const Macro = require("../models/assignMacroModal");
const SetsandReps = require("../models/setsandrepsmodel");
const mongoose = require("mongoose");
const Template = require("../models/templateModel");

// 630217f280ef9a38a3eac94b

exports.deletedocument = (Model, delstr = null) =>
  catchAsync(async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      if (delstr && delstr == "macro") {
        await Template.findOneAndUpdate(
          { meals: { $elemMatch: { $eq: req.params.id } } },
          { $pull: { meals: { $eq: req.params.id } } }
        );
        return res.status(204).json({
          status: "success",
          message: "The document has been deleted successfully",
          data: null,
        });
      }

      if (delstr && delstr == "meals") {
        await Macro.deleteMany({
          meals: {
            $elemMatch: {
              $eq: new mongoose.Types.ObjectId(req.params.id),
            },
          },
        });
        return res.status(204).json({
          status: "success",
          message: "The document has been deleted successfully",
          data: null,
        });
      }
      if (delstr && delstr == "exercise") {
        await SetsandReps.deleteMany({
          exercise: new mongoose.Types.ObjectId(req.params.id),
        });
        return res.status(204).json({
          status: "success",
          message: "The document has been deleted successfully",
          data: null,
        });
      }

      res.status(204).json({
        status: "success",
        message: "The document has been deleted successfully",
        data: null,
      });
    } catch (err) {
      res.status(500).send({
        status: "fail",
        message: "Server Error",
      });
    }
  });
