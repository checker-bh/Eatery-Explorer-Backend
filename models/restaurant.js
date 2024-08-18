const mongoose = require("mongoose");

const commentSchemaR = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
  // { timestamps: true }
);

const commentSchemaF = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
  // { timestamps: true }
);

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
    comments: [commentSchemaR],
  }
  // { timestamps: true }
);
//
const restaurantsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    describtion: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
      // enum: ['italian', 'indian', 'persian', 'arabian', 'japanese', 'chinese', 'mexican', 'american', 'french', 'other'],
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [commentSchemaR],
    menu: [foodSchema],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("ٌRestaurant", restaurantsSchema);

module.exports = Restaurant;
