const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  meals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Macros",
    },
  ],
  exercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SetsandReps",
    },
  ],
});

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
