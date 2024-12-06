const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  userType: { type: String },
  userName: {
    type: String,
    required: true,
  },
  name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: { type: String },
  profilePicture: { type: String },
  bannerPicture: { type: String },
  password: {
    type: String,
    required: true,
  },
  description: { type: String },
  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
  },
  config: {
    hasCompletedProfile: { type: Boolean, default: false },
  },
  cart: [{ id: { type: String } }],
});

module.exports = mongoose.model("user", UserSchema);
