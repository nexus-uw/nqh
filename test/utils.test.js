'use strict';

var expect = require('chai').expect
  , utils = require('../lib/utils');

describe('utils',function(){


  it('should exist',function(){
    expect(utils).to.be.truely;
    expect(utils.buildUrl).to.be.a('function');
  });

  describe('buildUrl',function(){
    it('should handle no params',function(){
      expect(utils.buildUrl('http://test')).to.equal('http://test')
    });

    it('should encode strings',function(){
      var testUrl = 'http://test/test'
        , testParams = {test:'test',foo:'bar'};
      expect(utils.buildUrl(testUrl,testParams)).to.equal(testUrl+'?test=test&foo=bar');
    });

    it('should JSONify objects',function(){
      var testUrl = 'http://test/test'
        , testParams = {test:{foo:'bar'}};
      expect(utils.buildUrl(testUrl,testParams)).to.equal(testUrl+'?test=%7B%22foo%22:%22bar%22%7D')
    });

    it('should render date objects in iso',function(){
      var testDate = new Date();
      var testUrl = 'http://test/test'
        , testParams = {date:testDate};
      expect(utils.buildUrl(testUrl,testParams)).to.equal(testUrl+'?date='+testDate.toISOString())
    });
  });//buildUrl
});//utils