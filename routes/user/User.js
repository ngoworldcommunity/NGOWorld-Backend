//* All routes related to user's LOGIN AND REGISTER

const express = require("express");
const User = require("../../schema/user/UserSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const ReportProblem = require("../../schema/user/ReportProblemSchema");
const { StatusCodes, StatusMessages } = require("../../utils/StatusCodes");

//* Route 1  - User Registration
router.post("/register", async (req, res) => {
  try {
    const { email, ...data } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: StatusMessages.USER_ALREADY_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new User({
      ...data,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: StatusMessages.SIGNUP_SUCCESS });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
});

//* Route 1a - User Update
router.post("/update", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // User Exists in the database
    const validPassword = await bcrypt.compare(
      oldPassword,
      existingUser.password,
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    // Old Password Mathched
    if (newPassword.length < 5) {
      return res
        .status(406)
        .json({ message: "Password Length must be greater than 5 characters" });
    }
    // Correct Password Length

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    // New Password Hashed

    // Updated User
    const UserData = {
      firstname: existingUser.firstname,
      lastname: existingUser.lastname,
      email: email,
      password: newHashedPassword,
      address: existingUser.address,
      pincode: existingUser.pincode,
    };

    await User.replaceOne({ email: email }, UserData);
    res.status(201).json({ message: "Password Updated Successfully" });
  } catch (error) {
    // User Password Updated
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const payload = { User: { id: existingUser.email } };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res
      .status(201)
      .cookie("Token", token, {
        sameSite: "none",
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        secure: true,
      })
      .cookie("isLoggedIn", true, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: true,
        sameSite: "none",
        domain: process.env.ORIGIN_DOMAIN,
      })
      .json({ token, message: "Logged you in !" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
});

//* Route 3  - Report a Problem
router.post("/report", async (req, res) => {
  try {
    const currentHour = new Date().getMinutes();
    const previousReports = await ReportProblem.find({
      email: req.body.email,
    }).exec();

    for (let i = 0; i < previousReports.length; i++) {
      let hourOfThisReport = new Date(
        previousReports[i].createdAt,
      ).getMinutes();

      if (hourOfThisReport >= currentHour - 120) {
        return res.status(429).json({
          success: false,
          message: "You have already reported a problem in the last 2 hours.",
        });
      }
    }

    const data = req.body;

    const ReportData = ReportProblem({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      reportmessage: data.reportmessage,
    });

    await ReportData.save();
    res.status(200).json({ success: true });
  } catch (e) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

module.exports = router;
