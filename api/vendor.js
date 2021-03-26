const router = require('express').Router();

router.get('/', (req, res) => {
    console.log("Vendor");
    res.send("Hello, vendor!");
});

module.exports = router;