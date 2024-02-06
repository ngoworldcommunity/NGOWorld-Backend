const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  usertype: { type: String },
  slug: {
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

// res
// .status(STATUSCODE.CREATED)
// .cookie("Token", token, {
//   sameSite: "none",
//   httpOnly: true,
//   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//   secure: true,
//   domain: process.env.ORIGIN_DOMAIN,
// })
// .cookie("username", existingUser.slug, {
//   httpOnly: false,
//   secure: true,
//   sameSite: "none",
//   domain: process.env.ORIGIN_DOMAIN,
// })
// .cookie("isLoggedIn", true, {
//   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//   httpOnly: false,
//   secure: true,
//   sameSite: "none",
//   domain: process.env.ORIGIN_DOMAIN,
// })
// .cookie("usertype", existingUser.usertype, {
//   httpOnly: false,
//   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//   secure: true,
//   sameSite: "none",
//   domain: process.env.ORIGIN_DOMAIN,
// })

// .json({
//   message: STATUSMESSAGE.LOGIN_SUCCESS,
// });
