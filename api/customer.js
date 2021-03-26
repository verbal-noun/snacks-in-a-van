const router = require('express').Router();

router.get('/', (req, res) => {
    console.log("Customer");
    res.send("Hello, customer!");
});

module.exports = router;