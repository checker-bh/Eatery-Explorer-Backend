const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Restaurant = require("../models/restaurant.js");

const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========
router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:restaurantId", async (req, res) => {
  try {
    const  restaurant= await Restaurant.findById(req.params.restaurantId);
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    //req.body.author = req.user.id;
    const restaurant = await Restaurant.create(req.body);
    // hoot._doc.author = req.user;
    res.status(201).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/:restaurantId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    // if (!hoot.author.equals(req.user.id)) {
    //   return res.status(403).send("You're not allowed to do that!");
    // }

    const updatedrestaurant = await Restaurant.findByIdAndUpdate(
      req.params.restaurantId,
      req.body,
      { new: true }
    );

    //updatedHoot._doc.author = req.user;

    res.status(200).json(updatedrestaurant);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:restaurantId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    // if (!hoot.author.equals(req.user.id)) {
    //   return res.status(403).send("You're not allowed to do that!");
    // }

    const deletedrestaurant = await Restaurant.findByIdAndDelete(
      req.params.restaurantId
    );
    res.status(200).json(deletedrestaurant);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:restaurantId/comments", async (req, res) => {
  try {
    //req.body.author = req.user.id;
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    restaurant.comments.push(req.body);
    await restaurant.save();

    // Find the newly created comment:
    const newComment = restaurant.comments[restaurant.comments.length - 1];

    //newComment._doc.author = req.user;

    // Respond with the newComment:
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
