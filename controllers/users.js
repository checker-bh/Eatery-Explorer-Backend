const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { token } = require("morgan");
const AuthToken = token;

router.post("/signup", async (req, res) => {
  try {
    // Check if the username is already taken
    console.log(req.body);
    const userInDatabase = await User.findOne({ username: req.body.username });

    console.log("ich bin", userInDatabase);
    if (!userInDatabase) {
      const user = await User.create({
        username: req.body.username,
        hashedPassword: bcrypt.hashSync(
          req.body.password,
          parseInt(process.env.SALT_ROUNDS, 10)
        ),
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_SECRET
      );
      res.status(201).json({ user, token });
    } else {
      return res.json({ error: "Username already taken." });
      // Create a new user with hashed password
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
      const token = jwt.sign(
        { username: user.username, id: user._id, hello: "world" },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token, user });
    } else {
      res.status(401).json({ error: "Invalid username or password." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:username/:userId", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const user = await User.findById(ownerId).select("username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
