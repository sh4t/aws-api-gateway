var express = require('express');
var redis = require('redis');
var db = redis.createClient();
var app = express();
var expressHbs = require('express3-handlebars');

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

var AWS = require('aws-sdk');
var uuid = require('node-uuid');

AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3();
var elb = new AWS.ELB();
var route53 = new AWS.Route53();
var support = new AWS.Support();

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

app.get('/', function(req, res){
  res.render('index');
});

app.get('/buckets', function(req, res, next){
	var ua = req.headers['user-agent'];
	db.zadd('online_list_buckets', Date.now(), ua, next);
	res.json(bucket_list);
});

app.get('/bucket/:name/location', function(req, res) {
	s3.getBucketLocation(params={Bucket: req.params.name}, function(err, data) {
  	  if (err) console.log(err, err.stack);
  	  else {
  		  res.json(data);
  	  }
	});
});

app.get('/bucket/:name/objects', function(req, res) { 
	var params = {
	  Bucket: req.params.name, // required
	  // Delimiter: 'STRING_VALUE',
	  // EncodingType: 'url',
	  // Marker: 'STRING_VALUE',
	  // MaxKeys: 0,
	  // Prefix: 'STRING_VALUE'
	};
	s3.listObjects(params, function(err, data) {
  	  if (err) console.log(err, err.stack);
  	  else {
  		  res.json(data);
  	  }
	});
});

app.get('/bucket/:name/policy', function(req, res) {
	var params = {
	  Bucket: req.params.name // required
	};
	s3.getBucketPolicy(params, function(err, data) {
  	  if (err) console.log(err, err.stack);
  	  else {
  		  res.json(data);
  	  }
	});
	
});

app.get('/elbs', function(req, res) {
	elb.describeLoadBalancers(function(err, data) {
	  if (err) console.log(err, err.stack);
	  else {
		  res.json(data);
	  }
	});	
});

app.get('/elb/:name', function(req, res) {
	var params = {
		LoadBalancerNames: [ req.params.name ]
	}
	elb.describeLoadBalancers(params, function(err, data) {
		if (err) console.log(err, err.stack); 
		else {
			res.json(data);
		}
	});
});

app.get('/elb/:name/health', function(req, res) {
	var params = {
	  LoadBalancerName: req.params.name
	};
	elb.describeInstanceHealth(params, function(err, data) {
		if (err) console.log(err, err.stack); 
		else {
			res.json(data);
		}
	});
});

app.get('/route53/zones', function(req, res) {
	route53.listHostedZones(function(err, data) {
		if (err) console.log(err, err.stack); 
		else {
			res.json(data);
		}
	});
});

app.get('/route53/:id/zone', function(req, res) {
	var params = {
	  Id: req.params.id
	};
	route53.getHostedZone(params, function(err, data) {
		if (err) console.log(err, err.stack); 
		else {
			res.json(data);
		}
	});	
});

app.get('/route53/:id/records', function(req, res) {
	var params = {
	  HostedZoneId: req.params.id // required
	};
	route53.listResourceRecordSets(params, function(err, data) {
		if (err) console.log(err, err.stack); 
		else {
			res.json(data);
		}
	});	
});

app.get('/support/cases', function(req,res) {
	var params = {
	  caseId: 'STRING_VALUE' // required
	};
	support.describeCommunications(params, function(err, data) {
		if (err) console.log(err, err.stack); 
		else {
			res.json(data);
		}
	});
});

app.get('/support/cases/all', function(req, res){
	var params = {
	};
	support.describeCases(params, function(err, data) {
		if (err) console.log(err, err.stack); 
		else {
			res.json(data);
		}
	});
});
// app.get('/bucket/:name/lifecycle', function(req, res) {
// 	s3.getBucketLifecycle(params={Bucket: req.params.name}, function(err, data) {
// 	  if (err) console.log(err, err.stack); // an error occurred
// 	  else     res.json(data);           // successful response
// 	});
// });

// app.get('/test', function(req, res){
//
// 	s3.listBuckets(function(err, data) {
// 	    if (err)
// 	        console.log(err, err.stack); // experienced error
// 	    else
// 			bucket_list = data
// 	});
//
//   res.render('test', bucket_list);
// });

var server = app.listen(5000, function() {
    console.log('Listening on port %d', server.address().port);
});