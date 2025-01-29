const mongoose = require("mongoose");

const macroSchema = new mongoose.Schema(
  {
     dayname: {
        type: Array,
      },
    //   mealname: {
    //     type: String,
    //     required: true,
    //   },
    //   mealtype: {
    //     type: String,
    //     required: true,
    //   },
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
    // instructions: {
    //   type: Array,
    //   required: true,
    //   default: [],
    // },
    // photo: {
    //   type: String,
    //   required: true,
    // },
    protein: {
      type: Number,
      required: true,
      default: 0,
    },
    fats: {
      type: Number,
      required: true,
      default: 0,
    },
    carbs: {
      type: Number,
      required: true,
      default: 0,
    },
    calories: {
      type: Number,
      required: true,
      default: 0,
    },
    // time: {
    //   type: String,
    //   required: true,
    //   default: "",
    // },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "User",
      },
    ],
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
    // userremoved: {
    //   type: Boolean,
    //   default: false,
    //   select: false,
    // },
  },
  { timestamps: true }
);
macroSchema.pre(/^find/, function (next) {
  this.find({}).select('-users').populate({ path: "meals",select:"-ingredients -dayname -users -createdAt -updatedAt -__v" });
  next();
});

const Macro = mongoose.model("Macros", macroSchema);

// exerciseschema.pre(/^find/, function(next){
//   this.find({}).select('-__v -createdAt -updatedAt').populate('video').populate({path:'users',select:"firstname lastname _id"})
//   next();
// });

module.exports = Macro;
