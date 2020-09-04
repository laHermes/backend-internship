const HttpError = require("../models/http-error");
const { v4: uuid } = require('uuid');
const {validationResult} = require('express-validator');

let DUMMY_PLACE = [
  {
    id: "p1",
    title: "New York",
    description: "Big yuge city",
    location: {
      lat: 40.7484474,
      lng: -73.98715,
    },
    address: "20 W 34th St, New York, NY 1001",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  // Get value form link
  const placeId = req.params.pid;
  const place = DUMMY_PLACE.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    throw new HttpError("Place could not be found!", 404);
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACE.filter((p) => {
    return p.creator === userId;
  });
  if (!places || places.length === 0) {
    return next(new Error("Creator could not be found!", 404));
  }
  res.json({ places });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    throw new HttpError("Error during validation!", 422);

  }
  
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACE.push(createPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    throw new HttpError("Error during validation!", 422);

  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  //Makes a copy of DUMMY_PLACE
  const updatedPlace = { ...DUMMY_PLACE.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACE.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACE[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACE = DUMMY_PLACE.filter((p) => p.id !== placeId);
  res.status(200).json({message: 'Place deleted!'})
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
