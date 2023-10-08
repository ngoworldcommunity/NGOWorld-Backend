const express = require("express");
const router = express.Router();
const Event = require("../../schema/events/EventSchema");
const { STATUSCODE, STATUSMESSAGE } = require("../../utils/Status");

router.post("/create", async (req, res) => {
  try {
    const { slug, ...data } = req.body;
    const existingEvent = await Event.findOne({ slug });

    if (existingEvent) {
      return res
        .status(STATUSCODE.CONFLICT)
        .json({ message: STATUSMESSAGE.EVENT_SLUG_ALREADY_EXISTS });
    }

    const newEvent = await new Event({ ...data, slug });

    const savedEvent = await newEvent.save();
    return res.status(STATUSCODE.CREATED).json(savedEvent);
  } catch (error) {
    console.log(error);
    return res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .json({ message: STATUSMESSAGE.CREATE_EVENT_FAILED });
  }
});

module.exports = router;
