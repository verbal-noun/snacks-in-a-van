const router = require('express').Router();
const schema = require('./schemas');

router.get('/', (req, res) => {
    console.log("Vendor");
    res.send("Hello, vendor!");
});

module.exports = router;