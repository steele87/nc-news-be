const topics = require('../models/topics');
const articles = require('../models/articles');

function getAllTopics(req, res, next) {
  topics.find().lean()
    .then(topic => {
      return res.json({
        topic
      });
    });
}


function getArticlesByTopic(req, res, next) {

  topics.find({ title: req.params.topic_title })

    .then(topic => {
      let title = topic[0].title.toLowerCase();
      return articles.find({ belongs_to: title });
    })
    .then(articles => {
      res.json({ articles });
    })
    .catch(console.error);
}

module.exports = {
  getAllTopics,
  getArticlesByTopic
};