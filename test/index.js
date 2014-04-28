var app = require('../app');
var assert = require('chai').assert;
var supertest = require('supertest');

describe('API', function() {

  describe('GET /', function(done) {
    it('should return status code "200"', function(done) {
      supertest(app)
        .get('/')
        .expect(200, done)
    })

    it('should return content-type header "application/json"', function(done) {
      supertest(app)
        .get('/')
        .expect('Content-Type', 'application/json', done)
    })

    it('should match the version number in "package.json"', function(done) {
      supertest(app)
        .get('/')
        .expect(function(res) {
          assert.equal(res.body.version, require('../package').version);
        })
        .end(done)
    })
  })

  describe('GET /favicon.ico', function(done) {
    it('should return status code "204"', function(done) {
      supertest(app)
        .get('/favicon.ico')
        .expect(204, done)
    })
  })

  describe('GET /robots.txt', function(done) {
    it('should return status code "200"', function(done) {
      supertest(app)
        .get('/robots.txt')
        .expect(200, done)
    })

    it('should return content-type header "text/plain"', function(done) {
      supertest(app)
        .get('/robots.txt')
        .expect('Content-Type', 'text/plain; charset=utf-8', done)
    })

    it('should return expected content', function(done) {
      supertest(app)
        .get('/robots.txt')
        .expect(function(res) {
          assert.equal(res.text, 'User-agent: *\nDisallow: /');
        })
        .end(done)
    })
  })

  describe('GET /news', function(done) {
    it('should return status code "200"', function(done) {
      supertest(app)
        .get('/news')
        .expect(200, done)
    })

    it('should return content-type header "application/json"', function(done) {
      supertest(app)
        .get('/news')
        .expect('Content-Type', 'application/json', done)
    })

    it('should return expected content', function(done) {
      supertest(app)
        .get('/news')
        .expect(function(res) {
          assert.equal(res.body.nextId, 'news2');
          assert.typeOf(res.body.length, 'number');
          assert.lengthOf(res.body.posts, res.body.length);
        })
        .end(done)
    })
  })

  describe('GET /news/:pageId', function(done) {
    it('should return status code "200"', function(done) {
      supertest(app)
        .get('/news/news2')
        .expect(200, done)
    })

    it('should return content-type header "application/json"', function(done) {
      supertest(app)
        .get('/news/news2')
        .expect('Content-Type', 'application/json', done)
    })

    it('should return expected content', function(done) {
      supertest(app)
        .get('/news/news2')
        .expect(function(res) {
          assert.match(res.body.nextId, /^x\?fnid=.*$/);
          assert.typeOf(res.body.length, 'number');
          assert.lengthOf(res.body.posts, res.body.length);
        })
        .end(done)
    })

    it('should return error JSON for an invalid page ID', function(done) {
      supertest(app)
        .get('/news/asdasd')
        .expect(function(res) {
          assert.equal(res.body.error, 'Could not request page');
        })
        .end(done)
    })
  })

  describe('GET /newest', function(done) {
    it('should return status code "200"', function(done) {
      supertest(app)
        .get('/newest')
        .expect(200, done)
    })

    it('should return content-type header "application/json"', function(done) {
      supertest(app)
        .get('/newest')
        .expect('Content-Type', 'application/json', done)
    })

    it('should return expected content', function(done) {
      supertest(app)
        .get('/newest')
        .expect(function(res) {
          assert.match(res.body.nextId, /^x\?fnid=.*$/);
          assert.typeOf(res.body.length, 'number');
          assert.lengthOf(res.body.posts, res.body.length);
        })
        .end(done)
    })
  })

})
