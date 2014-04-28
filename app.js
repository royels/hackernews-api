// Import modules
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var logger = require('morgan');

// Base Hacker News URL
var BASE_URL = 'https://news.ycombinator.com/';

// Configure Express app
var app = express();
module.exports = app;
app.use(logger('dev'));

// GET '/' returns basic API information
function getIndex(req, res) {
  res.json({
    name: 'hackernews-api',
    description: 'An unofficial Hacker News API',
    version: '0.1.0',
    project_url: 'https://github.com/amitburst/hackernews-api',
    author: 'Amit Burstein <amit.burstein@gmail.com> (http://amitburst.me)'
  });
}

// GET '/favicon.ico' returns status code 204 (no content)
function getFavicon(req, res) {
  res.send(204);
}

// GET '/robots.txt' disallows crawling
function getRobots(req, res) {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
}

// GET '/news' returns posts from the front page
function getFrontPage(req, res) {
  getPostsForId(req, res, '');
}

// GET '/newest' returns the 'new' page
function getNewestPosts(req, res) {
  getPostsForId(req, res, 'newest');
}

// Returns posts for a page ID
function getPostsForId(req, res, pageId) {
  var pageId = req.url.split('/', 3)[2] || pageId;
  var url = BASE_URL + pageId;

  request(url, function(error, response, body) {
    if (error || response.statusCode != 200 || body === 'Unknown or expired link.') {
      res.json({error: 'Could not request page'});
    }

    var result = {};
    var posts = [];
    var $ = cheerio.load(body);

    $('tr td.title a').each(function(i, elem) {
      var anchor = $(this);
      var info = anchor.parent().parent().next().children('td.subtext');

      var title = anchor.text();
      if (title === 'More') {
        result.nextId = anchor.attr('href')[0] === '/' ? anchor.attr('href').substring(1) : anchor.attr('href');
        return false;
      }

      var url = anchor.attr('href').match(/item\?id=(.*)/) ? BASE_URL + anchor.attr('href') : anchor.attr('href');
      var points = parseInt(info.children('span').text());
      var username = info.children('a').eq(0).text();
      var userUrl = BASE_URL + info.children('a').eq(0).attr('href');
      var commentsCount = parseInt(info.children('a').eq(1).text());
      var commentsUrl = BASE_URL + info.children('a').eq(1).attr('href');

      posts.push({
        title: title,
        url: url,
        points: points,
        user: {
          username: username,
          url: userUrl
        },
        comments: {
          count: commentsCount,
          url: commentsUrl
        }
      });
    });

    result.posts = posts;
    result.length = posts.length;
    res.json(result);
  });
}

// Routes
app.get('/', getIndex);
app.get('/favicon.ico', getFavicon);
app.get('/robots.txt', getRobots);
app.get('/news', getFrontPage);
app.get('/news/:pageId', getPostsForId);
app.get('/newest', getNewestPosts);
app.get('/newest/:pageId', getPostsForId);

// Start server!
app.listen(process.env.PORT || 3000);
