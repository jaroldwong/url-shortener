var express = require('express');
var mongoose = require('mongoose');
var app = express();

// db setup
var uri = process.env.MONGOURI;
mongoose.connect(uri);

// define schema and create model
var linkSchema = new mongoose.Schema({urls: []});
var Link = mongoose.model('link', linkSchema);

app.get('/', function (req, res) {
  res.send('URL Shortener');
});

app.get('/:id', function (req, res) {
  Link.findOne({}, function (err, links) {
    if (err) return console.error(err);

    res.redirect(links.urls[req.params.id]);
  })
});

app.get('/*', function (req, res) {
  var url = req.params[0];

  // store url in db document
  Link.findOne(function (err, links) {
    if (err) return console.error(err);

    links.urls.push(url);
    var len = links.urls.length;
    var shurl = req.protocol + '://' + req.hostname + '/' + (len- 1);

    // if invalid URL, return error
    var data = {
      "original_url": url,
      "short_url": shurl
    };

    var error = {
      "error": "URL invalid"
    };
    
    res.send(JSON.stringify(data));

    links.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successful save');
        }
      });
  });
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});