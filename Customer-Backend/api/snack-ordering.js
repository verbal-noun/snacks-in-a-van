// Check if we are in production or development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// App requirements
const express = require("express");
const router = express.Router();
const schema = require("../../config/schemas");
const passport = require("passport");

// Load auth-token config
const initialisePassportBearer = require("../passport/token-config");

// Initialise the passport with appropirate strategy and callback functions
initialisePassportBearer(
  passport,
  async (authToken) =>
    await schema.Customer.findOne({ token: authToken }).exec()
);

/**
 * Function to calculate the postion between the customer and truck
 * @param {double} a: customer's position
 * @param {double} b: the truck's position
 * @returns
 */
function coordDistance(a, b) {
  let degLen = 110.25;
  let x = a.latitude - b.latitude;
  let y = Math.cos(b.latitude) * (a.longitude - b.longitude);
  return degLen * Math.sqrt(x * x + y * y);
}

// --------------------------------------------------------------------- TRUCK LOCATION ---------------------------------------------------------------------//
// GET Request to show the nearby 5 trucks to the customer
router.get("/nearby/:longitude,:latitude", (req, res) => {
  var query = schema.Vendor.find({open: true});
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

// GET Request for fetching the information of a specific vendor
router.get("/vendor/:vendorID", (req, res) => {
  var query = schema.Vendor.findById(req.params.vendorID);
  query.exec((err, vendor) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    } else {
      if (vendor) {
        let obj = vendor.toJSON();
        delete obj.password;
        delete obj.token;
        res.send(obj);
      } else {
        res.status(500).send(`No vendor exists with id ${req.params.vendorID}`);
      }
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
// GET request for listing all active orders
router.get(
  "/fetchOrders",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    schema.Order.find({ author: req.user.id })
      .then((orders) => {
        res.send(orders);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send(err.message);
      });
  }
);

// GET request for fetching an order by ID
router.get(
  "/fetchOrders/:orderID",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    schema.Order.find({ author: req.user.id, _id: req.params.orderID })
      .then((order) => {
        console.log(order);
        res.send(order);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send(err.message);
      });
  }
);

// POST request for submitting an order
router.post(
  "/order",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    // req.body.orderItems - List of item IDs and quantities (e.g., [{item: "123iasoi", quantity: 3}])
    // req.body.vendor - Which vendor is this order directed to
    schema.OrderItem.insertMany(req.body.orderItems)
      .then((orderItems) => {
        // Create and insert an order item to teh database
        schema.Order.insertMany([
          {
            vendor: req.body.vendor,
            author: req.user.id,
            authorName: req.user.name,
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

// PUT request for changing an order
router.put(
  "/changeOrder",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    // req.body.orderID - ID of order user wants to change
    // req.body.orderItems - List of item IDs and quantities (e.g., [{item: "123iasoi", quantity: 3}])
    let now = new Date().getTime();
    schema.Order.findOne({ _id: req.body.orderID, author: req.user.id })
      .then((order) => {
        let minutesElapsed = (now - order.modifiedAt.getTime()) / 60000;
        // Find the time limit within which the customer can change the order
        schema.Globals.findOne({ name: "orderChangeLimit" }).then(
          (variable) => {
            if (minutesElapsed > variable.value) {
              res.status(500).send("Time limit expired, cannot change order.");
            } else {
              schema.OrderItem.insertMany(req.body.orderItems)
                .then((orderItems) => {
                  schema.Order.findByIdAndUpdate(req.body.orderID, {
                    items: orderItems,
                  })
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
          }
        );
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send(err.message);
      });
  }
);

// DELETE request for cancelling an order (set status to Cancelled)
router.post(
  "/cancelOrder",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    // req.body.orderID contains the id of the order to be cancelled
    let now = new Date().getTime();
    schema.Order.findOne({ _id: req.body.orderID, author: req.user.id })
      .then((item) => {
        let minutesElapsed = (now - item.modifiedAt.getTime()) / 60000;
        // Find the time limit within which the customer can change the order
        schema.Globals.findOne({ name: "orderChangeLimit" })
          .then((item) => {
            // Only allowed within schema.Globals.orderChangeLimit minutes of ordering
            if (minutesElapsed > item.value) {
              res.status(500).send("Time limit expired, cannot cancel order.");
            } else {
              schema.Order.findOneAndUpdate(
                { _id: req.body.orderID, author: req.user.id },
                { status: "Cancelled" }
              )
                .then((item) => {
                  res.send(item);
                })
                .catch((err) => {
                  console.log(err.message);
                  res.status(500).send(err.message);
                });
            }
          })
          .catch((err) => {
            console.log(err.message);
            res.status(500).send(err.message);
          });
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send(err.message);
      });
  }
);

// ----------------------------------------------------------------------------- RATING --------------------------------------------------------------------//
// POST request for submitting a rating for an order
router.post(
  "/rate",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    // req.body.orderID contains the id of the order to be rated
    // req.body.rating contains the actual rating {value, comment}
    schema.Order.findOne({ _id: req.body.orderID, author: req.user.id })
      .then(() => {
        schema.Rating.create(req.body.rating).then((rate) => {
          console.log(rate);
          schema.Order.findOneAndUpdate(
            { _id: req.body.orderID, author: req.user.id },
            { rating: rate._id }
          )
            .then((order) => {
              res.send(order);
            })
            .catch((err) => {
              console.log(err.message);
              res.status(500).send(err.message);
            });
        });
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send(err.message);
      });
  }
);

router.get(
  "/globals",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    schema.Globals.find()
      .then((globals) => {
        res.send(globals);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send(err.message);
      });
  }
);

// Returning the router
module.exports = router;
