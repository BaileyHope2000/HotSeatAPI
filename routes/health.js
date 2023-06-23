const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get('/api/health', (req, res) => {
    //const connection = req.app.get('connection');
    res.status(200).json('Healthy');
});

module.exports = router;
