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

##### Route53 (DNS)
* `/route53/zones` returns list of hosted zones
* `/route53/:id/zone` returns information for zone specified by :id (not domain name!)
* `/route53/:id/records` returns DNS records withing specified hosted zone by :id (not domain name!)

##### Support (tickets)
The API support for interacting with Amazon AWS support cases is very limited and only in for testing.  It is not properly fetching cases, but I am unsure as to why, yet..

* `/support/cases` returns a list of cases, open or resolved, useful for identifying case ID(s)
* `/support/cases/all` returns information exchanged within all support tickets / cases.


#### TODO:
* Authenticate with gateway profile using OAuth
* Test that ACCESS_KEY and SECRET only allow limited access
* Work on Amazon "Support" -support so that I can properly view, read, and interact with support cases (trouble tickets).
