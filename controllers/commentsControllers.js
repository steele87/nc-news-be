const comments = require('../models/comments');


function changeNumOfVotes(req, res, next) {
  if (req.params.comment_id.length !== 24) {
    return res.status(400).json({ 'message': `${req.params.comment_id} is an invalid comment id` })
  }
  else if (req.query.vote !== 'up' && req.query.vote !== 'down') {
    return res.status(400).json({ 'message': 'please use up or down as query parameter' })
  }
  else return comments.findByIdAndUpdate(req.params.comment_id)
    .then((comment) => {
      if (req.query.vote === 'up') comment.votes++;
      else if (req.query.vote === 'down') comment.votes--;
      return comment.save();
    })
    .then(comment => res.status(200).send({ comment }))
    .catch(err => res.status(500).send(err));
}

function deleteComment(req, res, next) {
  if (req.params.comment_id.length !== 24) {
    return res.status(400).json({ 'message': `${req.params.comment_id} is an invalid comment id` });
  }
  else return comments.findById(req.params.comment_id).lean()
    .then(comment => {
      if (comment.created_by === 'northcoder') {
        const commentId = req.params.comment_id;
        return comments.findByIdAndRemove(commentId).lean()
      }
      else {
        return res.status(400).json({ 'message': `comment ${req.params.comment_id} does not belong to "northcoder"` });}
    })
    .then (() => {
      res.status(200).json({'message':`comment ${req.params.comment_id} has been deleted`});
    })
    .catch(err => res.status(500).send(err));
}

module.exports = { changeNumOfVotes, deleteComment };