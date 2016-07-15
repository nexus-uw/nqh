/// <reference path="../typings/index.d.ts" />

'use strict';

var expect = require('chai').expect
  , utils = require('../lib/utils');

describe('utils',function(){


  it('should exist',function(){
    expect(utils).to.be.truely;
    expect(utils.buildUrl).to.be.a('function');
    expect(utils.isJSON).to.be.a('function');
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

  describe('isJSON',function(){
    it('should find "content-type":"application/json"',function(){
      expect(utils.isJSON({'content-type':'application/json'})).to.be.true;
    });

    it('should return false if no "content-type" is present',function(){
      expect(utils.isJSON({})).to.be.false;
    });

     it('should return false if no headers are given',function(){
      expect(utils.isJSON()).to.be.false;
    });

    it('should return false if "content-type" is not json',function(){
      expect(utils.isJSON({'content-type':'application/notjson'})).to.be.false;

    });

    it('should return true if "Content-Type" is json',function(){
      expect(utils.isJSON({'Content-Type':'Application/JSON'})).to.be.true;
    });
  });
});//utils
