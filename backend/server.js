const express = require("express");
const cors = require("cors");

// Import routes
const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");

const app = express();

app.use(cors());
app.use(express.json());

// use routes
app.use("/api/users", usersRoutes);
app.use("/api/places", placesRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({message: error.message || 'Unknown error occured'});
});

//Listen to port
app.listen(5000, () => {
  console.log("listening to port");
});
