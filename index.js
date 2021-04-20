const express = require("express");
const app = express();
const http = require("http").createServer(app);

const mongoose = require("mongoose");
const customerAPI = require("./api/customer");
const vendorAPI = require("./api/vendor");
const customerAuthAPI = require("./api/customer-auth");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/customer", customerAPI);
app.use("/api/vendor", vendorAPI);
app.use("/api/customer", customerAuthAPI);

// Setting templating engine
app.set("view-engine", "ejs");

// TODO: Change this to an official database
// Don't forget to add user to database to grant read and write access
mongoose.connect(
  process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to db!");
    }
  }
);

// ------------------------------------------------------------- INSERT TEST DATA --------------------------------------------------------------
const schema = require("./api/schemas");
app.get("/api/insertTestData", (req, res) => {
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

  schema.Vendor.deleteMany({}).then(() => {
    console.log("Deleted all Vendors! Inserting new data...");
    schema.Vendor.insertMany([
      {
        name: "First Vendor",
        open: true,
        address: "123 PooPoo street",
        position: {
          longitude: 144.9586607,
          latitude: -37.8015618,
        },
      },
      {
        name: "Another Vendor",
        open: true,
        address: "69 PeePee street",
        position: {
          longitude: 699.9586607,
          latitude: -100.8015618,
        },
      },
    ]).then(() => {
      console.log("Done!");
    });
  });
  res.send("Inserted new items to database.");
});


const port = 4040;
http.listen(process.env.PORT || port, () => {
    console.log(`listening on port *:${port}`);
});
