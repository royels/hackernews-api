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
    version: '0.1.5',
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

// GET '/ask' returns the 'ask' page
function getAskPosts(req, res) {
  getPostsForId(req, res, 'ask');
}

// Returns posts for a page ID
function getPostsForId(req, res, page) {
  var pageId = page;
  var pageIdFromUrl = req.url.split('/', 3)[2];
  if (pageIdFromUrl) {
    pageId = pageIdFromUrl === 'news2' ? 'news2' : 'x?fnid=' + pageIdFromUrl;
  }

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
      if (title == 'scribd') {
        return true;
      }
      if (title === 'More') {
        result.nextPageId = anchor.attr('href') === 'news2' ? 'news2' : anchor.attr('href').substring(8);
        return false;
      }

      var url = anchor.attr('href').match(/item\?id=(.*)/) ? BASE_URL + anchor.attr('href') : anchor.attr('href');
      var points = parseInt(info.children('span').text());
      var username = info.children('a').eq(0).text();
      var userUrl = BASE_URL + info.children('a').eq(0).attr('href');
      var commentsCount = parseInt(info.children('a').eq(1).text()) || 0;
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

// GET '/user/:name' returns a user's profile information
function getUserProfile(req, res) {
  var url = BASE_URL + 'user?id=' + req.params.name;

  request(url, function(error, response, body) {
    if (error || response.statusCode != 200 || body === 'No such user.') {
      res.json({error: 'User could not be found'});
    }

    var $ = cheerio.load(body);
    var base = $('form table tr td');

    var username = base.eq(1).text();
    var created = base.eq(3).text();
    var karma = parseInt(base.eq(5).text()) || 0;
    var average = parseFloat(base.eq(7).text()) || 0;
    var about = base.eq(9).text();
    var aboutHtml = base.eq(9).html();

    var submissionsUrl = BASE_URL + '/submitted?id=' + username;
    var commentsUrl = BASE_URL + '/threads?id=' + username;

    var result = {
      username: username,
      created: created,
      karma: karma,
      average: average,
      about: about,
      about_html: aboutHtml
    }

    res.json(result);
  });
}

// GET '/jobs' returns the 'jobs' page
function getJobs(req, res) {
  var url = BASE_URL + 'jobs';

  request(url, function(error, response, body) {
    if (error || response.statusCode != 200) {
      res.json({error: 'Could not request page'});
    }

    var result = {};
    var jobs = [];
    var $ = cheerio.load(body);

    $('table tr td td.title').children().each(function(i, elem) {
      var title = $(elem).text();
      var url = $(elem).attr('href');

      if (title.match(/^ (.*) $/)) {
        return true;
      }

      if (url.match(/^item\?id=.*$/)) {
        url = BASE_URL + url;
      }

      jobs.push({
        title: title,
        url: url
      });
    });

    result.jobs = jobs;
    result.length = jobs.length;
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
app.get('/ask', getAskPosts);
app.get('/ask/:pageId', getPostsForId);
app.get('/user/:name', getUserProfile);
app.get('/jobs', getJobs);

// Start server!
app.listen(process.env.PORT || 3000);
