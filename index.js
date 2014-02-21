// Import modules
var restify = require('restify'),
    request = require('request'),
    cheerio = require('cheerio');

// Base Hacker News URL
var BASE_URL = 'https://news.ycombinator.com/';

// Retrieves posts from the given Hacker News posts page URL
function getPosts(req, res, next, url) {
  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

  var fetchUrl = req.params.pageId ? BASE_URL + req.params.pageId.replace(/^\//, '') : url;

  // Make request to fetchUrl
  return request(fetchUrl, function(error, response, body) {
    if (error || response.statusCode != 200) {
      return next(error);
    }

    var result = {};
    var results = [];
    var $ = cheerio.load(body);

    // Traverse DOM
    $('tr td.title a').each(function(i, elem) {
      var anchor = $(this);
      var info = anchor.parent().parent().next().children('td.subtext');

      // Use title as nextPageId if its text is 'More'
      var title = anchor.text();
      if (title == 'More') {
        result.nextPageId = anchor.attr('href');
        return false;
      }

      // Continue if results limit reached (still want nextPageId)
      if (req.params.limit && results.length == req.params.limit) {
        return true;
      }

      // Parse the HTML
      var url = anchor.attr('href').match(/item\?id=(.*)/) ? BASE_URL + anchor.attr('href') : anchor.attr('href');
      var points = parseInt(info.children('span').text());
      var username = info.children('a').eq(0).text();
      var userUrl = BASE_URL + info.children('a').eq(0).attr('href');
      var commentsCount = parseInt(info.children('a').eq(1).text());
      var commentsUrl = BASE_URL + info.children('a').eq(1).attr('href');

      // Add new object to results array
      results.push({
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

    // Add results array and length to final object and return JSON representation
    result.results = results;
    result.length = results.length;
    res.end(JSON.stringify(result));
    return next();
  });  
}

// Retrieves posts from Hacker News front page
function getTopPosts(req, res, next) {
  return getPosts(req, res, next, BASE_URL);
}

// Retrieves newest posts from Hacker News
function getRecentPosts(req, res, next) {
  return getPosts(req, res, next, BASE_URL + 'newest');
}

// Set up server and API routes and start server
var server = restify.createServer({
  name: 'hackernews-api',
  version: '0.0.1'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/top', getTopPosts);
server.get('/recent', getRecentPosts);

server.listen(process.env.PORT || 8080);
