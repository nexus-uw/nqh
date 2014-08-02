var request = require('request')

  , Q = require('q');
  //returns a promise that resolves to an object with the following properties
// data – {string|Object} – The response body transformed with the transform functions.
// status – {number} – HTTP status code of the response.
// headers – {function([headerName])} – Header getter function.
// config – {Object} – The configuration object that was used to generate the request.
// statusText – {string} – HTTP status text of the response.
var nqh = module.exports = function(config) {
  var deferred = Q.defer();
  request({
    method:config.method,
    url:config.url,
    headers:config.headers,
    body:JSON.stringify(config.body)
  },function (error, response, body) {
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
        statusText : response.statusCode + ' ' + response.statusCode <= 299 && response.statusCode >= 200 ? 'OK':'FAILED'
      };
      if(result.status <= 299 && result.status >= 200)
        deferred.resolve(result);
      else
        deferred.reject(result);
    }
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

/*--- shortcut methods ----*/

nqh.post = function (url, body, config) {
  if(typeof config === 'undefined' || ! config){
    config = {};
  }
  config.method = 'POST';
  config.url = url;
  config.body = body;
  return this(config);
};

nqh.get = function (url, config) {
  if(typeof config === 'undefined' || ! config){
    config = {};
  }
  config.method = 'GET';
  config.url = url;
  return this(config);
};

nqh.delete = function(url,config){
 if(typeof config === 'undefined' || ! config){
    config = {};
  }
  config.method = 'DELETE';
  config.url = url;
  return this(config);
};

nqh.put = function(url, body, config) {
  if(typeof config === 'undefined' || ! config){
    config = {};
  }
  config.method = 'PUT';
  config.url = url;
  config.body = body;
  return this(config);
};

nqh.head = function(url, config) {
 if(typeof config === 'undefined' || ! config){
    config = {};
  }
  config.method = 'HEAD';
  config.url = url;
  return this(config);
};

nqh.jsonp = function(url, config) {
  throw new Error('JSONP not implemented');
  //https://www.npmjs.org/package/jsonp-utils
  var headers = config ? config.headers : {};

};

nqh.patch = function(url, data, config){
  if(typeof config === 'undefined' || ! config){
    config = {};
  }
  config.method = 'PATCH';
  config.url = url;
  return this(config);
};

nqh.pendingRequests = [];
