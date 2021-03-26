const router = require('express').Router();
const schema = require('./schemas');

router.get('/', (req, res) => {
    console.log("Customer");
    res.send("Hello, customer!");
});

module.exports = router;