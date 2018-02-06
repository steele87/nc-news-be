const users = require('../models/users');

function getUser(req, res, next) {
  users.find({ username: req.params.username }).lean()
    .then(user => {
      res.json({ user });
    });
}

function getAllUsers(req, res, next) {
  users.find().lean()
    .then(user => {
      return res.json({
        user
      });
    });
}

module.exports = {
  getAllUsers,
  getUser
};