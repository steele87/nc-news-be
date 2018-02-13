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
  if (req.params.article_id.length !== 24) {
    return res.status(400).json({ 'message': `${req.params.article_id} is an invalid article id` })
  }
  else return articles.findById(req.params.article_id).lean()
    .then(article => {
      return res.json({ article })
    })
    .catch(err => res.status(500).send(err));
}

function getCommentsForArticle(req, res, next) {
  if (req.params.article_id.length !== 24) {
    return res.status(400).json({ 'message': `${req.params.article_id} is an invalid article id` })
  }
  else return comments.find({ belongs_to: req.params.article_id })
    .then(comments => {
      res.json({ comments });
    })
    .catch(err => res.status(500).send(err));
}

function addCommetsToArticle(req, res, next) {
  if (req.params.article_id.length !== 24 || !req.body.comment) {
    return res.status(400).json({ 'message': `Please ensure correct article id is used and comment is included in body` })
  }
  const addedComment = { body: req.body.comment, belongs_to: req.params.article_id };
  new comments(addedComment).save()
    .then(comment => {
      res.status(201).json({ comment });
    })
    .catch(err => res.status(500).send(err));
}

function changeNumOfVotes(req, res, next) {
  if (req.params.article_id.length !== 24) {
    return res.status(400).json({ 'message': `${req.params.article_id} is an invalid article id` })
  }
  if (req.query.vote !== 'up' && req.query.vote !== 'down') {
    return res.status(400).json({ 'message': 'please use up or down as query parameter' })
  }
  else return articles.findByIdAndUpdate(req.params.article_id)
    .then((article) => {
      if (req.query.vote === 'up') article.votes++;
      else if (req.query.vote === 'down') article.votes--;
      return article.save();
    })
    .then(article => res.status(200).send({ article }))
    .catch(err => res.status(500).send(err));
}

module.exports = {
  getAllArticles,
  getCommentsForArticle,
  addCommetsToArticle,
  changeNumOfVotes,
  getArticle
};