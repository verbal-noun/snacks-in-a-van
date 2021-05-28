// Check if we are in production or development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const schema = require("../../config/schemas");
const passport = require("passport");

// Load auth-token config
const initialisePassportBearer = require("../passport/token-config");
initialisePassportBearer(
  passport,
  async (authToken) => await schema.Vendor.findOne({ token: authToken }).exec()
);

// --------------------------------------------------------------- STATUS -----------------------------------------------------
// POST request for opening for business
router.post(
  "/open",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Vendor.findByIdAndUpdate(vendorID, {
      open: true,
      address: req.body.address,
      position: req.body.location,
    });
    query.exec((err) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        //res.send(updated);
        var newQuery = schema.Vendor.findById(vendorID);
        newQuery.exec((err, vendor) => {
          if (err) {
            console.log(err.message);
            res.status(500).send(err.message);
          } else {
            res.send(vendor);
          }
        });
      }
    });
  }
);

// POST request for closing shop
router.post(
  "/close",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Vendor.findByIdAndUpdate(vendorID, {
      open: false,
      address: null,
      position: {},
    });
    query.exec((err) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        //res.send(updated);
        var newQuery = schema.Vendor.findById(vendorID);
        newQuery.exec((err, vendor) => {
          if (err) {
            console.log(err.message);
            res.status(500).send(err.message);
          } else {
            res.send(vendor);
          }
        });
      }
    });
  }
);

// POST request for relocating van to new location
router.post(
  "/relocate",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Vendor.findByIdAndUpdate(vendorID, {
      address: req.body.address,
      position: req.body.location,
    });
    query.exec((err) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        //res.send(updated);
        var newQuery = schema.Vendor.findById(vendorID);
        newQuery.exec((err, vendor) => {
          if (err) {
            console.log(err.message);
            res.status(500).send(err.message);
          } else {
            res.send(vendor);
          }
        });
      }
    });
  }
);

// --------------------------------------------------------------- ORDERS -----------------------------------------------------
// GET request for fetching unfulfilled orders
router.get(
  "/orders",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Order.find({ vendor: vendorID, status: "Preparing" });
    query.exec((err, orders) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        res.send(orders);
      }
    });
  }
);

// GET request for fetching order details
router.get(
  "/order/:orderID",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    var query = schema.Order.findById(req.params.orderID);
    query.exec((err, orders) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        res.send(orders);
      }
    });
  }
);

// POST request for fulfilling an order
router.post(
  "/fulfillOrder",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    var query = schema.Order.findByIdAndUpdate(req.body.order, {
      status: "Ready for pickup",
    });
    query.exec((err) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        //res.send(updated);
        var newQuery = schema.Order.findById(req.body.order);
        newQuery.exec((err, order) => {
          if (err) {
            console.log(err.message);
            res.status(500).send(err.message);
          } else {
            res.send(order);
          }
        });
      }
    });
  }
);

// POST request to make an order is picked up
router.post(
  "/orderPickup",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    var query = schema.Order.findByIdAndUpdate(req.body.order, {
      status: "Done",
    });
    query.exec((err) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        //res.send(updated);
        var newQuery = schema.Order.findById(req.body.order);
        newQuery.exec((err, order) => {
          if (err) {
            console.log(err.message);
            res.status(500).send(err.message);
          } else {
            res.send(order);
          }
        });
      }
    });
  }
);

module.exports = router;
