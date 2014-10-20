# day-view
A puzzle for FB

## Requirements to build (global deps)
- [node](http://nodejs.org)
- [gulp](http://gulpjs.com)

## To build
```
npm install && gulp
```

Build project is created under `dist` directory.

## Assumptions
- don't care about text getting cut off (overflow: hidden, but this could be fixed my popups, or forcing some vertical overlap for sake of readability of event information)
- data is correct, meaning no malformed response from a service
- not responsive (could easily change this since all positions are % based)
- "infinite" overlapping, meaning all events could overlap, thus making 100 max columns in one group (chaos?)
- ~~sort events off start time, not both start and end~~ sorting on both now
- example data as grokked from instructions:
```
var mock = [
    {"start": 30, "end": 150},
    {"start": 20, "end": 100},
    {"start": 540, "end": 600},
    {"start": 550, "end": 605},
    {"start": 560, "end": 620},
    {"start": 610, "end": 670},
    {"start": 310, "end": 370},
    {"start": 410, "end": 470},
    {"start": 10, "end": 30}
];
```
- tested in:
    - OS X: Safari, Firefox, Chrome
    - Win: IE 11


## TODOs
- unit/performance tests
- getting rid of external deps (3rd party)
- compressing/uglifying JS
- looking for ways to do work with less/more compact code
