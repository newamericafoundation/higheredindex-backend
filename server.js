var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
const path = require('path');

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/live_test', function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// const staticPath = express.static(path.join(__dirname, '/src/static'))
// app.use('/static', staticPath)

// const indexPath = path.join(__dirname, 'src/static/index-static.html')
// // var distDir = __dirname + "/src/app-client.js";
// app.get('*', (req, res) => {
//   console.log("hello!!!!!");
//   res.sendFile(indexPath);
// });

app.get('/api/state-list', (req, res) => {
  // const filter = {};

  // stateModel.find(filter, { name: 1, path: 1 }, (err, states) => {
  //   if (err) {
  //     return console.error(err);
  //   }
  //   console.log(states);
  //   return res.json(states);
  // });
  return [{}];
});

app.get('/api/institution-list', (req, res) => {
  db.collection('final_test').find({}, { name: 1, path: 1 }).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get institutions.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get('/api/state/:path', (req, res) => {
  stateModel.findOne({
    path: req.params.path,
  }, (err, state) => {
    if (err) {
      return console.error(err);
    }
    return res.json(state);
  });
});

app.get('/api/institution/:path', (req, res) => {
  db.collection('final_test').findOne({path:req.params.path}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get institutions.");
    } else {
      res.status(200).json(docs);
    }
  });
});