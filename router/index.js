const express = require('express');

const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');
const usersRouter = require('./users');


const router = express.Router();

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);

router.route('/')
  .get((req, res) => res.status(200).send({status: 'working'}));

router.use('/*', (req, res, next) => {
  const err = new Error('Invalid path');
  err.statusCode = 404;
  next(err);
});

router.use((err, req, res, next) => {
  res.status(err.statusCode).json({error: err.message, status: err.statusCode});
  next();
});

module.exports = router;