var fs = require('fs');
var onlyScripts = require('./utils/scriptFilter');
var path = require('path');

var tasks = fs.readdirSync(path.join(__dirname, '/tasks/')).filter(onlyScripts);

tasks.forEach(function(task) {
  require('./tasks/' + task);
});
