const articles = require('../models/articles');
const comments = require('../models/comments');

function getAllArticles(req, res, next) {
  articles.find().lean()
    .then(topic => {
      return res.json({
        topic
      });
    });
}

function getArticle(req, res, next) {
  return articles.findById(req.params.article_id).lean()
    .then(article => {
      return res.json({ article })
    })
}

function getCommentsForArticle(req, res, next) {
  return comments.find({ belongs_to: req.params.article_id })
    .then(comments => {
      res.json({ comments });
    });
}

function addCommetsToArticle(req, res, next) {
  const addedComment = { body: req.body.comment, belongs_to: req.params.article_id };
  new comments(addedComment).save()
    .then(comment => {
      res.status(201).json({ comment });
    });
}

function changeNumOfVotes(req, res, next) {
  return articles.findByIdAndUpdate(req.params.article_id)
    .then((article) => {
      if (req.query.vote === 'up') article.votes++;
      else if (req.query.vote === 'down') article.votes--;
      return article.save();
    })
    .then(article => res.status(200).send({article}))
}

module.exports = {
  getAllArticles,
  getCommentsForArticle,
  addCommetsToArticle,
  changeNumOfVotes,
  getArticle
};