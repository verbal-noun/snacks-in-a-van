const express = require('express');
const app = express();
const http = require('http').createServer(app);

const mongoose = require('mongoose');
const customerAPI = require('./api/customer');
const vendorAPI = require('./api/vendor');

app.use('/api/customer', customerAPI);
app.use('/api/vendor', vendorAPI);

// TODO: Change this to an official database
mongoose.connect('mongodb+srv://cluster0.iyw6v.mongodb.net/myFirstDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if(err) {
        console.log(err);
    }
    else {
        console.log("Connected to db!");
    }
});

const port = 4040;
http.listen(port, () => {
    console.log(`listening on port *:${port}`);
});