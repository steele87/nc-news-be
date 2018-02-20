const express = require('express');
const { getAllTopics, getArticlesByTopic } = require('../controllers/topicsControllers');
const router = express.Router();

router.route('/')
  .get(getAllTopics);

router.route('/:topic_title/articles')
  .get(getArticlesByTopic);


module.exports = router;

