const User = require("../models/userModel");
const Meal = require("../models/mealModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const AuthController = require("../controllers/authController");
const Ingredient = require("../models/ingredientModel");
const APIfeatures = require("../util/apifeatures");
const Exercise = require("../models/exerciseModel");
const Delete = require("../util/delete");
const Admin = require("../models/adminModal");
const jwt = require("jsonwebtoken");
const cloudinary = require("../util/cloudinary");
const multer = require("../util/multer");
const fs = require("fs");
const mongoose = require("mongoose");
const Video = require("../models/videoModel");
const ExerciseController = require("../controllers/exerciseController");
const MealController = require("../controllers/mealController");
const Macro = require("../models/assignMacroModal");
const SetsandReps = require("../models/setsandrepsmodel");

const signtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

exports.imagemiddleware = multer.imageuploadmiddleware.single("image");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const totalUsers = await User.find({}).countDocuments();

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .select(
      "firstname lastname _id email phone gender dob mealsperday physicslevel"
    );

  res.status(200).json({
    status: "success",
    data: users,
    total: totalUsers,
  });
});

exports.createUser = AuthController.signup;

exports.getSingleUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.getSingleExercise = catchAsync(async (req, res, next) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    return next(new AppError("No exercise found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    data: exercise,
  });
});

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

exports.getUsersAndingsformeal = catchAsync(async (req, res, next) => {
  const users = await User.find({}).select("firstname lastname _id");

  const ings = await Ingredient.find({});

  res.status(200).json({
    status: "success",
    data: users,
    ings: ings,
  });
});

exports.getAllMeals = catchAsync(async (req, res, next) => {
  const total = await Meal.find({}).countDocuments();

  const features = new APIfeatures(Meal.find({}), req.query)
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();
  const meals = await features.query;

  res.status(200).json({
    status: "success",
    data: meals,
    total: total,
  });
});

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Both Email And Password are required to Login", 400)
    );
  }

  const FindedUser = await Admin.findOne({ email: email, password: password });

  if (!FindedUser) {
    return next(
      new AppError("Please Enter the correct email or password", 400)
    );
  }

  // const comparepassword = await bcrypt.compare(password, FindedUser.password);

  // if (!comparepassword) {
  //   return next(new AppError("Please Enter the correct password", 400));
  // }

  const token = signtoken(FindedUser._id);

  res.status(200).json({
    message: "Login SuccessFully",
    data: FindedUser,
    token,
  });
});
//signup
exports.Adminsignup = catchAsync(async (req, res, next) => {
  console.log("first");
  const { name, email, password } = req.body;
  // const hashPassword = await bcrypt.hash(password, 12);

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const FindedUser = await Admin.findOne({ email: email });

  if (FindedUser) {
    return next(new AppError("User with this email already exists", 400));
  } else {
    // console.log("hash", hashPassword, password);
    const newUser = await Admin.create({
      name: name,
      email: email,
      password: password,
    });

    const token = signtoken(newUser._id);

    res.status(200).json({
      message: "User Created SuccessFully",
      data: newUser,
      token,
    });
  }
});

exports.deleteuser = Delete.deletedocument(User);

exports.deleteexercise = Delete.deletedocument(Exercise, "exercise");

exports.deletemeal = Delete.deletedocument(Meal, "meals");

exports.deleteing = Delete.deletedocument(Ingredient);

exports.deletesetsandreps = Delete.deletedocument(SetsandReps);

exports.deletemacro = Delete.deletedocument(Macro, "macro");

