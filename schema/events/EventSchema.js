const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  hostClubSlug: {
    type: String,
    required: true,
  },
  hostClubName: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
  },
  thumbnailImage: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  iframe: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Event", EventSchema);
