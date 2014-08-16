var request = require('request');
var  Q = require('q');
var _ = require('lodash');
var utils = require('./lib/utils');
var hstd = require('http-status-to-description');
var NodeCache = require( "node-cache" );

//caching layer
var cache = new NodeCache({
  stdTTL : process.env.nqh_stdTTL || 0,
  checkperiod : process.env.nqh_checkperiod || 0
});


//returns a promise that resolves to an object with the following properties
// data – string|Object – The response body transformed with the transform functions.
// status – number – HTTP status code of the response.
// headers – function([headerName]) – Header getter function.
// config – Object – The configuration object that was used to generate the request.
// statusText – string – HTTP status text of the response.
var nqh = module.exports = function(config) {
  var deferred = Q.defer();

  //if the request is set to cache the GET result
  // and the url is found in the cache, then return the value and exit
  if(config.cache && config.method === 'GET'){
    var cached = cache.get(config.url)[config.url];
    if(cached){
      deferred.resolve(cached);
      return deferred.promise;
    }
  }

  nqh.pendingRequests.push(config);

  request({
    method:config.method,
    url : utils.buildUrl(config.url,config.params),
    headers:config.headers,
    body:JSON.stringify(config.body)
  },function (error, response, body) {
    _.remove(nqh.pendingRequests,config);
    if(error){
      deferred.reject(error);
    }else {
      var data;
      //TODO: actually handle response data type
      try{
        data = JSON.parse(body);
      }catch(e){
        data = body;
      }
      var result = {
        data : data,
        status : response.statusCode,
        headers : function(headerName){return response.headers[headerName];},
        config : config,
        statusText :  !_.isUndefined(data) && !_.isNull(data) && data ? data : hstd(response.statusCode)
      };
      if(result.status <= 299 && result.status >= 200){
        if(config.cache && config.method === 'GET'){
          cache.set(config.url,result);
        }
        deferred.resolve(result);
      }else{
        deferred.reject(result);
      }
    }
    return deferred.promise;
  });

  deferred.promise.success = function(fn) {
        deferred.promise.then(function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return deferred.promise;
      };

  deferred.promise.error = function(fn) {
        deferred.promise.then(null, function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return deferred.promise;
      };

  return deferred.promise;

};

var formShortCut = function(method,url,config,body){
  if(typeof config === 'undefined' || ! config){
    config = {};
  }
  config.method = method;
  config.url = url;
  config.body = body;
  return nqh(config);
}

/*--- shortcut methods ----*/

nqh.post = function (url, body, config) {
  return formShortCut('POST',url,config,body);
};

nqh.get = function (url, config) {
  return formShortCut('GET',url,config);
};

nqh.delete = function(url,config){
  return formShortCut('DELETE',url,config);
};

nqh.put = function(url, body, config) {
  return formShortCut('PUT',url,config,body);
};

nqh.head = function(url, config) {
  return formShortCut('HEAD',url,config);
};

nqh.jsonp = function(url, config) {
  return formShortCut('GET',url,config);
};

nqh.patch = function(url, body, config){
  return formShortCut('PATCH',url,config,body);
};

nqh.pendingRequests = [];

nqh.defaults = {};
