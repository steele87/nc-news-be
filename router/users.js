const express = require('express');
const { getUser, getAllUsers } = require('../controllers/usersControllers');
const router = express.Router();

router.route('/')
  .get(getAllUsers);
router.route('/:username')
  .get(getUser);




module.exports = router;

