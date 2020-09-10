const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const mongoose  = require('mongoose');


// GET PLACE BY PLACE ID
const getPlaceById = async (req, res, next) => {
  // Get value form link
  const placeId = req.params.pid;
  let place;
  try {
    // looks for place by place id
    place = await Place.findById(placeId);
  } catch (err) {
    // throws error while getting from database
    const error = new HttpError("Error when getting by Id", 500);
    return next(error);
  }
  // Checks if place exists
  if (!place) {
    const error = new HttpError("Place could not be found!", 404);
    return next(error);
  }
// JSON response with place
  res.json({ place: place.toObject({ getters: true }) });
};

// GET PLACE BY USER ID
const getPlacesByUserId = async (req, res, next) => {
  // gets uri id
  const userId = req.params.uid;

  let places;
  try {
    // looks for places by creators id
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("error when getting by User Id", 500);
    return next(error);
  }
// checks if places exists
  if (!places || places.length === 0) {
    return next(new Error("Creator could not be found!", 404));
  }
//JSON response
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

// CREATE PLACE
const createPlace = async (req, res, next) => {
  //Validates 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Error during validation!", 422);
  }
// request values
  const { title, description, address, creator } = req.body;

  // populates object to be persisted to the database
  const createdPlace = new Place({
    title,
    description,
    location: {
      lat: 40.7484474,
      lng: -73.98715,
    },
    address,
    image:
      "https://www.bostonmagazine.com/wp-content/uploads/sites/2/2018/11/01_Snake_River_Grand_Tetons-feature.jpg",
    creator
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("An error has occurred!", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("User unknown!", 404);
    return next(error);
  }

  try {
// Transactions allow us to do preform many operations at the same time & changes made can be reversed
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError("An error has occurred while pushing!", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

//UPDATE PLACE
const updatePlace = async (req, res, next) => {
  // Validates requested
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Error during validation!", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Could not find place", 500);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Could not update place", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

//DELETE PLACE
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    //Allows us to directly connect to creator
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError("Place could not be found!", 500);
    return next(error);
  }

  if(!place){
    const error = new HttpError("Place does not exist!", 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session: sess});
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Place could not be deleted!!", 500);
    return next(error);
  }

  res.status(200).json({ message: "Place deleted!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
