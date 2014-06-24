var express = require('express');
var app = express();

var AWS = require('aws-sdk');
var uuid = require('node-uuid');

AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3();

s3.listBuckets(function(err, data) {
    if (err)
        console.log(err, err.stack); // experienced error
    else
        console.log(data); // success
});

app.get('/', function(req, res) {
    res.send('Amazon AWS API Gateway Endpoint');
});

var server = app.listen(5000, function() {
    console.log('Listening on port %d', server.address().port);
});
