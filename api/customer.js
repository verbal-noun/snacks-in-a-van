// Check if we are in production or development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// App requirements
const express = require("express");
const router = express.Router();
const schema = require("./schemas");
const passport = require("passport");

// Dummy list to hold users
users = [
  {
    id: 1,
    name: "jack",
    token: "123456789",
    displayName: "Jack",
    emails: [{ value: "jack@example.com" }],
  },
  {
    id: 2,
    name: "jill",
    token: "abcdefghi",
    displayName: "Jill",
    emails: [{ value: "jill@example.com" }],
  },
];

// Load auth-token config
const initialisePassportBearer = require("../config/passport-token-config");

initialisePassportBearer(passport, (token) =>
  // TODO: Finds the user based on token from the database
  users.find((user) => user.token === token)
);
// Middleware
router.use(express.urlencoded({ extended: true }));

// --------------------------------------------------------------------- AUTH TOKEN TEST ---------------------------------------------------------------------//

router.get(
  "/authTokenTest",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    res.json({ name: req.user.name, email: req.user.emails[0].value });
  }
);

// --------------------------------------------------------------------- TRUCK LOCATION ---------------------------------------------------------------------//
// Get Request to show the nearby 5 trucks to the customer
router.get("/nearby/:longitude,:latitude", (req, res) => {
  var query = schema.Vendor.find();
  query.exec((err, vendors) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      for (let i = 0; i < vendors.length; i++) {
        vendors[i] = vendors[i].toJSON();
        vendors[i].distance = coordDistance(vendors[i].position, req.params);
      }
      vendors.sort((a, b) => {
        return a.distance - b.distance;
      });

      let nearby = [];
      for (let i = 0; i < 5 && i < vendors.length; i++) {
        nearby.push(vendors[i]);
      }
      res.send(nearby);
    }
  });
});

// -------------------------------------------------------------------  MENU -----------------------------------------------------------------------//
// Get the menu displayed to the customer
router.get("/menu", (req, res) => {
  var query = schema.Item.find();
  query.exec((err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(items);
    }
  });
});

router.get("/menu/:itemID", (req, res) => {
  var query = schema.Item.findById(req.params.itemID);
  query.exec((err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(items);
    }
  });
});

// ------------------------------------------------------------------ ORDERING --------------------------------------------------------------------//

router.post(
  "/order",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    // req.body must contain two fields: "orderItems" & "vendor"
    // "orderItems" - List of item IDs and quantities (e.g., [{item: "123iasoi", quantity: 3}, {item: "abc123", quantity: 1}])
    // "vendor" - Which vendor is this order directed to
    // TODO: Needs to keep track of author (user who posted order)
    schema.OrderItem.insertMany(req.body.orderItems)
      .then((orderItems) => {
        console.log("Order items successfully processed!");
        console.log(orderItems);
        console.log("Generating order...");
        schema.Order.insertMany([
          {
            vendor: req.body.vendor,
            createdAt: new Date(),
            modifiedAt: new Date(),
            items: orderItems,
            discounted: false,
          },
        ])
          .then((order) => {
            console.log("Order successfully processed!");
            console.log(order);
            res.send("Order successfully processed!");
          })
          .catch((err) => {
            res.send(err);
          });
      })
      .catch((err) => {
        res.send(err);
      });
  }
);

module.exports = router;
