const HttpError = require("../models/http-error");

const DUMMY_PLACE = [
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

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACE.find((p) => {
    return p.creator === userId;
  });
  if (!place) {
    return next(new Error("Creator could not be found!", 404));
  }
  res.json({ place });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACE.push(createPlace);
  res.status(201).json({place: createdPlace});
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
