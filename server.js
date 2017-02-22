var express = require('express');
var app = express();
var fs = require('fs');
var marked = require('marked');


var injectPayload = [
  "<script src='//localhost:35729/livereload.js'></script>"
].join("\n");

app.get('/', function(req, res){
  console.log()
  fs.readFile('./dist/index.html', 'utf8', function(err, src) {
    var html = src.replace("</body>", injectPayload+"\n</body>");
    res.send(html);
  });
});

app.use(express.static('dist'));

app.listen(3000);
console.log('SERVER RUNNING ON LOCALHOST:3000');

