if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// App dependencies
const express = require("express");
const router = express.Router();
const schema = require("./schemas");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const jwt = require("jwt-simple");

// Salt required for hasing customer's password
const saltRounds = 10;

// Load the passport.js config from the setup
const initializePassport = require("../config/passport-local-config");

// Initialise a session with the User's email and ID
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

// Middleware
router.use(express.urlencoded({ extended: true }));
router.use(flash());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride("_method"));

// Middleware - helper function
// Function which restricts unauthenticated users
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/api/customer/login");
}

// Function which restricts authenticated users from
// Accessing login and rego page
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/api/customer/home");
  }
  next();
}

// Dummy list to hold users
const users = [];

// Route for successful login
router.get("/home", checkAuthenticated, (req, res) => {
  //res.render("home.ejs", { name: req.user.name });
  res.render("home.ejs");
  console.log(users);
});

// GET request for login
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("customer-login.ejs");
});

// Post request for login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/customer/home",
    failureRedirect: "/api/customer/login",
    // Shows error messages
    failureFlash: true,
  })
);

// GET request for register
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("customer-register.ejs");
});

// Post request for register
router.post("/register", checkNotAuthenticated, (req, res) => {
  // TODO: Get acutal the customer document from our database
  var query = schema.Customer.find();

  // Using dummy user data to show the login
  // Generate a password hash based on user's inserted password
  try {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      // Generate JWT Token
      const jwtToken = jwt.encode(req.body.password, process.env.JWT_SECRET);
      // Put the user and password in our database
      users.push({
        // This would be automatically generated in our database
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hash,
        token: jwtToken,
      });
    });

    // Redirect user back to login if successful
    res.redirect("/api/customer/login");
  } catch (error) {
    // If registering in unsuccessuful, redirect them back to registration page
    res.redirect("/api/customer/register");
  }
  console.log(users);
});

// Route for logging out
router.delete("/logout", (req, res) => {
  // Using passport to logout
  req.logOut();
  res.redirect("/api/customer/login");
});

module.exports = router;
