const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Signup Failed!", 500);
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Error during validation!", 422);
  }
  const { name, email, password } = req.body;
  let exists;
  try {
    exists = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup Failed!", 500);
    return next(error);
  }

  if (exists) {
    const error = new HttpError("User Already exists!", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image: "https://www.toronto.ca/wp-content/uploads/2020/07/9066-home-skyline-1500x700.jpg",
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed!", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  let idedUser;

  try {
    idedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login user failed!", 500);
    return next(error);
  }

  if (!idedUser || idedUser.password !== password) {
    throw new HttpError("User Invalid", 401);
  }

  res.json({ message: "Logged in!" });
};

exports.getUser = getUser;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
