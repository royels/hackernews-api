# Hacker News API
[![Build Status](https://travis-ci.org/amitburst/hackernews-api.svg?branch=master)](https://travis-ci.org/amitburst/hackernews-api)

An unofficial [Hacker News](https://news.ycombinator.com/) API built with [Node.js](http://nodejs.org/).

**Base URL:** [http://hn.amitburst.me/](http://hn.amitburst.me)

## Endpoints

#### `GET /news`
#### `GET /news/:pageId`
Returns posts from the front page

#### Example
```
$ curl http://hn.amitburst.me/news
---
{
  "length": 30,
  "nextId": "news2",
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

#### `GET /newest`
#### `GET /newest/:pageId`
Returns the most recently published posts

#### Example
```
$ curl http://hn.amitburst.me/recent
---
{
  "length": 30
  "nextId": "x?fnid=66XOsWHVxnYmDvEMaJ2k3s",
  "posts": [
    {
      "title": "Microsoft irks big brands in bid to stock mobile store",
      "url": "http://www.geekwire.com/2014/microsoft-webapps-cause-problems-unaware-companies/",
      "points": 1,
      "user": {
        "username": "aaronbrethorst",
        "url": "https://news.ycombinator.com/user?id=aaronbrethorst"
      },
      "comments": {
        "count": null,
        "url": "https://news.ycombinator.com/item?id=7275820"
      }
    },
    ...
  ]
}
```

## LICENSE
[MIT](license)
