var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("HELLO WORLD!")
  
  data = {
    text: "HELLO WORLD!"
  }

  res.json(data)

});

module.exports = router;
