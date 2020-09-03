const express = require("express");

const router = express.Router();

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

router.get("/:pid", (req, res, next) => {
  // Get value form link
  const placeId = req.params.pid;
  const place = DUMMY_PLACE.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new Error("Place could not be found!");
    error.code = 404;
    throw error;
  }
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACE.find((p) => {
    return p.creator === userId;
  });
  if (!place) {
    const error = new Error("Creator could not be found!");
    error.code = 404;
    return next(error);
  }
  res.json({ place });
});

module.exports = router;
