const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_KEY,
  },
});

// const emailobject = (email, html, subject) => {
//   return {
//     from: "muhammadmudassir0900@gmail.com",
//     to: "brunoarcofitnessapp@gmail.com",
//     subject: subject,
//     html: html,
//   };
// };

const sendmail = async (email, html, subject, res) => {
  console.log(email, html, subject);

  try {
    // let data = await sgMail.send(emailobject(email, html, subject));
    // console.log(data, "data");

    await transporter
      .sendMail({
        from: process.env.EMAIL_ID,
        to: email,
        subject: subject,
        html: html,
      })
      .then((response) => console.log("response", response))
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: "Failed To sent the email",
    });
  }
};

module.exports = sendmail;
