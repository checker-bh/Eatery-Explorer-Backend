const dotenv = require("dotenv");

dotenv.config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");


const app = express();
app.use(morgan("dev"));

const mongoose = require("mongoose");
const testJWTRouter = require("./controllers/test-jwt");

const usersRouter = require("./controllers/users");
const profilesRouter = require("./controllers/profiles");
const restaurantsRouter = require("./controllers/restaurants.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.use(cors());
app.use(express.json());

// Routes go here
app.use("/test-jwt", testJWTRouter);
app.use("/users", usersRouter);
app.use("/profiles", profilesRouter);
app.use("/restaurants", restaurantsRouter);
// app.use('/restaurants', restaurantsRouter);


app.listen(process.env.PORT, () => {
  console.log("The express app is ready!");
});
