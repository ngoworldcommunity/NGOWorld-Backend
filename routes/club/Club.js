const express = require("express");
const User = require("../../schema/user/UserSchema");
const { STATUSCODE, STATUSMESSAGE } = require("../../static/Status");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { username } = req.query;

    if (username) {
      const clubdetails = await User.findOne({ username });
      if (!clubdetails)
        return res
          .status(STATUSCODE.NOT_FOUND)
          .json({ message: STATUSMESSAGE.NOT_FOUND });
      return res.status(STATUSCODE.OK).json(clubdetails);
    }

    const clubs = await User.find({
      usertype: "club",
    });

    res.json(clubs);
  } catch (error) {
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .json({ message: STATUSMESSAGE.INTERNAL_SERVER_ERROR });
  }
});

router.get("/change", async (req, res) => {
  try {
    await User.updateMany({}, { $rename: { username: "slug" } });

    res.json({ message: "done" });
  } catch (error) {
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .json({ message: STATUSMESSAGE.INTERNAL_SERVER_ERROR });
  }
});

module.exports = router;
