'use strict';

var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var randomstring = require('randomstring');

function getRandomColor(letters) {
  var color = '#';
  for (var i = 0; i < 6; ++i) {
    color += letters[Math.floor(Math.random() * letters.length)];
    }
  return color;
  }

var MongoClient = mongo.MongoClient;
var url = 'mongodb://localhost:27017/newlistdb';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection('lists', function(err, res) {
    if (err) throw err;
    db.close();
  });
});

var app = express();

app.engine(
    'handlebars',
    exphbs({defaultLayout: 'main', partialsDir: ['views/partials']}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

/* --------------- start of routes --------------- */

app.get('/', function(req, res) {
  var renderData = {title: 'Item List', isHome: true};

  res.render('index', renderData);
});

app.get('/list', function(req, res) {
  var renderData = {title: 'Item List', isList: true};

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('lists');
    collection.find({}).toArray(function(err, items) {
      if (err) throw err;
      db.close();
      if (items.length === 0) {
        renderData.emptyList = 'Please add a new item!';
        res.render('index', renderData);
        return;
      }
      renderData.item = items.map(function(item) {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          color: getRandomColor('DEF')
        };
      });
      res.render('index', renderData);
    });
  });
});

app.post('/item/create', function(req, res) {
  var id = randomstring.generate(12);
  var name = req.body.name;
  var price = req.body.price;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('lists');
    collection.insertOne(
        {id: id, name: name, price: price}, function(err, result) {
          if (err) throw err;
          db.close();
          res.send('OK');
        });
  });
});

app.post('/item/remove', function(req, res) {
  var id = req.body.id;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('lists');
    collection.remove({id: id}, function(err, result) {
      if (err) throw err;
      db.close();
      res.send('OK');
    });
  });
});

app.get('*', function(req, res) {
  var renderData = {
    title: 'Item List',
    isError: true,
    error: ';-( 404 | Page Not Found'
  };

  res.status(404).render('index', renderData);
});

/* --------------- end of routes --------------- */

var port = process.env.PORT || 3000;
// Start the server listening on the specified port.
app.listen(port, function() {
  console.log('== Server listening on port', port);
});