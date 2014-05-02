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

Return a user's profile information  
`GET /user/:name`

Return posts from the "jobs" page  
`GET /jobs`

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

```
$ curl http://hn.amitburst.me/user/paulirish
---
{
  username: "paulirish",
  created: "2119 days ago",
  karma: 3062,
  average: 5.86,
  about: "frontend developer.developer advocate, google chrome.the web can be far more compelling.",
  about_html: "frontend developer.<p>developer advocate, google chrome.</p><p>the web can be far more compelling.</p>"
}
```

```
$ curl http://hn.amitburst.me/jobs
---
{
  "length": 14,
  "jobs": [
    {
      "title": "Hiring engineer #2 for fast-growing enterprise logistics company",
      "url": "https://news.ycombinator.com/item?id=7683815",
    },
    {
      "title": "Amicus (YC S12) is hiring a Sales Director in NYC",
      "url": "http://jobs.amicushq.com/pages/sales_director"
    },
    ...
  ]
}
```

## LICENSE
[MIT](license)
