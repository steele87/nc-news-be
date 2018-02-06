const comments = require('../models/comments');


function changeNumOfVotes(req, res, next) {
  return comments.findByIdAndUpdate(req.params.comment_id).lean()
    .then((comment) => {
      if (req.query.vote === 'up') comment.votes++;
      else if (req.query.vote === 'down') comment.votes--;
      return comment.save();
    })
    .then(comment => res.status(200).send(comment))
}

function deleteComment(req, res, next) {
  return comments.findByIdAndRemove(req.params.comment_id).lean()
    .then(comment => {
      const commentId = req.params.comment_id;
      res.send(` comment:${commentId} has been deleted`);
    });
}

module.exports = { changeNumOfVotes, deleteComment };