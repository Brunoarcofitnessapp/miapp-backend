const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    dayname: {
      type: Array,
      required: true,
    },
    mealname: {
      type: String,
      required: true,
    },
    mealtype: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
      default: [],
    },
    // ingredients: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: "Ingredient",
    //   },
    // ],
    instructions: {
      type: Array,
      required: true,
      default: [],
    },
    photo: {
      type: String,
      required: true,
    },
    // protein: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
    // fats: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
    // carbs: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
    // calories: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
    time: {
      type: String,
      required: true,
      default: "",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "User",
      },
    ],
    // macrons: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     // required: true,
    //     ref: "Macro",
    //   },
    // ],
    userremoved: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);
mealSchema.pre(/^find/, function (next) {
  this.find({}).populate({ path: "users", select: "firstname lastname _id" });
  next();
});

const Meal = mongoose.model("Meal", mealSchema);

// exerciseschema.pre(/^find/, function(next){
//   this.find({}).select('-__v -createdAt -updatedAt').populate('video').populate({path:'users',select:"firstname lastname _id"})
//   next();
// });

module.exports = Meal;
