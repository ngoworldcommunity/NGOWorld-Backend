const express = require("express");
const User = require("../../schema/user/UserSchema");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (req.query.slug) {
      const clubdetails = await User.findOne({ slug: req.query.slug });
      if (clubdetails && clubdetails.usertype == "club") {
        return res.status(200).json(clubdetails);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
