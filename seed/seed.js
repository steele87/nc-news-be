let models = require('../models/models');
let userData = require('./data/user_data.js');
let articleData = require('./data/articles');
let Chance = require('chance');
let chance = new Chance();
let _ = require('underscore');
let async = require('async');
let mongoose = require('mongoose');
let log4js = require('log4js');
let logger = log4js.getLogger();
let moment = require('moment');
let DBs = require('../config').DB;

mongoose.connect('mongodb://steele:defour16@ds263137.mlab.com:63137/nc-news', function (err) {
  if (!err) {
    logger.info(`connected to database ${DBs.dev}`);
    mongoose.connection.db.dropDatabase();
    async.waterfall([
      addUsers,
      addTopics,
      addArticles,
      addComments,
      addNorthcoderUser
    ], function (err) {
      if (err) {
        logger.error('ERROR SEEDING :O');
        console.log(JSON.stringify(err));
        process.exit();
      }
      logger.info('DONE SEEDING!!');
      process.exit();
    });
  } else {
    logger.error('DB ERROR');
    console.log(JSON.stringify(err));
    process.exit();
  }
});

function addNorthcoderUser(done) {
  var userDoc = new models.Users(
    {
      username: 'northcoder',
      name: 'Awesome Northcoder',
      avatar_url: 'https://avatars3.githubusercontent.com/u/6791502?v=3&s=200'
    }
  );
  userDoc.save(function (err) {
    if (err) {
      return done(err);
    }
    return done();
  });
}

function addUsers(done) {
  logger.info('adding users')
  async.eachSeries(userData, function (user, cb) {
    var userDoc = new models.Users(user);
    userDoc.save(function (err) {
      if (err) {
        return cb(err);
      }
      return cb();
    });
  }, function (error) {
    if (error) return done(error);
    return done(null)
  })
}

function addTopics(done) {
  logger.info('adding topics')
  var topicDocs = [];
  async.eachSeries(['Football', 'Cooking', 'Coding'], function (topic, cb) {
    var topicObj = {
      title: topic,
      slug: topic.toLowerCase()
    };
    var topicDoc = new models.Topics(topicObj);
    topicDoc.save(function (err, doc) {
      if (err) {
        logger.error(JSON.stringify(err));
        return cb(err);
      }
      logger.info(JSON.stringify(doc));
      topicDocs.push(topicObj);
      return cb();
    });
  }, function (error) {
    if (error) return done(error);
    return done(null, topicDocs)
  })
}

function addArticles(topicDocs, done) {
  logger.info('adding articles');
  // will be a big array of strings
  var docIds = [];
  async.eachSeries(topicDocs, function (topic, cb) {
    var articles = articleData[topic.slug];
    async.eachSeries(userData, function (user, cbTwo) {
      var usersArticle = articles[0];
      usersArticle.created_by = user.username;
      usersArticle.belongs_to = topic.slug;
      usersArticle.votes = _.sample(_.range(2, 11));
      var usersArticleDoc = new models.Articles(usersArticle);
      usersArticleDoc.save(function (err, doc) {
        if (err) {
          logger.error(JSON.stringify(err));
          return cb(err);
        }
        articles.shift();
        docIds.push(doc._id);
        var usersArticleTwo = articles[0];
        usersArticleTwo.created_by = user.username;
        usersArticleTwo.belongs_to = topic.slug;
        usersArticleTwo.votes = _.sample(_.range(2, 11));
        var usersArticleTwoDoc = new models.Articles(usersArticleTwo);
        usersArticleTwoDoc.save(function (err, doc2) {
          if (err) {
            logger.error(JSON.stringify(err));
            return cb(err);
          }
          articles.shift();
          docIds.push(doc2._id);
          return cbTwo();
        });
      });
    }, function (error) {
      if (error) return cb(error);
      return cb(null, docIds);
    })

  }, function (error) {
    if (error) return done(error);
    return done(null, docIds)
  })
}

function addComments(docIds, done) {
  logger.info('adding comments');
  async.eachSeries(docIds, function (id, cb) {
    async.eachSeries(_.range(_.sample(_.range(5, 11))), function (x, cbTwo) {
      var comment = {
        body: chance.paragraph({sentences: _.sample(_.range(2, 5))}),
        belongs_to: id,
        created_by: userData[_.sample(_.range(6))].username,
        votes: _.sample(_.range(2, 11)),
        created_at: getRandomStamp()
      };
      var commentDoc = new models.Comments(comment);
      commentDoc.save(function (err) {
        if (err) {
          return cb(err)
        }
        return cbTwo();
      })
    }, function (error) {
      if (error) return done(error);
      return cb();
    })

  }, function (err) {
    if (err) return done(err);
    return done()
  });
}

function getRandomStamp() {
  return new Date (
    moment().subtract(_.sample(_.range(1,7)), 'days')
    .subtract(_.sample(_.range(1,24)), 'hours')
    .subtract(_.sample(_.range(1,60)), 'minutes')
    .format()
  ).getTime()
}
