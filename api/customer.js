// Check if we are in production or development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// App requirements
const express = require("express");
const router = express.Router();
const schema = require("./schemas");

router.use(express.urlencoded({ extended: true }));

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
router.post("/order", (req, res) => {
  // req.body must contain two fields: "orderItems" & "vendor"
  // "orderItems" - List of item IDs and quantities (e.g., [{item: "123iasoi", quantity: 3}, {item: "abc123", quantity: 1}])
  // "vendor" - Which vendor is this order directed to
  // TODO: Needs to keep track of author (user who posted order)
  schema.OrderItem.insertMany(req.body.orderItems).then((orderItems) => {
    console.log("Order items successfully processed!");
    console.log(orderItems);
    console.log("Generating order...");
    schema.Order.insertMany([{
      vendor: req.body.vendor,
      createdAt: new Date(),
      modifiedAt: new Date(),
      items: orderItems,
      discounted: false
    }]).then((order) => {
      console.log("Order successfully processed!");
      console.log(order);
      res.send("Order successfully processed!");
    }).catch((err) => {
      res.send(err.message);
    });
  }).catch((err) => {
    res.send(err.message);
  });
});

module.exports = router;
