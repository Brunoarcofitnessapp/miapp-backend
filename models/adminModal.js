const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
