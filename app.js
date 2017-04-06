var express = require('express');
var mongoose = require('mongoose');
var isUrl = require('is-url');
var app = express();

// db setup
var uri = process.env.MONGOURI;
mongoose.connect(uri);

// define schema and create model
var linkSchema = new mongoose.Schema({
  urls: []
});
var Link = mongoose.model('link', linkSchema);

app.get('/', function(req, res) {
  res.send('URL Shortener');
});

app.get('/:id', function(req, res) {
  var id = req.params.id;

  if (id !== "undefined") {
    Link.findOne({}, function(err, links) {
      if (err) return console.error(err);
      console.log('hitting db');
      res.redirect(links.urls[req.params.id]);
    })
  }
});

app.get('/new/*', function(req, res) {
  var str = req.params[0];

  if (isUrl(str)) {
    // store url in db document
    Link.findOne(function(err, links) {
      if (err) return console.error(err);

      links.urls.push(str);
      var len = links.urls.length;
      var shurl = req.protocol + '://' + req.hostname + '/' + (len - 1);

      var data = {
        "original_url": str,
        "short_url": shurl
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
  } else {
    var error = {
      "error": "URL invalid"
    };
    res.send(JSON.stringify(error));
  };
});

app.listen(3000, function() {
  console.log('App listening on port 3000!');
});
