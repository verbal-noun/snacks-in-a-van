// Check if we are in production or development
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const schema = require("./schemas");

// --------------------------------------------------------------- STATUS -----------------------------------------------------
// POST request for opening for business
router.post("/open", (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Vendor.findByIdAndUpdate(vendorID, {
        open: true, 
        address: req.body.address, 
        position: req.body.location
    });
    query.exec((err, updated) => {
        if(err) {
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            res.send(updated);
        }
    });
});

// POST request for closing shop
router.post("/close", (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Vendor.findByIdAndUpdate(vendorID, {open: false});
    query.exec((err, updated) => {
        if(err) {
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            res.send(updated);
        }
    });
});

// POST request for relocating van to new location
router.post("/relocate", (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Vendor.findByIdAndUpdate(vendorID, {
        address: req.body.address,
        position: req.body.location
    });
    query.exec((err, updated) => {
        if(err) {
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            res.send(updated);
        }
    });
});

// --------------------------------------------------------------- ORDERS -----------------------------------------------------
// GET request for fetching unfulfilled orders
router.get("/orders", (req, res) => {
    let vendorID = req.user.id;
    var query = schema.Order.find({vendor: vendorID, status: "Preparing"});
    query.exec((err, orders) => {
        if(err) {
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            res.send(orders);
        }
    });
});

// GET request for fetching order details
router.get("/order/:orderID", (req, res) => {
    var query = schema.Order.findById(req.params.orderID);
    query.exec((err, orders) => {
        if(err) {
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            res.send(orders);
        }
    });
});

// POST request for fulfilling an order
router.post("/fulfillOrder", (req, res) => {
    var query = schema.Order.findById(req.body.order, {status: "Ready for pickup"});
    query.exec((err, updated) => {
        if(err) {
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            res.send(updated);
        }
    });
});

module.exports = router;