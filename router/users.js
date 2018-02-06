const express = require('express');
const { getUser, getAllUsers } = require('../controllers/usersControllers');
const router = express.Router();
const bodyParser = require('body-parser');

router.route('/')
  .get(getAllUsers);
router.route('/:username')
  .get(getUser);




module.exports = router;

