const express = require('express');
const { getAllArticles, getCommentsForArticle, addCommetsToArticle, changeNumOfVotes, getArticle } = require('../controllers/articlesControllers');
const router = express.Router();

router.route('/')
  .get(getAllArticles);
router.route('/:article_id/comments')
  .get(getCommentsForArticle)
  .post(addCommetsToArticle);
router.route('/:article_id?')
  .get(getArticle);
router.route('/:article_id?')
  .put(changeNumOfVotes);

module.exports = router;

