const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

//GET requests
router.get("/", (req, res) => {
  res.render("welcome.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

//POST requests
router.post("/register", async (req, res) => {
  //Validation
  const { error } = registerValidation(req.body);
  if (error) res.status(400).send(error.details[0].message);

  //Checking if an email already exists in the DB
  const emailExisted = await User.findOne({ email: req.body.email });
  if (emailExisted) res.status(400).send("Email already exists !");

  //Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Creating a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //Validation
  const { error } = loginValidation(req.body);
  if (error) res.status(400).send(error.details[0].message);

  //Checking if an email exists or no in the DB
  const user = await User.findOne({ email: req.body.email });
  if (!user) res.status(400).send("Email does not exist !");

  //Checking if the passwords match
  const validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword) res.status(400).send("Password not correct, try again !");

  //Creating a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
  res.header("Authentication-token", token).send(token);
  res.send("Logged in successfully !");
});
module.exports = router;
