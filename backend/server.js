const express = require("express");
const cors = require("cors");
const HttpError = require("./models/http-error");

// Import routes
const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");

const app = express();

app.use(cors());
app.use(express.json());

// use routes
app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find a route", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occurred" });
});

//Listen to port
app.listen(5000, () => {
  console.log("listening to port");
});
