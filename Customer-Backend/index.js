const express = require("express");
const app = express();
const http = require("http").createServer(app);

const mongoose = require("mongoose");
const customerAPI = require("./api/routes/customer");
const customerAuthAPI = require("./api/routes/customer-auth");

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

// Middleware
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

app.use("/api/customer", customerAPI);
app.use("/api/customer", customerAuthAPI);

// Setting templating engine
app.set("view-engine", "ejs");

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

const port = 4040;
http.listen(process.env.PORT || port, () => {
  console.log(`listening on port *:${port}`);
});
