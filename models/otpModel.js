const mongoose = require("mongoose");


const otpschema = mongoose.Schema(
    {
      otp: {
        type: String,
        required: true,
      }
    },
    {
      timestamps: true,
    }
  );
  
  const Otp = mongoose.model("OtpSchema", otpschema);
  
  module.exports = Otp;