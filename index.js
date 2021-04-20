const express = require("express");
const app = express();
const http = require("http").createServer(app);

const mongoose = require("mongoose");
const customerAPI = require("./api/customer");
const vendorAPI = require("./api/vendor");
const customerAuthAPI = require("./api/customer-auth");

app.use("/api/customer", customerAPI);
app.use("/api/vendor", vendorAPI);
app.use("/api/customer", customerAuthAPI);

app.use(express.urlencoded({ extended: true }));

// Setting templating engine
app.set("view-engine", "ejs");

// TODO: Change this to an official database
// Don't forget to add user to database to grant read and write access
mongoose.connect(
  "mongodb+srv://root:testtest@cluster0.iyw6v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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

const port = 4040;
http.listen(process.env.PORT || port, () => {
  console.log(`listening on port *:${port}`);
});
