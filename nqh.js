var request = require('request');
var  Q = require('q');
var _ = require('lodash');

//returns a promise that resolves to an object with the following properties
// data – string|Object – The response body transformed with the transform functions.
// status – number – HTTP status code of the response.
// headers – function([headerName]) – Header getter function.
// config – Object – The configuration object that was used to generate the request.
// statusText – string – HTTP status text of the response.
var nqh = module.exports = function(config) {
  var deferred = Q.defer();
  nqh.pendingRequests.push(config);

  request({
    method:config.method,
    url:config.url,
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
        statusText : response.statusCode + ' ' + response.statusCode <= 299 && response.statusCode >= 200 ? 'OK':'FAILED'
      };
      if(result.status <= 299 && result.status >= 200){
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
