nqh (Node Q $http)
===========
[![Code Climate](https://codeclimate.com/github/nexus-uw/nqh.png)](https://codeclimate.com/github/nexus-uw/nqh) [![Test Coverage](https://codeclimate.com/github/nexus-uw/nqh/coverage.png)](https://codeclimate.com/github/nexus-uw/nqh)[![Dependency Status](https://gemnasium.com/nexus-uw/nqh.svg)](https://gemnasium.com/nexus-uw/nqh)


An implementation of [Angular's $http service](https://docs.angularjs.org/api/ng/service/$http) for node

Caching Layer
-------------
The caching layer uses [tcs-de/nodecache](https://github.com/tcs-de/nodecache) as the storage system. It has 2 configuration values, stdTTL (how long to keep key/values, in seconds) and checkperiod (how often to remove expired key/values, in seconds). These are both defaulted to 0. They can be set configured through `process.env.nqh_stdTTL` and `process.env.nqh_checkperiod`.
  ie. (from the terminal) `nqh_stdTTL=3600 nqh_checkperiod=120 npm start` will start the script with a cache expiration set to 1 hr and will check for expired values every 2 minutes.

Road Map
--------
 - handle all config options
