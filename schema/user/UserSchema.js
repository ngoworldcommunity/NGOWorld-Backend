const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: false,
  },
  cart: [{ id: { type: String } }],
});

module.exports = mongoose.model("user", UserSchema);
