/// <reference path="../typings/index.d.ts" />

'use strict';

var expect = require('chai').expect
  , q = require('q')
  , express = require('express')
  , bodyParser = require('body-parser')
  , nqh = require('../nqh')
var _ = require('lodash');


describe('nqh', function () {
  it('should exist', function () {
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
    expect(nqh.defaults).to.be.an('object');
    expect(nqh.pendingRequests).to.be.an('Array');
  });

  describe('special promise callbacks', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.get('/200', function (req, res) {
        res.status(200).send('200 OK');
      });
      server = app.listen(reqPort);

    });

    it('should call the success callback for successful calls', function (done) {
      nqh.get('http://localhost:' + reqPort + '/200')
        .success(function () {
          done();
        })
        .then(null, done);
    });

    it('should call the error callback if the request fails', function (done) {
      nqh.get('http://localhost:' + reqPort + '/404')
        .error(function () {
          done();
        });
    });

    after(function () {
      server.close();
    });
  });//GET


  describe('GET', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.get('/200', function (req, res) {
        res.status(200).send('200 OK');
      });
      app.get('/500', function (req, res) {
        res.status(500).send('NOT OK');
      });
      app.get('/401', function (req, res) {
        res.status(401).end();
      });
      server = app.listen(reqPort);

    });

    it('should make a GET request', function () {
      return nqh.get('http://localhost:' + reqPort + '/200')
        .then(function (res) {
          expect(res.headers).to.be.a('function');
          expect(res.headers('')).to.be.truely;
          expect(res.config).to.be.an('object');
          expect(res.statusText).to.be.a('string');
          expect(res.status).to.equal(200);
          expect(res.data).to.equal('200 OK');
        });
    });

    it('should reject the promise if the request fails', function () {
      return nqh.get('http://localhost:' + reqPort + '/404', null)
        .then(expect.fail, function (e) {
          expect(e).to.be.truely;
          expect(e.status).to.equal(404);
        });
    });

    it('should reject the promise if the request returned an error', function () {
      return nqh.get('http://localhost:' + reqPort + '/500')
        .then(expect.fail, function (e) {
          expect(e).to.be.truely;
          expect(e.status).to.equal(500);
        });
    });


    it('should should generate the generic http description if the server failed to send one', function () {
      return nqh.get('http://localhost:' + reqPort + '/401')
        .then(expect.fail, function (e) {
          expect(e).to.be.truely;
          expect(e.status).to.equal(401);
          expect(e.statusText).to.equal('Unauthorized');
        });
    });

    after(function () {
      server.close();
    });
  });//GET

  describe('POST', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.text())

      app.post('/201', function (req, res) {
        if (_.isObject(req.body)) {
          res.status(201).json(req.body).end();
        } else if (req.body) {
          var f = req.body;
          res.status(201).send(f).end();
        }
        else
          res.status(500).send('missing body....can not handle').end();
      });
      server = app.listen(reqPort);
    });

    it('should convert objects to json', function () {
      var expected = { json: true };
      return nqh.post('http://localhost:' + reqPort + '/201', expected, { headers: { 'Content-Type': 'application/json' } })
        .then(function (res) {
          expect(res.status).to.equal(201);
          expect(res.data).to.deep.equal(expected);
        })
    })

    it('should convert arrays to json', function () {
      var expected = [1, 2, 3];
      return nqh.post('http://localhost:' + reqPort + '/201', expected)
        .then(function (res) {
          expect(res.status).to.equal(201);
          expect(res.data).to.deep.equal(expected);
        })
    })

    it('should leave strings alone', function () {
      var expected = 'just some string';
      return nqh.post('http://localhost:' + reqPort + '/201', expected)
        .then(function (res) {
          expect(res.status).to.equal(201);
          expect(res.data).to.deep.equal(expected);
        })
    });

    it('should reject the promise if the server responds with 400 level status', function () {
      return nqh.post('http://localhost:' + reqPort + '/404')
        .then(expect.fail, function (e) {
          expect(e.status).to.equal(404);
        });
    });

    after(function () {
      server.close();
    })
  });//POST

  describe('PUT', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.use(bodyParser.json({ strict: false }))

      app.put('/201', function (req, res) {
        if (req.body)
          res.status(201).send('201 OK');
        else
          res.status(500).send('missing body....can not handle');
      });
      server = app.listen(reqPort);
    });

    it('should make a PUT request', function () {
      return nqh.put('http://localhost:' + reqPort + '/201', { my: 'body' })
        .then(function (res) {
          expect(res.status).to.equal(201);
          expect(res.data).to.equal('201 OK');
        });
    });

    after(function () {
      server.close();
    })
  });//PUT

  describe('DELETE', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.use(bodyParser.json({ strict: false }))

      app.delete('/204', function (req, res) {
        res.status(204).send();
      });
      server = app.listen(reqPort);
    });

    it('should make a PUT request', function () {
      return nqh.delete('http://localhost:' + reqPort + '/204')
        .then(function (res) {
          expect(res.status).to.equal(204);
        });
    });

    after(function () {
      server.close();
    });
  });//DELETE

  describe('HEAD', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.use(function (req, res) {
        if (req.method === 'HEAD')
          res.status(200).send('pass');
        else
          res.status(400).send('expected HEAD req')
      });
      server = app.listen(reqPort);
    });

    it('should make a HEAD request', function () {
      return nqh.head('http://localhost:' + reqPort + '/thisDoesntMatter')
        .then(function (res) {
          expect(res.status).to.equal(200);
        });
    });

    after(function () {
      server.close();
    })
  });//HEAD

  describe('JSONP', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.set("jsonp callback", true);
      app.get('/jsonp', function (req, res) {
        res.header('Content-Type', 'application/json');
        res.header('Charset', 'utf-8')
        res.send(req.query.callback + '({"something": "rather", "more": "pork", "tua": "tara"});');
      });

      server = app.listen(reqPort);
    });

    it('should make a jsonp request', function () {
      return nqh.jsonp('http://localhost:' + reqPort + '/jsonp?callback=MyMethod')
        .then(function (res) {
          expect(res.status).to.equal(200);
        });
    });

    after(function () {
      server.close();
    });
  });//HEAD

  describe('PATCH', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.use(function (req, res) {
        if (req.method === 'PATCH')
          res.status(200).send('pass');
        else
          res.status(400).send('expected PATCH req')
      });
      server = app.listen(reqPort);
    });

    it('should make a PATCH request', function () {
      return nqh.patch('http://localhost:' + reqPort + '/thisDoesntMatter')
        .then(function (res) {
          expect(res.status).to.equal(200);
        });
    });

    after(function () {
      server.close();
    });
  });//PATCH

  describe('pendingRequests', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.get('/', function (req, res) {
        res.status(200).send('ok');
      });
      server = app.listen(reqPort);
    });

    it('should put the config into the array and remove when the req completes', function () {
      var before = nqh.pendingRequests.length
      var req = nqh.get('http://localhost:' + reqPort + '/');
      expect(nqh.pendingRequests).to.have.length(before + 1);

      return req.then(function () {
        expect(nqh.pendingRequests).to.have.length(before);
      });
    });

    after(function () {
      server.close();
    });
  });//pendingRequests

  describe('Caching', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.get('/', function (req, res) {
        res.status(200).send('some random Number :' + Math.random());
      });
      app.post('/', function (req, res) {
        res.status(201).send('some random Number :' + Math.random());
      });
      server = app.listen(reqPort);
    });

    it('should cache the GET result if config.cache is true', function () {
      var firstResult;
      return nqh.get('http://localhost:' + reqPort + '/', { cache: true })
        .then(function (result) {
          firstResult = result.data;
          return nqh.get('http://localhost:' + reqPort + '/', { cache: true });
        })
        .then(function (result) {
          expect(result.data).to.equal(firstResult);
        });
    });

    it('should ignore the cache if the method is not HTTP regardless of the config', function () {
      var firstResult;
      return nqh.post('http://localhost:' + reqPort + '/', { cache: true })
        .then(function (result) {
          firstResult = result.data;
          return nqh.post('http://localhost:' + reqPort + '/', { cache: true });
        })
        .then(function (result) {
          expect(result.data).to.not.equal(firstResult);
        });
    });

    it('should not cache the result if config.cache is false', function () {
      var firstResult;
      return nqh.get('http://localhost:' + reqPort + '/', { cache: false })
        .then(function (result) {
          firstResult = result.data;
          return nqh.get('http://localhost:' + reqPort + '/', { cache: true });
        })
        .then(function (result) {
          expect(result.data).to.not.equal(firstResult);
        });
    });

    it('should skip the cache if config.cache is true', function () {
      var firstResult;
      return nqh.get('http://localhost:' + reqPort + '/', { cache: true })
        .then(function (result) {
          firstResult = result.data;
          return nqh.get('http://localhost:' + reqPort + '/', { cache: false });
        })
        .then(function (result) {
          expect(result.data).to.not.equal(firstResult);
        });
    });

    it('should build the full url before caching', function () {
      var firstResult;
      return nqh.get('http://localhost:' + reqPort + '/', { cache: true, params: { foo: 'bar' } })
        .then(function (result) {
          firstResult = result.data;
          return nqh.get('http://localhost:' + reqPort + '/', { cache: true, params: { something: 'else' } });
        })
        .then(function (result) {
          expect(result.data).to.not.equal(firstResult);
        });
    });

    after(function () {
      server.close();
    });
  });//caching

  describe('timeout', function () {
    var server
      , app
      , reqPort = 4321;

    before(function () {
      app = express();
      app.get('/', function (req, res) {
        var timeout = parseInt(req.query['timeout'])
        setTimeout(function () {
          res.status(200).send('timeout elapsed: ' + timeout);
        }, timeout);
      });

      server = app.listen(reqPort);
    });

    it('should respect the given int timeout', function () {
      return nqh.get('http://localhost:' + reqPort + '?timeout=' + 900, { timeout: 100 })
        .then(expect.fail, function (e) {
          expect(e).to.be.truely;
        });
    });

    // July 2016: request nolonger supports non number timeouts...
    xit('should respect the given promise timeout', function () {
      var promise = q.defer();
      promise.resolve();
      return nqh.get('http://localhost:' + reqPort + '?timeout=' + 900, { timeout: promise })
        .then(done, function (e) {
          expect(e).to.be.truely;
        });
    });

    after(function () {
      server.close();
    });
  });//timeout

});//nqh


