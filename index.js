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
        name: "Cappuccino",
        unitPrice: 5,
        photoURL: "https://images.unsplash.com/photo-1472973681244-f5bcc808ad47?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1953&q=80",
      },
      {
        name: "Latte",
        unitPrice: 5,
        photoURL: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      },
      {
        name: "Flat White",
        unitPrice: 5,
        photoURL: "https://images.unsplash.com/photo-1536974649822-bd356544c980?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
      },
      {
        name: "Long Black",
        unitPrice: 5,
        photoURL: "https://images.unsplash.com/photo-1517789439268-317443633a0b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      },
      {
        name: "Plain Biscuit",
        unitPrice: 1,
        photoURL: "https://images.unsplash.com/photo-1601318907950-778691dabde7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80"
      },
      {
        name: "Fancy Biscuit",
        unitPrice: 2,
        photoURL: "https://images.unsplash.com/photo-1588195540875-63c2be0f60ae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=815&q=80"
      },
      {
        name: "Small Cake",
        unitPrice: 15,
        photoURL: "https://images.unsplash.com/photo-1562440499-64c9a111f713?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1868&q=80"
      },
      {
        name: "Big Cake",
        unitPrice: 25,
        photoURL: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=980&q=80"
      },
    ]).then(() => {
      console.log("Done!");
    });
  });

  schema.Vendor.deleteMany({}).then(() => {
    console.log("Deleted all Vendors! Inserting new data...");
    schema.Vendor.insertMany([
      {
        name: "Vendor 1",
        open: true,
        address: "206 Berkley Street, Carlton VIC 3053",
        position: {
          longitude: 144.9586607,
          latitude: -37.8015618
        },
      },
      {
        name: "Vendor 2",
        open: false,
        address: "173 Wilson Ave, Parkville VIC 3052",
        position: {
          longitude: 144.9607354,
          latitude: -37.799817
        },
      },
      {
        name: "Vendor 3",
        open: false,
        address: "260 La Trobe Street, Melbourne VIC 3000",
        position: {
          longitude: 144.9612872,
          latitude: -37.8103644
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
