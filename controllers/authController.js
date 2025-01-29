const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const { promisify } = require("util");
const OtpSchema = require("../models/otpModel");
const sendmail = require("../util/sendemail");
const Admin = require("../models/adminModal");

const signtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

exports.AuthMiddleware = catchAsync(async function (req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not logged in Please login to continue", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  const CurrentUser = await User.findById(decoded.id);
  if (!CurrentUser) {
    return next(
      new AppError(
        "The token has been expired Please login again to continue",
        401
      )
    );
  }

  req.user = CurrentUser;

  next();
});

exports.LoginwithEmailandPassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Both Email And Password are required to Login", 400)
    );
  }

  const FindedUser = await User.findOne({ email: email, password: password });

  if (!FindedUser) {
    return next(
      new AppError("Please Enter the correct email or password", 400)
    );
  }

  // const comparepassword = await bcrypt.compare(password,FindedUser.password)

  // if(!comparepassword){
  //     return next(new AppError('Please Enter the correct password',400))
  // }

  const token = signtoken(FindedUser._id);

  res.status(200).json({
    message: "Login SuccessFully",
    data: FindedUser,
    token,
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const FindedUser = await User.findOne({ email: email });

  if (FindedUser) {
    return next(new AppError("User with this email already exists", 400));
  }

  const newUser = await User.create({
    email: email,
    password: password,
    ...req.body,
  });

  // const token = signtoken(newUser._id)

  res.status(200).json({
    message: "User Created SuccessFully",
    data: newUser,
    // token
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Please provide your email address", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new AppError(
        "There is no user with this email address Please Enter Correct Email Address",
        404
      )
    );
  }

  const RandomOtp = Math.floor(1000 + Math.random() * 9000);
  console.log(RandomOtp);

  await OtpSchema.create({
    otp: RandomOtp,
  });

  const html = `<p>This is the Otp ${RandomOtp} for your Reset Password Verification</p>
  <hr />
  <p>Enter This Otp to verify your registeration This Otp Will Expire in 5 minutes</p> 
  <p>Thanks</p>
  `;

  sendmail(email, html, "Otp For Reset Password", res);

  res.status(200).json({
    message: "Otp Sent SuccessFully Please Check Your Email",
  });
});

exports.matchOtp = catchAsync(async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return next(new AppError("Please provide your otp", 400));
  }

  const FindedOtp = await OtpSchema.findOne({ otp });

  if (!FindedOtp) {
    return next(new AppError("Please Enter Correct Otp", 404));
  }

  const now = new Date().getTime();
  const diff = now - FindedOtp.createdAt.getTime();

  if (diff < 600000) {
    await OtpSchema.findOneAndDelete({ otp });
    res.status(200).json({
      status: "success",
      message:
        "Your Otp has been Matched successfully Now you can reset the password",
    });
  } else {
    await OtpSchema.findOneAndDelete({ otp });
    return next(
      new AppError("Your Otp has been Expired Please Try Again", 404)
    );
  }
});

exports.resetpassword = catchAsync(async (req, res, next) => {
  const { newpassword, confirmpassword, email } = req.body;

  if (!newpassword || !confirmpassword) {
    return next(new AppError("Please provide your new password", 400));
  }

  if (confirmpassword !== newpassword) {
    return next(
      new AppError("New Password and Confirm Password Does not Match", 400)
    );
  }

  await User.findOneAndUpdate(
    { email: email },
    { password: newpassword },
    { new: true }
  );

  res.status(200).json({
    message: "Your Password has been resetted SuccessFully",
  });
});
