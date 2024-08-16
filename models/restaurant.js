const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
 // { timestamps: true }
);

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
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [commentSchema]
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('ٌRestaurant', restaurantsSchema);

module.exports = Restaurant;