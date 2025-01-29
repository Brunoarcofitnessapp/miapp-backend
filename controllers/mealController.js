const Meal = require("../models/mealModel");
const User = require("../models/userModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const sendmail = require("../util/sendemail");
const cloudinary = require("../util/cloudinary");
const fs = require("fs");
const multer = require("../util/multer");
const { default: mongoose } = require("mongoose");
const Macro = require("../models/assignMacroModal");

exports.mealimageuploadmiddleware =
  multer.imageuploadmiddleware.single("image");

exports.createMacro = catchAsync(async (req, res, next) => {
  console.log("req", req.body);
  const { id } = req.params;

  let { ingredients, protein, fats, carbs, calories, users,dayname } = req.body.body;

  if (!ingredients || !protein || !fats || !carbs || !calories || !users) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  dayname = JSON.parse(dayname);
  ingredients = JSON.parse(ingredients);
  // instructions = JSON.parse(instructions);
  users = JSON.parse(users);

  // let phot;

  // if (req.file) {
  //   let cloudimage = await cloudinary.uploader.upload(req.file.path);
  //   phot = cloudimage.secure_url;
  // } else {
  //   phot = photo;
  // }

  const checkData = req.body.check;
  console.log("checkData", checkData);
  if (checkData) {
    const meal = await Macro.updateOne(
      { _id: id },
      {
        ingredients,
        protein: Number(protein),
        fats: Number(fats),
        carbs: Number(carbs),
        calories: Number(calories),
        users,
        dayname,
      }
      // { new: true }
    );
    res.status(200).json({
      status: "success",
      data: meal,
    });
  } else {
    const meal = await Macro.create(
      // req.params.id,
      {
        meals: id,
        dayname:dayname,
        ingredients,
        protein: Number(protein),
        fats: Number(fats),
        carbs: Number(carbs),
        calories: Number(calories),
        users,
      }
      // { new: true }
    );
    res.status(200).json({
      status: "success",
      data: meal,
    });
  }
});

// exports.getSingleMacro = catchAsync(async (req, res, next) => {
//   console.log(req.params);
//   const { id } = req.params;
//   const data = await Macro.findById(id);
//   if (!data) {
//     return next(new AppError("No Macros found with this id", 404));
//   }

//   // else {
//   //   const user = await Macro.find({
//   //     users: { $elemMatch: { $eq: userId } },
//   //   });
//   //   const meals = await Macro.find({
//   //     meals: { $elemMatch: { $eq: mealId } },
//   //   });

//   // }

//   // const meals = await features.query;

//   res.status(200).json({
//     status: "success",
//     data: data,
//   });
// });

exports.getSingleMeal = catchAsync(async (req, res, next) => {
  const meal = await Meal.findById(req.params.id);

  if (!meal) {
    return next(new AppError("No Meal found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    data: meal,
  });
});
exports.createMeal = catchAsync(async (req, res, next) => {
  let {
    dayname,
    mealname,
    mealtype,
    ingredients,
    instructions,
    protein,
    fats,
    carbs,
    calories,
    time,
    users,
  } = req.body;
  console.log("req", req.body);
  if (
    !dayname || //done
    !mealname || //done
    !mealtype || //done
    !ingredients || //done
    !instructions || //done
    // !protein ||
    // !fats ||
    // !carbs ||
    // !calories ||
    // !users //done
    !time //done
  ) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  dayname = JSON.parse(dayname);
  ingredients = JSON.parse(ingredients);
  instructions = JSON.parse(instructions);
  // users = JSON.parse(users);

  const photo = await cloudinary.uploader.upload(req.file.path);

  if (photo.secure_url) {
    const meal = await Meal.create({
      dayname,
      mealname,
      mealtype,
      ingredients,
      instructions,
      photo: photo.secure_url,
      // protein,
      // fats,
      // carbs,
      // calories,
      time,
      // users,
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      status: "success",
      data: meal,
    });
  }
});

exports.getMeal = catchAsync(async (req, res, next) => {
  const { id, day } = req.params;

  if (!id || !day) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  const meal = await Macro.find({
    dayname: { $elemMatch: { $eq: day } },
    users: { $elemMatch: { $eq: id } },
  }).select("_id dayname");

  //   const allprops = await Meal.aggregate([
  //     {
  //       $project: {
  //         totalAmount: { $sum: "$protein" },
  //       },
  //     },
  //   ]);

  const nutrients = await Macro.aggregate([
    {
      $match: {
        dayname: { $elemMatch: { $eq: day } },
        users: { $elemMatch: { $eq: new mongoose.Types.ObjectId(id) } },
      },
    },
    {
      $group: {
        _id: "nuts",
        proteins: { $sum: "$protein" },
        carbs: { $sum: "$carbs" },
        fats: { $sum: "$fats" },
        calories: { $sum: "$calories" },
      },
    },
  ]);

  if (meal.length === 0) {
    return res.status(200).json({
      status: "success",
      data: [],
      message: "No meals Found",
    });
  }

  res.status(200).json({
    status: "success",
    data: meal,
    nutrients: nutrients[0],
  });
});

exports.getMealDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Meal Id is required", 400));
  }

  const meal = await Macro.findById(id);

  if (!meal) {
    return next(new AppError("Meal Not Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: meal,
  });
});

