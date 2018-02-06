const express = require('express');
const {getAllTopics, getArticlesByTopic}= require('../controllers/topicsControllers');
const router = express.Router();
const bodyParser = require('body-parser');

router.route('/')
  .get(getAllTopics);

router.route('/:topic_title/articles')
  .get(getArticlesByTopic);

  
module.exports = router;

