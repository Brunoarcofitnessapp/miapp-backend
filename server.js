require("dotenv").config();
const app = require("./App");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGODB CONNECTED");
  })
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
