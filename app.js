var express = require('express');
var app = express();

var urlStore = {
  "0": "http://google.com",
  "1": "http://youtube.com"
};

app.get('/', function (req, res) {
  res.send('URL Shortener');
});

app.get('/:id', function (req, res) {
  res.redirect(urlStore[req.params.id]);
});

// I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
// When I visit that shortened URL, it will redirect me to my original link.
app.get('/*', function (req, res) {
  var url = req.params[0];
  var shurl = req.hostname;
  
  // if invalid URL, return error
  
  var data = {
    "original_url": url,
    "short_url": shurl
  };

  var error = {
    "error": "URL invalid"
  };
  
  res.send(JSON.stringify(data));
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});