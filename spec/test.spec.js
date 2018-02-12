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

  describe('API endpoint /api/topics', () => {
    it('GET /todfscs returns status 404', () => {
      return request
        .get('/api/todfscs')
        .expect(404)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(Object.values(res.body).length).to.be.eql(0);
          return;
        });
    });
    it('GET /topics returns an object of all topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(Object.values(res.body).length).to.be.eql(1);
          expect(Object.keys(res.body).length).to.be.eql(1);
          expect(res.body.topic.length).to.be.eql(3);
          return;
        });
    });

    it('GET /topics/:topic_id/articles returns an object of all articles related to that topic', () => {
      return request
        .get('/api/topics/Football/articles')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(Object.values(res.body).length).to.be.eql(1);
          expect(Object.keys(res.body).length).to.be.eql(1);
          expect(res.body.articles.length).to.be.eql(1);
          return;
        });
    });

    it('GET /topics/:topic_id/articles returns an object of all articles related to that topic', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(Object.values(res.body).length).to.be.eql(1);
          expect(Object.keys(res.body).length).to.be.eql(1);
          expect(res.body.topic.length).to.be.eql(2);
          return;
        });
    });

    it('GET should return all of the comments from the article with the ID provided', () => {
      const articleId = docs.articles[0]._id;
      return request
        .get(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comments.length).to.equal(2);
          return;
        });
    });

    it('POST should create a new comment.', () => {
      const articleId = docs.articles[0]._id;
      return request
        .post(`/api/articles/${articleId}/comments`)
        .send({ 'comment': 'adding a comment' })
        .expect(201)
        .then(() => {
          return request.get(`/api/articles/${articleId}/comments`);
        })
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comments.length).to.equal(3);
          return;

        });
    });

    it('PUT should either increase or decrease the number of votes an article has.', () => {
      const articleId = docs.articles[0]._id;
      return request
        .put(`/api/articles/${articleId}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.article.votes).to.equal(1);
          return;

        });
    });

    it('PUT should either increase or decrease the number of votes a comment has.', () => {
      const commentId = docs.comments[0]._id;
      return request
        .put(`/api/comments/${commentId}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comment.votes).to.equal(1);
          return;

        });
    });

    it('DELETE should remove a new comment.', () => {
      const commentId = docs.comments[0]._id; return request
        .delete(`/api/comments/${commentId}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({});
          return;

        });
    });

    it('GET should return users by ID', () => {
      const userId = docs.user.id;
      return request
        .get(`/api/users/${userId}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.user.length).to.equal(0);
          expect(Object.keys(res.body).length).to.be.eql(1);
          return;
        });
    });

    it('GET should return users ', () => {
      const userId = docs.user.id;
      return request
        .get(`/api/users`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.user.length).to.equal(1);
          expect(Object.keys(res.body).length).to.be.eql(1);
          return;
        });
    });
  });
});

