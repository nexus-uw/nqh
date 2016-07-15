nqh (Node Q $http)
===========
[![Code Climate](https://codeclimate.com/github/nexus-uw/nqh.png)](https://codeclimate.com/github/nexus-uw/nqh) [![Test Coverage](https://codeclimate.com/github/nexus-uw/nqh/coverage.png)](https://codeclimate.com/github/nexus-uw/nqh)[![Dependency Status](https://gemnasium.com/nexus-uw/nqh.svg)](https://gemnasium.com/nexus-uw/nqh)[![NPM](https://nodei.co/npm/nqh.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nqh/)


An implementation of [Angular's $http service](https://docs.angularjs.org/api/ng/service/$http) for node

Caching Layer
-------------
The caching layer uses [tcs-de/nodecache](https://github.com/tcs-de/nodecache) as the storage system. It has 2 configuration values, stdTTL (how long to keep key/values, in seconds) and checkperiod (how often to remove expired key/values, in seconds). These are both defaulted to 0. They can be set configured through `process.env.nqh_stdTTL` and `process.env.nqh_checkperiod`.
  ie. (from the terminal) `nqh_stdTTL=3600 nqh_checkperiod=120 npm start` will start the script with a cache expiration set to 1 hr and will check for expired values every 2 minutes.

Road Map
--------
 - handle all config options
    -  xsrfHeaderName – {string} – Name of HTTP header to populate with the XSRF token.
    - xsrfCookieName – {string} – Name of cookie containing the XSRF token.
    - transformRequest – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http request body and headers and returns its transformed (typically serialized) version.
    - transformResponse – {function(data, headersGetter)|Array.<function(data, headersGetter)>} – transform function or an array of such functions. The transform function takes the http response body and headers and returns its transformed (typically deserialized) version.
    - withCredentials - {boolean} - whether to set the withCredentials flag on the XHR object. See requests with credentials for more information.
    - responseType - {string} - see requestType.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/nexus-uw/nqh/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

