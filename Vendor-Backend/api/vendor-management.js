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
// GET request for fetching unfulfilled and ready orders
router.get(
  "/orders",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Order.find({
      $or: [
        { vendor: vendorID, status: "Preparing" },
        { vendor: vendorID, status: "Ready for pickup" },
      ],
    });
    query.exec(async (err, orders) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        try {
          for (let i = 0; i < orders.length; i++) {
            orders[i] = orders[i].toJSON();
            let customer = await schema.Customer.findById(
              orders[i].author
            ).exec();
            orders[i].customer = {
              name: customer.name,
              email: customer.email,
            };
          }
          res.send(orders);
        } catch (e) {
          res.send(e);
        }
      }
    });
  }
);

// GET request for fetching all orders
router.get(
  "/allOrders",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Order.find({ vendor: vendorID });
    query.exec(async (err, orders) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        try {
          for (let i = 0; i < orders.length; i++) {
            orders[i] = orders[i].toJSON();
            let customer = await schema.Customer.findById(
              orders[i].author
            ).exec();
            orders[i].customer = {
              name: customer.name,
              email: customer.email,
            };
          }
          res.send(orders);
        } catch (e) {
          res.send(e);
        }
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
    query.exec(async (err, order) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        try {
          order = order.toJSON();
          let customer = await schema.Customer.findById(order.author).exec();
          order.customer = {
            name: customer.name,
            email: customer.email,
          };

          // Check if any discount needs to be applied
          if (order.discounted == false) {
            // Check if time limit has been passed or not
            let now = new Date().getTime();
            let minutesElaspsed = (now - order.modifiedAt.getTime()) / 60000;

            // Find the time limit after which discount will be applied'
            schema.Globals.findOne({ name: "discountLimit" })
              .then((variable) => {
                // Elapsed time is greater than limit
                if (minutesElaspsed > variable.value) {
                  // Update the order total price with the discount
                  let discountAmount =
                    order.totalPrice * (variable.amount / 100);

                  let newTotal = order.totalPrice - discountAmount;
                  // Update the information in the database
                  order.totalPrice = newTotal;
                  order.discounted = true;

                  console.log(order);
                  res.send(order);
                }
              })
              .catch((err) => {
                res.send(e);
              });
          } else {
            console.log("Line 223");
            console.log(order);
            res.send(order);
          }
        } catch (e) {
          console.log(`Line 222`);
          res.send(e);
        }
      }
    });
  }
);

// GET request for fetching a customer's details
router.get(
  "/customer/:customerID",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    var query = schema.Customer.findById(req.params.customerID);
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
        // Send back the vendor object
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
        // Send back the vendor object
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

// GET request for all data of logged in vendor for personalised vendor dashboard
router.get(
  "/vendorData",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Vendor.findById(vendorID);
    query.exec((err, vendorData) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        res.send(vendorData);
      }
    });
  }
);

module.exports = router;
