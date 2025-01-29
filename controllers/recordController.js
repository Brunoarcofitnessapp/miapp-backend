const Record = require("../models/recordModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");

exports.createRecord = catchAsync(async (req, res, next) => {
  let {
    records,
    recordId,
  } = req.body;
  const { userId, exerciseId } = req.params;
  if (!userId || !exerciseId) {
    return next(new AppError("Please provide the both Ids", 400));
  }

  records = JSON.parse(records);

  let updatekey;
  let updatevalue;

  Object.entries(req.body.weekobj).forEach(([key, value]) => {
    updatekey = key;
    updatevalue = value;
  });

  let record;

  if (recordId !== undefined) {
    record = await Record.findByIdAndUpdate(
      recordId,
      {
        [updatekey]: updatevalue,
        records,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      data: record,
    });
  } else {
    record = await Record.create({
       [updatekey]: updatevalue,
      records,
      user: userId,
      exercise: exerciseId,
    });

    const sendrecord = await Record.findById(record._id);

    res.status(200).json({
      status: "success",
      data: sendrecord,
    });
  }
});

exports.getRecords = catchAsync(async (req, res, next) => {
  const { userId, exerciseId } = req.params;

  if (!userId || !exerciseId) {
    return next(new AppError("Please provide the both Ids", 400));
  }

  const records = await Record.findOne({ user: userId, exercise: exerciseId });


  res.status(200).json({
    status: "success",
    data: records,
  });
});
