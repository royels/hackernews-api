# Hacker News API
[![Build Status](https://travis-ci.org/amitburst/hackernews-api.svg?branch=master)](https://travis-ci.org/amitburst/hackernews-api)

An unofficial [Hacker News](https://news.ycombinator.com/) API built with [Node.js](http://nodejs.org/).

**Base URL:** [http://hn.amitburst.me/](http://hn.amitburst.me)

## Endpoints

Return posts from the front page  
`GET /news`  
`GET /news/:pageId`

Return posts from the "new" page  
`GET /newest`  
`GET /newest/:pageId`

Return posts from the "ask" page  
`GET /ask`  
`GET /ask/:pageId`

### Examples
```
$ curl http://hn.amitburst.me/news
---
{
  "length": 30,
  "nextPageId": "news2",
  "posts": [
    {
      "title": "Project Tango",
      "url": "http://www.google.com/atap/projecttango/",
      "points": 591,
      "user": {
        "username": "psbp",
        "url": "https://news.ycombinator.com/user?id=psbp"
      },
      "comments": {
        "count": 257,
        "url": "https://news.ycombinator.com/item?id=7273081"
      }
    },
    ...
  ]
}
```

## LICENSE
[MIT](license)
