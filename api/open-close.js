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
        const button = document.getElementById('openBusinessButt' + {i});
        button.addEventListener('click', function(e) {
        console.log('button was clicked');
        vendors[i].open = True;

        fetch('/clicked', {method: 'POST'})
         .then(function(response) {
            if(response.ok) {
              console.log('Open for business click was recorded');
          
        
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
        const button = document.getElementById('closedBut' + {i});
        button.addEventListener('click', function(e) {
        console.log('Close button was clicked');
        vendors[i].open = False;
        fetch('/clicked', {method: 'POST'})
         .then(function(response) {
            if(response.ok) {
              console.log('click was recorded');
          
        
            return;
          }
          throw new Error('Request failed.');
       })
       .catch(function(error) {
          console.log(error);
        });
    });
