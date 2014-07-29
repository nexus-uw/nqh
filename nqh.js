var request = require('request')
 
  , Q = require('q')
  , nqh = module.exports = function(config) { 
  };

var makeRequest = function (url, body1, headers, method) {
  var deferred = Q.defer();
  request({
    method:method,
    url:url,
    headers:headers,
    body:JSON.stringify(body1)
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
        headers : response.headers,
        reqUrl : url
      };
      if(result.status < 400)
        deferred.resolve(result);
      else
        deferred.reject(result);
    }
  });

  return deferred.promise;
};
nqh.post = function (url, body, config) {
  var headers = config ? config.headers : {};

  return makeRequest(url, body, headers,'POST');
};

nqh.get = function (url, config) {

  var headers = config ? config.headers : {};
  return makeRequest(url, null, headers,'GET');
};

nqh.delete = function(url,config){
  var headers = config ? config.headers : {};
  return makeRequest(url, null, headers,'DELETE');
};

nqh.put = function(url, body, config) {
  var headers = config ? config.headers : {};
  return makeRequest(url, null, headers,'PUT');
};

nqh.head = function(url, config) {
  var headers = config ? config.headers : {};

  return makeRequest(url, null, headers,'HEAD');
};

nqh.jsonp = function(url, config) {
  throw new Error('JSONP not implemented');
  //https://www.npmjs.org/package/jsonp-utils  
  var headers = config ? config.headers : {};

};

nqh.patch = function(url, data, config){
  var headers = config ? config.headers : {};

  return makeRequest(url, null, headers,'PATCH');
};

nqh.pendingRequests = [];
