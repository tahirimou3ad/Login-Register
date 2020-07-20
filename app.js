const express = require("express");
const app = express();
const path = require("path");
const router = require("./controllers/router");
const mongoose = require("mongoose");
require("dotenv/config");

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }, () =>
  console.log("Connected to DB !")
);

//Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Middlewares
app.set("views", path.join(__dirname, "/views"));
app.set("view-engine", "ejs");

//Router middlewares
app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} ...`);
});
