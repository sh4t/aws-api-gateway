var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var app = express();

var AWS = require('aws-sdk');
var uuid = require('node-uuid');

AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3();

s3.listBuckets(function(err, data) {
    if (err)
        console.log(err, err.stack); // experienced error
    else
		bucket_list = data
});

app.use(function(req, res, next){
  var ua = req.headers['user-agent'];
  db.zadd('online', Date.now(), ua, next);
});

app.use(function(req, res, next){
  var min = 60 * 1000;
  var ago = Date.now() - min;
  db.zrevrangebyscore('online', '+inf', ago, function(err, users){
    if (err) return next(err);
    req.online = users;
    next();
  });
});

app.get('/', function(req, res) {
    res.send('Amazon AWS API Gateway Endpoint\n' + '(' + req.online.length + ' users online' + ')');
});

app.get('/listbuckets', function(req, res, next){
	var ua = req.headers['user-agent'];
	db.zadd('online_list_buckets', Date.now(), ua, next);
	res.send(bucket_list);
});

var server = app.listen(5000, function() {
    console.log('Listening on port %d', server.address().port);
});