exports.getMealIngridients = catchAsync(async (req, res, next) => {
  const { id, day } = req.params;

  if (!id) {
    return next(new AppError("Meal Id is required", 400));
  }

  console.log(id, day);

  // const ings = await Meal.find({
  //     dayname: { $elemMatch: { $eq: day } },
  //     users: { $elemMatch: { $eq: id } },
  //   })

  const ings = await Macro.aggregate([
    {
      $match: {
        dayname: { $elemMatch: { $eq: day } },
        users: { $elemMatch: { $eq: new mongoose.Types.ObjectId(id) } },
      },
    },
    //   {
    //     $lookup:
    //       {
    //         from: "ingredients",
    //         localField: "ingredients",
    //         foreignField: "_id",
    //         as: "ings"
    //       }
    //  },
    { $unwind: "$ingredients" },
    {
      $group: {
        _id: {
          name: "$ingredients.name",
          image: "$ingredients.image",
          unit: "$ingredients.unit",
        },
        count: { $sum: 1 },
        totalValue: { $sum: "$ingredients.value" },
      },
    },
  ]);

  console.log(ings);

  res.status(200).json({
    status: "success",
    data: ings,
  });
});

exports.Sendmealingridientstoemail = catchAsync(async (req, res, next) => {
  let { ings, email } = req.body;

  console.log(ings,email);

  if (!ings) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  ings = JSON.parse(ings);

  console.log(ings);

  let html = `<div>
    
    <h1>List of Ingredients</h1>
    <ul>
    ${ings?.map(
      (ing) => `<li>${ing.name} - ${ing.totalValue} ${ing.unit}</li>`
    )}
    </ul>
    <h2>Here is your list of ingredients</h2>
    <h3>Thanks</h3>
    </div>`;

  sendmail(email, html, "List of Ingridients", res);

  res.status(200).json({
    status: "success",
    data: ings,
  });
});

exports.getAllIngridientslist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let { days, persons } = req.body;
  days = JSON.parse(days);

  try {
    let data = await Macro.aggregate([
      {
        $match: {
          dayname: { $in: days },
          users: { $elemMatch: { $eq: new mongoose.Types.ObjectId(id) } },
        },
      },
      // { $match: { users: { $elemMatch: { $eq: id } } },dayname:day },
      { $unwind: "$ingredients" },
      {
        $group: {
          _id: {
            name: "$ingredients.name",
            image: "$ingredients.image",
            unit: "$ingredients.unit",
          },
          count: { $sum: 1 },
          totalValue: {
            $sum: { $multiply: ["$ingredients.value", persons ? persons : 1] },
          },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: data,
      // data: ingredients.flatMap((ing) => ing),
    });
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 400));
  }
});

exports.removeuserfrommeal = catchAsync(async (req, res, next) => {
  const { mealid, userid } = req.params;

  if (!mealid || !userid) {
    return next(new AppError("User Id is must Field", 400));
  }

  await Macro.findByIdAndUpdate(
    mealid,
    {
      $pull: {
        users: {
          $eq: userid,
        },
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
  });

  await Macro.findOneAndUpdate(
    { users: { $elemMatch: { $eq: id } } },
    {
      $pull: {
        users: {
          $eq: id,
        },
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
  });
});
