// All routes related to club's LOGIN AND REGISTER

const express = require("express");
const Club = require("../../schema/club/ClubSchema");
const User = require("../../schema/user/UserSchema");
const { STATUSCODE } = require("../../utils/Status");
const router = express.Router();

// Route 1  - Show all avaialble Users in the DB
router.get("/users", async (req, res) => {
  try {
    const allusers = await User.find({});
    res.status(STATUSCODE.OK).json(allusers);
  } catch (error) {
    res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
});

// * Route 2 - Show all available Clubs in the DB
router.get("/clubs", async (req, res) => {
  try {
    if (req.query.id) {
      const clubdetails = await Club.findById(req.query.id);
      return res.status(STATUSCODE.OK).json(clubdetails);
    }
    const allClubs = await Club.find({});
    res.json(allClubs);
  } catch (error) {
    res.status(STATUSCODE.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
