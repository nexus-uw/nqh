
var utils = module.exports;
var inspect = require('util').inspect;
var _ = require('lodash');


//from https://github.com/angular/angular.js/blob/master/src/ng/http.js#L981
//taken aug 2 2014
utils.buildUrl = function (url, params) {
  function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).
          replace(/%40/gi, '@').
          replace(/%3A/gi, ':').
          replace(/%24/g, '$').
          replace(/%2C/gi, ',').
          replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
      }


  if (!params) return url;
  var parts = [];
  _.forEach(params, function(value, key) {
    if (value === null || _.isUndefined(value)) return;
    if (!_.isArray(value)) value = [value];

    _.forEach(value, function(v) {
      if (_.isObject(v)) {
        if (_.isDate(v)){
          v = v.toISOString();
        } else  {
          v = JSON.stringify(v);
        }
      }
      parts.push(encodeUriQuery(key) + '=' +
                 encodeUriQuery(v));
    });
  });
  if(parts.length > 0) {
    url += ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');
  }
  return url;
};//buildUrl

