const express = require("express");
const router = express.Router();
const User = require("../models/user");
const verifyToken = require("../middleware/verify-token");

router.delete("/:userId", verifyToken, async (req, res) => {
 const removed = await User.findByIdAndDelete(req.params.userId);
	res.json({ message: "User deleted is ",removed });
});
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userId", verifyToken , async (req, res) => {
  try {
    // if (req.user.id !== req.params.userId) {
    //   return res.status(401).json({ error: "access denied" });
    // }
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error("Profile not found.");
    }
    res.json({ user });
  } catch (error) {
    if (res.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});
router.put("/:userId", verifyToken, async (req, res) => {
  user = await User.findByIdAndUpdate(req.params.userId, req.body , {new: true});
	
	res.json({ user });

});

module.exports = router;
