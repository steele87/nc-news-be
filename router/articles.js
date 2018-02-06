const express = require('express');
const {getAllArticles, getCommentsForArticle, addCommetsToArticle, changeNumOfVotes} = require('../controllers/articlesControllers');
const router = express.Router();
const bodyParser = require('body-parser');

router.route('/')
  .get(getAllArticles);
router.route('/:article_id/comments')
  .get(getCommentsForArticle)
  .post(addCommetsToArticle);
router.route('/:article_id?')
  .put(changeNumOfVotes);
  
module.exports = router;