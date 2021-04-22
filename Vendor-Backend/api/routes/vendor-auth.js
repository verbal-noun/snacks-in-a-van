if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// App dependencies
const express = require("express");
const router = express.Router();
const schema = require("../config/schemas");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jwt-simple");

// Salt required for hasing customer's password
const saltRounds = 10;

// Load the passport.js config from the setup
const initializePassport = require("../config/passport-local-config");

// Initialise a session with the User's email and ID
initializePassport(
  passport,
  async (email) => await schema.Customer.findOne({ email }).exec(),
  async (id) => await schema.Customer.findById(id).exec()
);

// Function which restricts unauthenticated users
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/vendor/login");
}

// Function which restricts authenticated users from accessing login and rego page
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/api/vendor/home");
  }
  next();
}

// GET request for home page
router.get("/home", checkAuthenticated, (req, res) => {
  res.render("home.ejs", {
    name: req.user.name.given + " " + req.user.name.family,
  });
});

// GET request for login page
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("customer-login.ejs");
});

// POST request for login
router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true }),
  (req, res) => {
    // Generate JWT Token using unique email, password, and timestamp and store it
    const jwtToken = jwt.encode(
      {
        email: req.body.email,
        password: req.body.password,
        timestamp: new Date(),
      },
      process.env.JWT_SECRET
    );
    let query = schema.Vendor.findOneAndUpdate(
      { email: req.body.email },
      { token: jwtToken }
    );
    query.exec((err, doc) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        res.redirect("/api/vendor/home");
      }
    });
  }
);

// GET request for register page
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("customer-register.ejs");
});

// POST request for register
router.post("/register", checkNotAuthenticated, (req, res) => {
  var query = schema.Customer.find({ email: req.body.email });
  query.exec((err, customers) => {
    // Ensure user does not exist yet
    if (err || customers.length) {
      res.redirect("/api/vendor/register");
    } else {
      // Generate a password hash based on user's inserted password
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
          console.log(err);
          res.redirect("/api/vendor/register");
        } else {
          // Put the user and password in our database
          schema.Customer.insertMany([
            {
              email: req.body.email,
              name: {
                given: req.body.givenname,
                family: req.body.familyname,
              },
              password: hash,
            },
          ])
            .then((doc) => {
              // Redirect user back to login if successful
              res.redirect("/api/vendor/login");
            })
            .catch((err) => {
              console.log(err.message);
              res.status(500).send(err.message);
              res.redirect("/api/vendor/register");
            });
        }
      });
    }
  });
});

// Route for logging out
router.delete("/logout", (req, res) => {
  // Using passport to logout
  req.logOut();
  res.redirect("/api/vendor/login");
});

module.exports = router;