exports.deletevideo = catchAsync(async (req, res, next) => {
  const { publicid } = req.params;
  console.log(publicid);

  try {
    await cloudinary.uploader.destroy(
      publicid,
      { invalidate: true, resource_type: "video" },
      async (err, result) => {
        if (err) {
          return next(new AppError("Failed to delete the video", 400));
        }

        await Video.findByIdAndDelete(req.params.id);

        res.status(204).json({
          status: "success",
          message: "Video has been deleted sucessfully",
          data: null,
        });
      }
    );
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

exports.editexercise = catchAsync(async (req, res, next) => {
  console.log(req.file, "file");
  console.log(req.body, "body");

  let {
    name,
    days,
    weeks,
    superset,
    video,
    // users,
    exercisetype,
    // repetitions,
    image,
    photo,
  } = req.body;
  if (!name || !days || !weeks || !video || !exercisetype) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  days = JSON.parse(days);
  weeks = JSON.parse(weeks);

  if (!req.params.id) {
    return next(new AppError("Please provide the id", 404));
  }

  try {
    let phot;

    if (req.file) {
      let cloudimage = await cloudinary.uploader.upload(req.file.path);
      phot = cloudimage.secure_url;
    } else {
      phot = photo;
    }

    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      {
        name,
        days,
        weeks,
        superset: superset,
        video: mongoose.Types.ObjectId(video),
        exercisetype,
        image: phot,
      },
      { new: true }
    );

    await SetsandReps.findOneAndUpdate(
      { exercise: exercise?._id },
      { days: days, weeks: weeks, superset: superset },
      { new: true }
    );

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(200).json({
      status: "success",
      data: exercise,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

exports.editMeal = catchAsync(async (req, res, next) => {
  console.log(req.file, "file");
  console.log(req.body, "body");

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
    photo,
  } = req.body;

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
    !time //done
    // !users //done
  ) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  dayname = JSON.parse(dayname);
  ingredients = JSON.parse(ingredients);
  instructions = JSON.parse(instructions);
  // users = JSON.parse(users);

  let phot;

  if (req.file) {
    let cloudimage = await cloudinary.uploader.upload(req.file.path);
    phot = cloudimage.secure_url;
  } else {
    phot = photo;
  }

  console.log(req.params.id, "id");

  const meal = await Meal.findByIdAndUpdate(
    req.params.id,
    {
      dayname,
      mealname,
      mealtype,
      ingredients,
      instructions,
      photo: phot,
      // protein,
      // fats,
      // carbs,
      // calories,
      time,
      // users,
    },
    { new: true }
  );

  await Macro.findOneAndUpdate(
    { meals: { $elemMatch: { $eq: meal._id } } },
    { dayname: dayname },
    { new: true }
  );

  if (req.file) {
    fs.unlinkSync(req.file.path);
  }

  res.status(200).json({
    status: "success",
    data: meal,
  });
});

exports.edituser = catchAsync(async (req, res, next) => {
  if (!req.body) {
    next(new AppError("Please provide all the required fields", 400));
  }

  let user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.getUserMealsForAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log("id", id);
  const totallength = await Macro.find({
    users: { $elemMatch: { $eq: id } },
  }).count();
  console.log("totallength", totallength);
  const features = new APIfeatures(
    Macro.find({ users: { $elemMatch: { $eq: id } } }),
    req.query
  )
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();
  console.log("features", features);

  const meals = await features.query;

  res.status(200).json({
    status: "success",
    data: meals,
    total: totallength,
  });
});

exports.getUserExercisesForAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const totallength = await SetsandReps.find({
    users: { $elemMatch: { $eq: id } },
  }).count();

  console.log("totallength", totallength);

  const features = new APIfeatures(
    SetsandReps.find({
      users: { $elemMatch: { $eq: new mongoose.Types.ObjectId(id) } },
    }),
    req.query
  )
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();

  const exercise = await features.query;
  res.status(200).json({
    status: "success",
    data: exercise,
    total: totallength,
  });
});

exports.removeuserfromexercise = ExerciseController.removeuserfromexercise;

exports.removeuserfrommeal = MealController.removeuserfrommeal;

exports.searchformeal = catchAsync(async (req, res, next) => {
  const { type, search } = req.body;

  const filterObject =
    type == "name"
      ? {
          mealname: { $regex: search, $options: "i" },
          // {email:{$regex:req.query.search,$options:"i"}},
        }
      : {
          mealtype: { $regex: search, $options: "i" },
        };

  console.log(type, search);

  const totalmeals = await Meal.find(filterObject).count();

  console.log(totalmeals);

  const features = new APIfeatures(Meal.find(filterObject), req.query)
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();

  const meals = await features.query;

  res.status(200).json({
    status: "success",
    data: meals,
    total: totalmeals,
  });
});

exports.getMacros = catchAsync(async (req, res, next) => {
  const totallength = await Macro.find({}).count();

  const features = new APIfeatures(Macro.find({}), req.query)
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();

  const meals = await features.query;

  res.status(200).json({
    status: "success",
    data: meals,
    total: totallength,
  });
});

exports.getSetsAndReps = catchAsync(async (req, res, next) => {
  let totallength = await SetsandReps.find({}).count();

  // const dat

  const features = new APIfeatures(SetsandReps.find({}), req.query)
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();

  const setsandreps = await features.query;

  res.status(200).json({
    status: "success",
    data: setsandreps,
    total: totallength,
  });
});
