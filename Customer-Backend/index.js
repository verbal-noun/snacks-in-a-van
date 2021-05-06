const express = require("express");
const app = express();
const http = require("http").createServer(app);

const mongoose = require("mongoose");
const customerAPI = require("./api/customer");
const customerAuthAPI = require("./api/customer-auth");

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

// Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://info30005-customer-frontend.herokuapp.com/");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
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
