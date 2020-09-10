const express = require("express");
const cors = require("cors");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");

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

mongoose
  .connect(
    "mongodb+srv://mean123:mean123@cluster0.lplof.gcp.mongodb.net/places_db?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  .then(() => {
    //Listen to port
    app.listen(5000, () => {
      console.log("listening to port");
    });
  })
  .catch((err) => console.log("err"));
  mongoose.set('useCreateIndex', true);
