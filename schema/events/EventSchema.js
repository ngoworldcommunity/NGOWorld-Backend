const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  about: {
    type: String,
    required: true,
    trim: true,
  },

  hostUsername: {
    type: String,
    required: true,
  },
  hostName: {
    type: String,
    required: true,
    trim: true,
  },
  bannerImage: {
    type: String,
    trim: true,
  },
  thumbnailImage: {
    type: String,
    required: true,
    trim: true,
  },

  mode: {
    type: String,
    required: true,
    enum: ["online", "offline"],
  },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  iframe: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient querying:
EventSchema.index({ uid: 1 }, { unique: true }); // Ensure unique `uid`
EventSchema.index({ host: 1 }); // Optimize queries based on `host`
EventSchema.index({ isApproved: 1 }); // Optimize queries based on `isApproved`

module.exports = mongoose.model("Event", EventSchema);
