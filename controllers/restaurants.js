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
    const restaurant = await Restaurant.findById(req.params.restaurantId);
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
    req.body.authorId = req.user.id;

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

//Food routes
router.get("/:restaurantId/menu", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    res.status(200).json(restaurant.menu);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:restaurantId/menu", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    const newFood = await restaurant.menu.push(req.body);
    restaurant.save();
    const addedItem = restaurant.menu[restaurant.menu.length - 1];
    res.status(200).json(addedItem);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:restaurantId/menu/:foodId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foodIndex = restaurant.menu.findIndex(
      (item) => item._id.toString() === req.params.foodId
    );
    if (foodIndex === -1) {
      return res.status(404).json({ message: "Food item not found" });
    }

    restaurant.menu[foodIndex] = {
      ...restaurant.menu[foodIndex]._doc,
      ...req.body,
    };
    await restaurant.save();

    res.status(200).json(restaurant.menu[foodIndex]);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:restaurantId/menu/:foodId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foodIndex = restaurant.menu.findIndex(
      (item) => item._id.toString() === req.params.foodId
    );
    if (foodIndex === -1) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const deletedItem = restaurant.menu.splice(foodIndex, 1);
    restaurant.save();

    res.status(200).json(deletedItem);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:restaurantId/menu/:foodId", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foodIndex = restaurant.menu.findIndex(
      (item) => item._id.toString() === req.params.foodId
    );
    if (foodIndex === -1) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const deletedItem = restaurant.menu.splice(foodIndex, 1);
    restaurant.save();

    res.status(200).json(deletedItem);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:restaurantId/menu/:foodId/comments", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foodIndex = restaurant.menu.findIndex(
      (item) => item._id.toString() === req.params.foodId
    );
    if (foodIndex === -1) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const foodComments = restaurant.menu[foodIndex].comments;

    res.status(200).json(foodComments);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Comments Routes
router.get("/:restaurantId/comments", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    res.status(200).json(restaurant.comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:restaurantId/menu/:foodId/comments", async (req, res) => {
  req.body.authorId = req.user.id;

  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foodIndex = restaurant.menu.findIndex(
      (item) => item._id.toString() === req.params.foodId
    );
    if (foodIndex === -1) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const newFoodComment = restaurant.menu[foodIndex].comments.push(req.body);
    restaurant.save();

    res
      .status(200)
      .json(
        restaurant.menu[foodIndex].comments[
          restaurant.menu[foodIndex].comments.length - 1
        ]
      );
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:restaurantId/comments/:commentId", async (req, res) => {
  req.body.authorId = req.user.id;

  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const commentIndex = restaurant.comments.findIndex(
      (item) => item._id.toString() === req.params.commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment item not found" });
    }

    const deletedComment = restaurant.comments.splice(commentIndex, 1);
    restaurant.save();

    res.status(200).json(deletedComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete(
  "/:restaurantId/menu/:foodId/comments/:commentId",
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // const commentIndex = restaurant.comments.findIndex(item => item._id.toString() === req.params.commentId);

      const foodIndex = restaurant.menu.findIndex(
        (item) => item._id.toString() === req.params.foodId
      );

      const commentIndex = restaurant.menu[foodIndex].comments.findIndex(
        (item) => item._id.toString() === req.params.commentId
      );

      if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment item not found" });
      }

      const deletedComment = restaurant.menu[foodIndex].comments.splice(
        commentIndex,
        1
      );

      //-----------------------------------
      // const deletedComment = restaurant.comments.splice(commentIndex,1);
      restaurant.save();

      res.status(200).json(deletedComment);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
//
const mario = 10;
module.exports = router;
