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


function getArticlesByTopic(req, res) {
  topics.find({ title: req.params.topic_title })
    .then(topic => {
      if (!topic.length) {
        return res.status(404).json({ 'message': 'no articles found' });
      } else {
        let title = topic[0].title.toLowerCase();
        return articles.find({ belongs_to: title });
      }
    })
    .then(articles => {
      res.json({ articles });
    })
    .catch(err => res.status(500).send(err));
}

module.exports = {
  getAllTopics,
  getArticlesByTopic
};