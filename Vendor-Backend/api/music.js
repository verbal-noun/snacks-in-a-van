// Check if we are in production or development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const schema = require("../../config/schemas");

// --------------------------------------------------------------- STATUS -----------------------------------------------------
// POST request for opening for business
router.get(
  "/all",
  (req, res) => {
    var query = schema.Music.find({});
    query.exec((err, music) => {
      if (err) {
        console.log(err.message);
        res.status(500).send(err.message);
      } else {
        res.send(music);
      }
    });
  }
);