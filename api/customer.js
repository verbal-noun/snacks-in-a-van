const router = require("express").Router();
const schema = require("./schemas");

function coordDistance(a, b) {
  dlat = a.latitude - b.latitude;
  dlong = a.longitude - b.longitude;
  return Math.sqrt(dlat * dlat + dlong * dlong);
}

// Routes for Authentication

// GET request for login
router.get("/login", (req, res) => {
  res.render("customer-login.ejs");
});

// GET request for register
router.get("/register", (req, res) => {
  res.render("customer-register.ejs");
});

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

// GET request to insert data into the menu
router.get("/insertTestData", (req, res) => {
  schema.Item.deleteMany({}).then(() => {
    console.log("Deleted all Items! Inserting new data...");
    schema.Item.insertMany([
      {
        name: "Pizza",
        unitPrice: 12,
        photoURL:
          "https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg",
      },
      {
        name: "Coffee",
        unitPrice: 3,
        photoURL:
          "https://tul.imgix.net/content/article/a_list_images/best%20coffee%20in%20melbourne%204.jpg?auto=format,compress&w=1200&h=630&fit=crop",
      },
    ]).then(() => {
      console.log("Done!");
    });
  });
  //   schema.Vendor.deleteMany({}).then(() => {
  //     console.log("Deleted all Vendors! Inserting new data...");
  //     schema.Vendor.insertMany([
  //       {
  //         name: "First Vendor",
  //         open: true,
  //         address: "123 PooPoo street",
  //         position: {
  //           longitude: 144.9586607,
  //           latitude: -37.8015618,
  //         },
  //       },
  //       {
  //         name: "First Vendor",
  //         open: true,
  //         address: "123 PooPoo street",
  //         position: {
  //           longitude: 699.9586607,
  //           latitude: -100.8015618,
  //         },
  //       },
  //     ]).then(() => {
  //       console.log("Done!");
  //     });
  //   });
  res.send("Inserted new items to database.");
});

module.exports = router;
