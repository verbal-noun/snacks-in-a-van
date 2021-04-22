// Check if we are in production or development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// App requirements
const express = require("express");
const router = express.Router();
const schema = require("../config/schemas");
const passport = require("passport");

// Load auth-token config
const initialisePassportBearer = require("../config/passport-token-config");

initialisePassportBearer(
  passport,
  async (authToken) =>
    await schema.Customer.findOne({ "token.value": authToken }).exec()
);

// --------------------------------------------------------------------- TRUCK LOCATION ---------------------------------------------------------------------//
// GET Request to show the nearby 5 trucks to the customer
router.get("/nearby/:longitude,:latitude", (req, res) => {
  var query = schema.Vendor.find();
  query.exec((err, vendors) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
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
// GET request for fetching the menu displayed to the customer
router.get("/menu", (req, res) => {
  var query = schema.Item.find();
  query.exec((err, items) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    } else {
      res.send(items);
    }
  });
});

// GET request for fetching an item's information
router.get("/menu/:itemID", (req, res) => {
  var query = schema.Item.findById(req.params.itemID);
  query.exec((err, items) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    } else {
      res.send(items);
    }
  });
});

// ------------------------------------------------------------------ ORDERING --------------------------------------------------------------------//
// POST request for submitting an order
router.post(
  "/order",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    // req.body.orderItems - List of item IDs and quantities (e.g., [{item: "123iasoi", quantity: 3}])
    // req.body.vendor - Which vendor is this order directed to
    schema.OrderItem.insertMany(req.body.orderItems)
      .then((orderItems) => {
        schema.Order.insertMany([
          {
            vendor: req.body.vendor,
            author: req.user.id,
            createdAt: new Date(),
            modifiedAt: new Date(),
            items: orderItems,
            discounted: false,
          },
        ])
          .then((order) => {
            res.send(order);
          })
          .catch((err) => {
            res.status(500).send(err.message);
          });
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  }
);

module.exports = router;
