const topics = require('../models/topics');
const articles = require('../models/articles');

function getAllTopics(req, res) {
  topics.find().lean()
    .then(topics => {
      return res.json({
        topics
      });
    });
}

function getArticlesByTopic(req, res, next) {
  topics.find({ title: req.params.topic_title }).lean()
    .then(topic => {
      if (topic.length === 0) {
        return res.status(404).json({ 'message': 'no articles found' });
      } else {
        let title = topic[0].title.toLowerCase();
        return articles.find({ belongs_to: title });
      }
    })
    .then(articles => {
      res.json({ articles });
    })
    .catch(err => res.status(500).send(err))
    .catch(next);
}

module.exports = {
  getAllTopics,
  getArticlesByTopic
};