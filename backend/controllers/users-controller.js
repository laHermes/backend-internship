const { v4: uuid } = require('uuid');
const {validationResult} = require('express-validator');
const HttpError = require("../models/http-error");

const DUMMY_USER = [
  {
    id: "u1",
    name: "Lale",
    email: "lale@lale.com",
    password: "lale",
  },
];

const getUser = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USER });
};

const signupUser = (req, res, next) => {
    const errors = validationResult(req);
  if(!errors.isEmpty()){
    throw new HttpError("Error during validation!", 422);
  }
  const { name, email, password } = req.body;
  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  const hasUser = DUMMY_USER.find(u => u.email === email);
  if(hasUser){
    throw new HttpError("User already exists", 422);

  }
  DUMMY_USER.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  const idedUser = DUMMY_USER.find((u) => u.email === email);

  if (!idedUser || idedUser.password !== password) {
    throw new HttpError("User Invalid", 401);
  }

  res.json({ message: "Logged in!" });
};

exports.getUser = getUser;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
