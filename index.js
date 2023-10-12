const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/passport-googleAuth-strategy");
const { swaggerServe, swaggerSetup } = require("./config/swagger");

const path = require("path");

let port = process.env.PORT || 5000;
const app = express();
dotenv.config();
connectToMongo();

app.use(
  cors({
    origin: (origin, callback) => {
      if (process.env.IGNORE_ORIGINS) {
        callback(null, true);
      } else {
        callback(null, process.env.ORIGIN_URL);
      }
    },
    credentials: true,
    allowedHeaders: ["Set-Cookie", "Content-Type"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    name: "ssid",

    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api-docs", swaggerServe, swaggerSetup);

app.use(
  "/docs",
  express.static("node_modules/swagger-ui-dist/", { index: false }),
  swaggerServe,
  swaggerSetup,
);

app.get("/", (req, res) => {
  res.send("HELLO FROM HOME");
});

app.use("/individual", require("./routes/user/User"));
app.use("/auth", require("./routes/user/Auth"));
app.use("/clubs", require("./routes/club/Club"));
app.use("/display", require("./routes/display/Display"));
app.use("/payment", require("./routes/payment/Payment"));
app.use("/product", require("./routes/shop/Products"));

app.listen(port, () => console.log("API IS RUNNING 🚀 at port:", port));
