aws-api-gateway
===============

A gateway to Amazon AWS API using NodeJS.

### Brainstorming Notes
The objective of this gateway is to provide an accessible interface to Amazon's AWS API using a modest REST API that provides access to popular functions.  YES, there are plenty of officially supported Amazon AWS SDK(s) available, but there are numerous languages that do not have a SDK or the environment needing access does not have the ability to run them, therefore the gateway came to mind.

For example, an application built using Golang needs access to list s3 buckets within my Amazon AWS account and region, but because the SDK does not exist; what to do?  The Golang application can send a simple HTTP/HTTPS request to the gateway endpoint and it will deliver back the required data via json.

#### REST API
Numerous prelimary routes have been added for the REST API.

##### S3
* `/buckets` lists S3 buckets
* `/bucket/:name/location` returns location information about bucket specified by :name
* `/bucket/:name/objects` returns list of objects within bucket specified by :name
* `/bucket/:name/policy` returns policy for bucket specified by :name
* `/bucket/:name/lifecycle` returns lifecycle attributes for bucket specified by :name

##### ELB (Elastic Load Balancer)
* `/elbs` returns list of elastic load balancers and their configuration details
* `/elb/:name` returns configuration details for load balanecer specified by :name
* `/elb/:name/health` returns the state of the instances associated with load balancer specified by :name

#### TODO:
* Authenticate with gateway profile using OAuth
* Test that ACCESS_KEY and SECRET only allow limited access
* ...
