/* eslint-disable no-unused-vars */
const express = require("express");
const User = require("../../schema/user/UserSchema");
const { STATUSCODE, STATUSMESSAGE } = require("../../static/Status");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserSchema = require("../../schema/user/UserSchema");

router.get("/", async (req, res) => {
  try {
    const { userName } = req.query;

    if (userName) {
      const clubdetails = await User.findOne({ userName }).select(
        "-password -__v -_id",
      );

      if (!clubdetails) {
        return res
          .status(STATUSCODE.NOT_FOUND)
          .json({ message: STATUSMESSAGE.NOT_FOUND });
      }

      return res.status(STATUSCODE.OK).json(clubdetails);
    }

    const clubs = await User.find({ userType: "club" }).select(
      "-password -__v -_id",
    );

    res.status(STATUSCODE.OK).json(clubs);
  } catch (error) {
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .json({ message: STATUSMESSAGE.INTERNAL_SERVER_ERROR });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const token = req.cookies.Token;

    if (!token) {
      return res
        .status(STATUSCODE.FORBIDDEN)
        .json({ message: STATUSMESSAGE.FORBIDDEN });
    }

    const { User } = jwt.verify(token, process.env.JWT_SECRET);
    const data = await UserSchema.findOne({ email: User.id });

    if (!data)
      return res
        .status(STATUSCODE.NOT_FOUND)
        .json({ message: STATUSMESSAGE.DASHBOARD_FETCH_FAILED });

    const { password, _id, __v, ...dataWithoutSensitiveInfo } = data.toObject();
    const dashboardData = { ...dataWithoutSensitiveInfo };

    return res.status(STATUSCODE.OK).json(dashboardData);
  } catch (error) {
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .json({ message: STATUSMESSAGE.INTERNAL_SERVER_ERROR });
  }
});

module.exports = router;
