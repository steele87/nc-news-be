const express = require('express');
const getUser= require('../controllers/usersControllers');
const router = express.Router();
const bodyParser = require('body-parser');

router.route('/:username')
  .get(getUser);



  
module.exports = router;

