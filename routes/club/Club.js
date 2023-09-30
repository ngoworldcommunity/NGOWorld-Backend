const express = require("express");
const User = require("../../schema/user/UserSchema");
const { STATUSCODE } = require("../../utils/Status");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (req.query.slug) {
      const clubdetails = await User.findOne({ slug: req.query.slug });
      return res.status(STATUSCODE.OK).json(clubdetails);
    }

    const clubs = await User.find({
      usertype: "club",
    });

    res.json(clubs);
  } catch (error) {
    res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
