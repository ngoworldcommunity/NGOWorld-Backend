const express = require("express");
const router = express.Router();
const Event = require("../../schema/events/EventSchema");
const { STATUSCODE, STATUSMESSAGE } = require("../../static/Status");
const { setTime } = require("../../utils/SetTime");
const jwt = require("jsonwebtoken");
const User = require("../../schema/user/UserSchema");

router.get("/", async (req, res) => {
  try {
    if (req.query.slug) {
      const eventDetails = await Event.findOne({ slug: req.query.slug });

      if (eventDetails) {
        return res.status(STATUSCODE.OK).json(eventDetails);
      }
      return res
        .status(STATUSCODE.NOT_FOUND)
        .json({ message: STATUSMESSAGE.NOT_FOUND });
    }

    const allEvents = await Event.find({});
    res.status(STATUSCODE.OK).json(allEvents);
  } catch (error) {
    return res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .json({ message: STATUSMESSAGE.INTERNAL_SERVER_ERROR });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { uid, ...data } = req.body;

    if (
      !data.name ||
      !uid ||
      !data.description ||
      !data.coverImage ||
      !data.mode
    ) {
      return res
        .status(STATUSCODE.BAD_REQUEST)
        .json({ message: "Missing Required Fields" });
    }

    if (
      data.mode === "Offline" &&
      (!data.city ||
        !data.state ||
        !data.country ||
        !data.address ||
        !data.mapIframe)
    ) {
      return res
        .status(STATUSCODE.BAD_REQUEST)
        .json({ message: "Missing Required Fields" });
    }

    // Ensure unique slug:
    const existingEvent = await Event.findOne({ uid });
    if (existingEvent) {
      return res
        .status(STATUSCODE.CONFLICT)
        .json({ message: STATUSMESSAGE.EVENT_UID_ALREADY_EXISTS });
    }

    const { Token } = req.cookies;
    const user = await User.findOne({
      email: jwt.verify(Token, process.env.JWT_SECRET).User.id,
    });

    const newEvent = new Event({
      ...data,
      uid,
      hostName: user.name,
      hostUsername: user.userName,
      createdAt: setTime(),
      updatedAt: setTime(),
    });

    const validationErrors = newEvent.validateSync();
    if (validationErrors) {
      const errors = Object.values(validationErrors.errors).map(
        (error) => error.message,
      );
      return res
        .status(STATUSCODE.BAD_REQUEST)
        .json({ message: "Event Validation failed", errors });
    }

    const savedEvent = await newEvent.save();

    res
      .status(STATUSCODE.CREATED)
      .json({ message: "Event Created", savedEvent });
  } catch (error) {
    console.error(error);
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Create Event Failed" });
  }
});

module.exports = router;
