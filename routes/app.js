//npm install --save mongoose
//npm install --save mongoose-unique-validator
var express = require('express');
var router = express.Router();
var User = require('../models/user');

/**
 * Renders the angular application
 */

router.get('/', function (req, res, next) {
    res.render('index');
});



module.exports = router;
