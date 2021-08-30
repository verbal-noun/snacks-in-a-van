const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");

const mongoose = require("mongoose");
const vendorAPI = require("./api/vendor-management");
const vendorAuthAPI = require("./api/vendor-auth");
const musicListAPI = require("./api/music");

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use("/api/vendor", vendorAPI);
app.use("/api/vendor", vendorAuthAPI);
app.use("/api/music", musicListAPI);

// Setting templating engine
app.set("view-engine", "ejs");
// Connect with the database
mongoose.connect(
  process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to db!");
    }
  }
);
// Setting up the server listening
const port = 9090;
http.listen(process.env.PORT || port, () => {
  console.log(`listening on port *:${port}`);
});

module.exports = app;
