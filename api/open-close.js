// Check if we are in production or development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// App requirements
const express = require("express");
const router = express.Router();
const schema = require("./schemas");

router.use(express.urlencoded({ extended: true }));

//---------// Open for business button //-----------//
router.get("/dashboard/trucks/", (req, res) => {
  var query = schema.Vendor.find();
  query.exec((err, vendors) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      for (let i = 0; i < vendors.length; i++) {
        vendors[i] = vendors[i].toJSON();

        route.post('/dashboard/trucks/', function(open){
          vendors[i].open = True;
          return open;
        });

          
        
            return;
          }
          throw new Error('Request failed.');
       })
       .catch(function(error) {
          console.log(error);
        });
    });
        
 // ---------// Closed button //----------- //      

router.get("/dashboard/trucks/", (req, res) => {
  var query = schema.Vendor.find();
  query.exec((err, vendors) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      for (let i = 0; i < vendors.length; i++) {
        vendors[i] = vendors[i].toJSON();
        route.post('/dashboard/trucks/', function(close){
          vendors[i].open = False;
          return close;
        });
          throw new Error('Request failed.');
       })
       .catch(function(error) {
          console.log(error);
        });
    });
