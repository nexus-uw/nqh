'use strict';

var expect = require('chai').expect
  , q = require('q')
  , express = require('express')
  , bodyParser = require('body-parser')
  , nqh = require('../nqh');

describe('nqh',function(){
  it('should exist',function(){
    expect(nqh).to.be.defined;
    expect(nqh).to.be.a('function');
    expect(nqh({}).success).to.be.a('function');
    expect(nqh({}).error).to.be.a('function');
    expect(nqh.get).to.be.a('function');
    expect(nqh.put).to.be.a('function');
    expect(nqh.post).to.be.a('function');
    expect(nqh.delete).to.be.a('function');
    expect(nqh.head).to.be.a('function');
    expect(nqh.jsonp).to.be.a('function');
    expect(nqh.patch).to.be.a('function');
  });

   describe('special promise callbacks',function(){
    var server
      , app
      , reqPort = 4321;

    before(function(){
      app = express();
      app.get('/200', function(req, res){
        res.status(200).send('200 OK');
      });
      server = app.listen(reqPort);

    });

    it('should call the success callback for successful calls',function(done){
      nqh.get('http://localhost:'+reqPort+'/200')
        .success(function(){
          done();
        })
        .then(null,done);
    });

    it('should call the error callback if the request fails',function(done){
      nqh.get('http://localhost:'+reqPort+'/404')
        .error(function(){
          done();
        });
    });

    after(function(){
      server.close();
    })
  });//GET


  describe('GET',function(){
    var server
      , app
      , reqPort = 4321;

    before(function(){
      app = express();
      app.get('/200', function(req, res){
        res.status(200).send('200 OK');
      });
      server = app.listen(reqPort);

    });

    it('should make a GET request',function(done){
      nqh.get('http://localhost:'+reqPort+'/200')
        .then(function(res){
          expect(res.status).to.equal(200);
          expect(res.data).to.equal('200 OK');
          done();
        })
        .then(null,done);
    });

    it('should reject the promise if the request fails',function(done){
      nqh.get('http://localhost:'+reqPort+'/404')
        .then(done,function(e){
          expect(e).to.be.truely;
          expect(e.status).to.equal(404);
          done();
        })
        .then(null,done);
    });

    after(function(){
      server.close();
    })
  });//GET

  describe('POST',function(){
    var server
      , app
      , reqPort = 4321;

    before(function(){
      app = express();
      app.use(bodyParser.json({strict:false}))

      app.post('/201', function(req, res){
        if(req.body)
          res.status(201).send('201 OK');
        else
          res.status(500).send('missing body....can not handle');
      });
      server = app.listen(reqPort);
    });

    it('should make a POST request',function(done){
      nqh.post('http://localhost:'+reqPort+'/201',{my:'body'})
        .then(function(res){
          expect(res.status).to.equal(201);
          expect(res.data).to.equal('201 OK');
          done();
        })
        .then(null,done);
    });

    it('should reject the promise if the server responds with 400 level status',function(done){
      nqh.post('http://localhost:'+reqPort+'/404')
        .then(done,function(e){
          expect(e.status).to.equal(404);
          done();
        })
        .then(null,done);
    });

    after(function(){
      server.close();
    })
  });//POST

  describe('PUT',function(){
    var server
      , app
      , reqPort = 4321;

    before(function(){
      app = express();
      app.use(bodyParser.json({strict:false}))

      app.put('/201', function(req, res){
        if(req.body)
          res.status(201).send('201 OK');
        else
          res.status(500).send('missing body....can not handle');
      });
      server = app.listen(reqPort);
    });

    it('should make a PUT request',function(done){
      nqh.put('http://localhost:'+reqPort+'/201',{my:'body'})
        .then(function(res){
          expect(res.status).to.equal(201);
          expect(res.data).to.equal('201 OK');
          done();
        })
        .then(null,done);
    });

    after(function(){
      server.close();
    })
  });//PUT

  describe('DELETE',function(){
    var server
      , app
      , reqPort = 4321;

    before(function(){
      app = express();
      app.use(bodyParser.json({strict:false}))

      app.delete('/204', function(req, res){
        res.status(204).send();
      });
      server = app.listen(reqPort);
    });

    it('should make a PUT request',function(done){
      nqh.delete('http://localhost:'+reqPort+'/204')
        .then(function(res){
          expect(res.status).to.equal(204);
          done();
        })
        .then(null,done);
    });

    after(function(){
      server.close();
    })
  });//DELETE

  describe('HEAD',function(){
    var server
      , app
      , reqPort = 4321;

    before(function(){
      app = express();
      app.use(function(req,res){
        if(req.method ==='HEAD')
          res.status(200).send('pass');
        else
          res.status(400).send('expected HEAD req')
      });
      server = app.listen(reqPort);
    });

    it('should make a HEAD request',function(done){
      nqh.head('http://localhost:'+reqPort+'/thisDoesntMatter')
        .then(function(res){
          expect(res.status).to.equal(200);
          done();
        })
        .then(null,done);
    });

    after(function(){
      server.close();
    })
  });//HEAD

  describe('JSONP',function(){
    var server
      , app
      , reqPort = 4321;

    before(function(){
      app = express();
      app.use(function(req,res){
        if(req.method ==='jsonp')
          res.status(200).send('pass');
        else
          res.status(400).send('expected jsonp req')
      });
      server = app.listen(reqPort);
    });

    xit('should make a jsonp request',function(done){
      nqh.jsonp('http://localhost:'+reqPort+'/jsonp')
        .then(function(res){
          expect(res.status).to.equal(200);
          done();
        })
        .then(null,done);
    });

    after(function(){
      server.close();
    })
  });//HEAD

  describe('PATCH',function(){
    var server
      , app
      , reqPort = 4321;

    before(function(){
      app = express();
      app.use(function(req,res){
        if(req.method ==='PATCH')
          res.status(200).send('pass');
        else
          res.status(400).send('expected PATCH req')
      });
      server = app.listen(reqPort);
    });

    it('should make a PATCH request',function(done){
      nqh.patch('http://localhost:'+reqPort+'/thisDoesntMatter')
        .then(function(res){
          expect(res.status).to.equal(200);
          done();
        })
        .then(null,done);
    });

    after(function(){
      server.close();
    })
  });//PATCH

});//nqh


