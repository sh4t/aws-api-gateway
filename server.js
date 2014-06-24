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
