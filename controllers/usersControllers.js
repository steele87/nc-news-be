const users = require('../models/users');

function getUser(req, res, next) {
  users.find({username: req.params.username}).lean()
    .then(user => {
      res.json({ user });
    });
}

module.exports = getUser;