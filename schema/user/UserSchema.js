const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  usertype: { type: String },
  username: {
    type: String,
    required: true,
  },
  name: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tagLine: { type: String },
  description: { type: String },
  city: { type: String },
  state: { type: String },
  address: { type: String },
  country: { type: String },
  pincode: { type: String },
  cart: [{ id: { type: String } }],
});

module.exports = mongoose.model("user", UserSchema);
