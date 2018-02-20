process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const seed = require('../seed/test.seed');
const app = require('../server');
const request = require('supertest')(app);
const mongoose = require('mongoose');

describe('API endpoints', () => {
  let docs = {};
  beforeEach(function () {
    return mongoose.connection.dropDatabase()
      .then(() => {
        return seed();
      })
      .then((data) => {
        docs = data;
        return;
      });
  });
  after(() => {
    mongoose.disconnect();
  });

  describe('API endpoint /topics', () => {
    it('GET /todfscs returns status 404', () => {
      return request
        .get('/todfscs')
        .expect(404)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('Invalid path');
        });
    });
    it('GET /topics returns an object of all topics', () => {
      return request
        .get('/topics')
        .expect(200)    
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(Object.values(res.body).length).to.equal(1);
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.topics.length).to.equal(3);
        });
    });

    it('GET /topics/:topic_id/articles returns an object of all articles related to that topic', () => {
      return request
        .get('/topics/Football/articles')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(Object.values(res.body).length).to.equal(1);
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.articles.length).to.equal(1);
        });
    });

    it('GET /topics/:topic_id/articles returns error message if invalid', () => {
      return request
        .get('/topics/banana/articles')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('no articles found');
        });
    });

    it('GET /articles returns an object of all articles', () => {
      return request
        .get('/articles')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(Object.values(res.body).length).to.equal(1);
          expect(Object.keys(res.body).length).to.equal(1);
          expect(res.body.topics.length).to.equal(2);
        });
    });

    it('GET  returns all of the comments from the article with the ID provided', () => {
      const articleId = docs.articles[0]._id;
      return request
        .get(`/articles/${articleId}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comments.length).to.equal(2);
        });
    });

    it('GET returns error message if comment id is invalid', () => {
      const articleId = 34567;
      return request
        .get(`/articles/${articleId}/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(`${articleId} is an invalid article id`);
        });
    });

    it('POST creates a new comment.', () => {
      const articleId = docs.articles[0]._id;
      return request
        .post(`/articles/${articleId}/comments`)
        .send({ 'comment': 'adding a comment' })
        .expect(201)
        .then((res) => {
          expect(res.body.comment.body).to.equal('adding a comment');
        });
    });

    it('POST returns error message if request can not be completed', () => {
      const articleId = 1234567890;
      return request
        .post(`/articles/${articleId}/comments`)
        .send({ 'comment': 'adding a comment' })
        .expect(400)

        .then(res => {
          expect(res.body.message).to.equal('Please ensure correct article id is used and comment is included in body');
        });
    });

    it('PUT should either increase or decrease the number of votes an article has.', () => {
      const articleId = docs.articles[0]._id;
      return request
        .put(`/articles/${articleId}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.article.votes).to.equal(1);
        });
    });

    it('PUT returns error if article vote is incorrect', () => {
      const articleId = docs.articles[0]._id;
      return request
        .put(`/articles/${articleId}?vote=updfg`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('please use up or down as query parameter');
        });
    });

    it('PUT should either increase or decrease the number of votes a comment has.', () => {
      const commentId = docs.comments[0]._id;
      return request
        .put(`/comments/${commentId}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comment.votes).to.equal(1);

        });
    });

    it('PUT returns error if comment vote is invalid', () => {
      const commentId = 123456;
      return request
        .put(`/comments/${commentId}?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(`${commentId} is an invalid comment id`);
        });
    });

    it('DELETE should remove a new comment.', () => {
      const commentId = docs.comments[0]._id;
      return request
        .delete(`/comments/${commentId}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal(`comment ${commentId} has been deleted`);
        });
    });

    it('DELETE returns error message if invalid comment id', () => {
      const commentId = 234567; return request
        .delete(`/comments/${commentId}`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(`${commentId} is an invalid comment id`);
        });
    });

    it('GET should return users by ID', () => {
      const userId = docs.user.id;
      return request
        .get(`/users/${userId}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.user.length).to.equal(0);
          expect(Object.keys(res.body).length).to.be.eql(1);
        });
    });

    it('GET returns all users ', () => {
      return request
        .get('/users')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.user.length).to.equal(1);
          expect(Object.keys(res.body).length).to.be.eql(1);
        });
    });
  });
});

