const express = require('express');
const router = express.Router();

const { changeNumOfVotes, deleteComment } = require('../controllers/commentsControllers');


router.route('/:comment_id?')
  .put(changeNumOfVotes)
  .delete(deleteComment);

module.exports = router;