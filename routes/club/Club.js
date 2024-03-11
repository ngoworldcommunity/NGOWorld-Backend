const express = require("express");
const User = require("../../schema/user/UserSchema");
const { STATUSCODE, STATUSMESSAGE } = require("../../static/Status");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { userName } = req.query;

    if (userName) {
      const clubdetails = await User.findOne({ userName });
      if (!clubdetails)
        return res
          .status(STATUSCODE.NOT_FOUND)
          .json({ message: STATUSMESSAGE.NOT_FOUND });
      return res.status(STATUSCODE.OK).json(clubdetails);
    }

    const clubs = await User.find({
      userType: "club",
    });

    res.json(clubs);
  } catch (error) {
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .json({ message: STATUSMESSAGE.INTERNAL_SERVER_ERROR });
  }
});

module.exports = router;
