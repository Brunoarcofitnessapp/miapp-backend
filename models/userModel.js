const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      // required: true,
      trim: true,
    },
    lastname: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      // required: true,
      // unique:true
    },
    phone: {
      type: String,
      // required:true,
      // unique:true
    },
    dob: {
      type: String,
      // required:true,
      // unique:true
    },
    address: {
      type: Array,
      default: [],
    },

    password: {
      type: String,
      // required: true,
    },
    weight: {
      type: String,
      default: "",
    },
    bodyfat: {
      type: String,
      default: "",
    },
    arms: {
      type: String,
      default: "",
    },
    shoulder: {
      type: String,
      default: "",
    },
    chest: {
      type: String,
      default: "",
    },
    waist: {
      type: String,
      default: "",
    },
    hips: {
      type: String,
      default: "",
    },
    legs: {
      type: String,
      default: "",
    },
    twins: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    photos: {
      type: Array,
      default: [
        {
          display: "Frente",
          image: "",
        },
        {
          display: "Lado",
          image: "",
        },
        {
          display: "Espalda",
          image: "",
        },
      ],
    },
    weightRecord: {
      type: Array,
      default: [],
    },
    bodyfatRecord: {
      type: Array,
      default: [],
    },
    armsRecord: {
      type: Array,
      default: [],
    },
    shoulderRecord: {
      type: Array,
      default: [],
    },
    chestRecord: {
      type: Array,
      default: [],
    },
    waistRecord: {
      type: Array,
      default: [],
    },
    hipsRecord: {
      type: Array,
      default: [],
    },
    legsRecord: {
      type: Array,
      default: [],
    },
    twinsRecord: {
      type: Array,
      default: [],
    },
    heightRecord: {
      type: Array,
      default: [],
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/brunoarco/image/upload/v1662202009/blank-profile-picture-g2ec5cfcf8_640_svtxgv.png",
    },
    userroutinedetailstext: {
      type: String,
      default: "",
    },
    age: {
      type: String,
      default: "",
      // required : true,
    },
    residencePlace: {
      type: String,
      default: "",
      // required : true,
    },
    trainingPreference: {
      type: String,
      default: "",
      // required : true,
    },
    // elementsinHome: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    timesperweek: {
      type: String,
      default: "",
      // required : true,
    },
    // getupAt: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    // breakfastAt: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    // lunchAt: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    // snackAt: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    // dinnerAt: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    // trainAt: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    // startworkAt: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    // endworkAt: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    hateaboutfoods: {
      type: String,
      default: "",
      // required : true,
    },
    intoleranceaboutfoods: {
      type: String,
      default: "",
      // required : true,
    },
    injuries: {
      type: String,
      default: "",
      // required : true,
    },
    supplements: {
      type: String,
      default: "",
      // required : true,
    },
    myGoal: {
      type: String,
      default: "",
      // required : true,
    },
    // currentTraining: {
    //   type: String,
    //   default: "",
    //   // required : true,
    // },
    medication: {
      type: String,
      default: "",
      // required : true,
    },
    gender: {
      type: String,
      default: "",
    },
    mealsperday: {
      type: String,
      default: "",
    },
    physicslevel: {
      type: String,
      default: "",
    },
  }
  // {
  //   toJSON: {
  //     transform: (doc, ret) => {
  //       let { password, __v, ...rest } = ret;
  //       return rest;
  //     },
  //   },
  // }
);

const User = mongoose.model("User", userschema);
module.exports = User;
