const comments = require('../models/comments');


function changeNumOfVotes(req, res, next) {
  if (req.params.comment_id.length !== 24) {
    return res.status(500).json({ 'message': `${req.params.comment_id} is an invalid comment id` })
  }
  else if (req.query.vote !== 'up' && req.query.vote !== 'down') {
    return res.status(500).json({ 'message': 'please use up or down as query parameter' })
  }
  else return comments.findByIdAndUpdate(req.params.comment_id)
    .then((comment) => {
      if (req.query.vote === 'up') comment.votes++;
      else if (req.query.vote === 'down') comment.votes--;
      return comment.save();
    })
    .then(comment => res.status(200).send({ comment }))
}

function deleteComment(req, res, next) {
  return comments.findByIdAndRemove(req.params.comment_id).lean()
    .then(comment => {
      const commentId = req.params.comment_id;
      res.send(` comment:${commentId} has been deleted`);
    });
}

module.exports = { changeNumOfVotes, deleteComment };