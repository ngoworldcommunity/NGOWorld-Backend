const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
const passport = require("passport");
const { StatusCodes, StatusMessages } = require("../../utils/StatusCodes");

//* Route 5  - google authentication
router.get("/google", (req, res) => {
  const googleAuthURL = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = new URLSearchParams({
    response_type: "code",
    redirect_uri: process.env.CALLBACK_URL,
    scope: "profile email ",
    client_id: process.env.CLIENT_ID,
  });

  const redirectURL = `${googleAuthURL}?${params}`;

  return res.status(StatusCodes.CREATED).json({ url: redirectURL });
});

//* Route 6  - google authentication callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "auth/login/failed",
  }),
  (req, res) => {
    res
      .cookie("OAuthLoginInitiated", true, {
        expires: new Date(new Date().getTime() + 5 * 60 * 1000),
        httpOnly: false,
        secure: true,
        sameSite: "none",
        domain: process.env.ORIGIN_DOMAIN,
      })
      .redirect(process.env.successURL);
  },
);

//* Route 7  - google authentication failed
router.get("/login/failed", (req, res) => {
  res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ error: true, message: StatusMessages.UNAUTHORIZED });
});

//* Route 8  - google authentication success
router.get("/login/success", (req, res) => {
  if (req.user) {
    const data = { User: { id: req.user.email } };
    const token = jwt.sign(data, process.env.JWT_SECRET);

    if (!req.user.usertype) {
      res.cookie("emptyProfile", true, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        domain: process.env.ORIGIN_DOMAIN,
      });
    }

    res
      .status(StatusCodes.CREATED)
      .cookie("OAuthLoginInitiated", false, {
        expires: new Date(0),
        httpOnly: false,
        secure: true,
        sameSite: "none",
        domain: process.env.ORIGIN_DOMAIN,
      })
      .cookie("Token", token, {
        sameSite: "none",
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        secure: true,
        domain: process.env.ORIGIN_DOMAIN,
      })
      .cookie("username", req.user.slug, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        domain: process.env.ORIGIN_DOMAIN,
      })
      .cookie("isLoggedIn", true, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: true,
        sameSite: "none",
        domain: process.env.ORIGIN_DOMAIN,
      })
      .json({
        message: StatusMessages.LOGIN_SUCCESS,
      });
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: true, message: StatusMessages.UNAUTHORIZED });
  }
});

//* Route 9  - google authentication logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: StatusMessages.INTERNAL_SERVER_ERROR });
    }

    res
      .cookie("Token", "", {
        expires: new Date(0),
        sameSite: "strict",
        httpOnly: true,
        domain: process.env.ORIGIN_DOMAIN,
        secure: true,
      })
      .status(StatusCodes.CREATED)
      .json({ message: StatusMessages.LOGOUT_SUCCESS });
  });
});

module.exports = router;
