const express = require("express");
const router = express.Router();
const Event = require("../../schema/events/EventSchema");
const { STATUSCODE, STATUSMESSAGE } = require("../../static/Status");
const { setTime } = require("../../utils/SetTime");

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

    // Validate required fields:
    if (
      !data.name ||
      !uid ||
      !data.about ||
      !data.hostUsername ||
      !data.hostName ||
      !data.thumbnailImage ||
      !data.mode ||
      !data.date ||
      !data.startTime ||
      !data.endTime ||
      !data.timezone
    ) {
      console.log(data);
      return res
        .status(STATUSCODE.BAD_REQUEST)
        .json({ message: "Missing Required Fields" });
    }

    // Ensure unique slug:
    const existingEvent = await Event.findOne({ uid });
    if (existingEvent) {
      return res
        .status(STATUSCODE.CONFLICT)
        .json({ message: "Already exists" });
    }

    // Combine sanitized data with timestamp fields:
    const newEvent = new Event({
      ...data,
      uid,
      createdAt: setTime(),
      updatedAt: setTime(),
    });

    // Validate data before saving:
    const validationErrors = newEvent.validateSync();
    if (validationErrors) {
      const errors = Object.values(validationErrors.errors).map(
        (error) => error.message,
      );
      return res
        .status(STATUSCODE.BAD_REQUEST)
        .json({ message: "Event Validation failed", errors });
    }

    // Save the event:
    const savedEvent = await newEvent.save();

    // Respond with the created event:
    res.status(STATUSCODE.CREATED).json(savedEvent);
  } catch (error) {
    console.error(error);
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .json({ message: "Create Event Failed" });
  }
});

module.exports = router;
