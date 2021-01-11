(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.uniformdev = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));





}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":5}],2:[function(require,module,exports){
'use strict';
require('es6-promise').polyfill();

module.exports = function (fetch, defaults) {
  defaults = defaults || {};
  if (typeof fetch !== 'function') {
    throw new ArgumentError('fetch must be a function');
  }

  if (typeof defaults !== 'object') {
    throw new ArgumentError('defaults must be an object');
  }

  if (defaults.retries !== undefined && !isPositiveInteger(defaults.retries)) {
    throw new ArgumentError('retries must be a positive integer');
  }

  if (defaults.retryDelay !== undefined && !isPositiveInteger(defaults.retryDelay) && typeof defaults.retryDelay !== 'function') {
    throw new ArgumentError('retryDelay must be a positive integer or a function returning a positive integer');
  }

  if (defaults.retryOn !== undefined && !Array.isArray(defaults.retryOn) && typeof defaults.retryOn !== 'function') {
    throw new ArgumentError('retryOn property expects an array or function');
  }

  var baseDefaults = {
    retries: 3,
    retryDelay: 1000,
    retryOn: [],
  };

  defaults = Object.assign(baseDefaults, defaults);

  return function fetchRetry(input, init) {
    var retries = defaults.retries;
    var retryDelay = defaults.retryDelay;
    var retryOn = defaults.retryOn;

    if (init && init.retries !== undefined) {
      if (isPositiveInteger(init.retries)) {
        retries = init.retries;
      } else {
        throw new ArgumentError('retries must be a positive integer');
      }
    }

    if (init && init.retryDelay !== undefined) {
      if (isPositiveInteger(init.retryDelay) || (typeof init.retryDelay === 'function')) {
        retryDelay = init.retryDelay;
      } else {
        throw new ArgumentError('retryDelay must be a positive integer or a function returning a positive integer');
      }
    }

    if (init && init.retryOn) {
      if (Array.isArray(init.retryOn) || (typeof init.retryOn === 'function')) {
        retryOn = init.retryOn;
      } else {
        throw new ArgumentError('retryOn property expects an array or function');
      }
    }

    // eslint-disable-next-line no-undef
    return new Promise(function (resolve, reject) {
      var wrappedFetch = function (attempt) {
        fetch(input, init)
          .then(function (response) {
            if (Array.isArray(retryOn) && retryOn.indexOf(response.status) === -1) {
              resolve(response);
            } else if (typeof retryOn === 'function') {
              if (retryOn(attempt, null, response)) {
                retry(attempt, null, response);
              } else {
                resolve(response);
              }
            } else {
              if (attempt < retries) {
                retry(attempt, null, response);
              } else {
                resolve(response);
              }
            }
          })
          .catch(function (error) {
            if (typeof retryOn === 'function') {
              if (retryOn(attempt, error, null)) {
                retry(attempt, error, null);
              } else {
                reject(error);
              }
            } else if (attempt < retries) {
              retry(attempt, error, null);
            } else {
              reject(error);
            }
          });
      };

      function retry(attempt, error, response) {
        var delay = (typeof retryDelay === 'function') ?
          retryDelay(attempt, error, response) : retryDelay;
        setTimeout(function () {
          wrappedFetch(++attempt);
        }, delay);
      }

      wrappedFetch(0);
    });
  };
};

function isPositiveInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function ArgumentError(message) {
  this.name = 'ArgumentError';
  this.message = message;
}

},{"es6-promise":1}],3:[function(require,module,exports){
module.exports = window.fetch || (window.fetch = require('unfetch').default || require('unfetch'));

},{"unfetch":7}],4:[function(require,module,exports){
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(definition);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";
    var isIE = (typeof window !== undefinedType) && (typeof window.navigator !== undefinedType) && (
        /Trident\/|MSIE /.test(window.navigator.userAgent)
    );

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Trace() doesn't print the message in IE, so for that case we need to wrap it
    function traceForIE() {
        if (console.log) {
            if (console.log.apply) {
                console.log.apply(console, arguments);
            } else {
                // In old IE, native console methods themselves don't have apply().
                Function.prototype.apply.apply(console.log, [console, arguments]);
            }
        }
        if (console.trace) console.trace();
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (methodName === 'trace' && isIE) {
            return traceForIE;
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    return defaultLogger;
}));

},{}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
'use strict';

const destroyCircular = (from, seen) => {
	const to = Array.isArray(from) ? [] : {};

	seen.push(from);

	for (const [key, value] of Object.entries(from)) {
		if (typeof value === 'function') {
			continue;
		}

		if (!value || typeof value !== 'object') {
			to[key] = value;
			continue;
		}

		if (!seen.includes(from[key])) {
			to[key] = destroyCircular(from[key], seen.slice());
			continue;
		}

		to[key] = '[Circular]';
	}

	const commonProperties = [
		'name',
		'message',
		'stack',
		'code'
	];

	for (const property of commonProperties) {
		if (typeof from[property] === 'string') {
			to[property] = from[property];
		}
	}

	return to;
};

const serializeError = value => {
	if (typeof value === 'object') {
		return destroyCircular(value, []);
	}

	// People sometimes throw things besides Error objects…
	if (typeof value === 'function') {
		// `JSON.stringify()` discards functions. We do too, unless a function is thrown directly.
		return `[Function: ${(value.name || 'anonymous')}]`;
	}

	return value;
};

module.exports = serializeError;
// TODO: Remove this for the next major release
module.exports.default = serializeError;

},{}],7:[function(require,module,exports){
module.exports=function(e,n){return n=n||{},new Promise(function(t,r){var s=new XMLHttpRequest,o=[],u=[],i={},a=function(){return{ok:2==(s.status/100|0),statusText:s.statusText,status:s.status,url:s.responseURL,text:function(){return Promise.resolve(s.responseText)},json:function(){return Promise.resolve(JSON.parse(s.responseText))},blob:function(){return Promise.resolve(new Blob([s.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return u},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}};for(var l in s.open(n.method||"get",e,!0),s.onload=function(){s.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(e,n,t){o.push(n=n.toLowerCase()),u.push([n,t]),i[n]=i[n]?i[n]+","+t:t}),t(a())},s.onerror=r,s.withCredentials="include"==n.credentials,n.headers)s.setRequestHeader(l,n.headers[l]);s.send(n.body||null)})};


},{}],8:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./utils"), exports);
__exportStar(require("./model"), exports);

},{"./model":16,"./utils":23}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderingType = void 0;
var RenderingType;
(function (RenderingType) {
    RenderingType["mvc"] = "MvcRendering";
    RenderingType["javascript"] = "JavaScriptRendering";
})(RenderingType = exports.RenderingType || (exports.RenderingType = {}));

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],16:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./DataItem"), exports);
__exportStar(require("./DataSourceItem"), exports);
__exportStar(require("./PageItem"), exports);
__exportStar(require("./PageMvcNode"), exports);
__exportStar(require("./RenderingContext"), exports);
__exportStar(require("./RenderingNode"), exports);
__exportStar(require("./TrackingNode"), exports);

},{"./DataItem":9,"./DataSourceItem":10,"./PageItem":11,"./PageMvcNode":12,"./RenderingContext":13,"./RenderingNode":14,"./TrackingNode":15}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLayout = void 0;
var common_1 = require("@uniformdev/common");
var _1 = require(".");
var __1 = require("..");
function buildLayout(props, initial) {
    if (initial === void 0) { initial = false; }
    var page = props.item, home = props.home, datasources = props.datasources, html = props.html, uniformContext = props.uniformContext;
    if (!page)
        throw new Error('no page');
    if (!datasources)
        throw new Error('no datasources');
    if (!html)
        throw new Error('no html');
    // if (!components) throw new Error('no components');
    // it's okay because of magic button if (Object.getOwnPropertyNames(components).length <= 0) throw new Error('components are empty');
    var logger = !uniformContext || !uniformContext.logger ? _1.noopLogger : uniformContext.logger;
    logger.debug('Rendering dynamic layout of ' + page.id);
    var placeholders = {};
    var renderings = page.renderings;
    if (!renderings)
        throw new Error('no renderings');
    for (var i = 0; i < renderings.length; ++i) {
        var r = renderings[i];
        if (!r || !r.id) {
            logger.error('Rendering #' + i + ' has no id: ', JSON.stringify(r ? r.id : "undefined rendering"));
            continue;
        }
        var placeholder = (r.placeholder || '').trim().toLowerCase() || 'main';
        var rawDatasource = r.settings.DataSource ? r.settings.DataSource.toLowerCase() : '';
        var datasource = common_1.tryParseGuid(rawDatasource);
        var tagName = r.componentName;
        var dataSourceItem = (datasource && datasources[datasource]) || undefined;
        if (datasource && !dataSourceItem && r.renderingType !== __1.RenderingType.mvc) {
            logger.warn("The '" + (tagName || r.id) + "' component's datasource '" + datasource + "' ('" + rawDatasource + "') cannot be resolved.");
            continue;
        }
        var item = dataSourceItem || page;
        var rendering = {
            id: common_1.tryParseGuid(r.id),
            renderingId: common_1.tryParseGuid(r.renderingId),
            renderingType: r.renderingType,
            componentName: tagName,
            settings: r.settings,
            datasource: datasource || '',
            hidden: false,
            renderingContext: {
                item: item,
                page: page,
                home: home || page,
                placeholders: placeholders,
                datasources: datasources,
                html: html,
            },
        };
        if (initial) {
            if (r.settings.Rules) {
                var rules = r.settings.Rules.Rules;
                if (rules && rules.length > 0) {
                    for (var i_1 = 0; i_1 < rules.length; ++i_1) {
                        var rule = rules[i_1];
                        if (rule.UniqueId === '00000000-0000-0000-0000-000000000000') {
                            var actions = rule.Actions;
                            if (actions && actions.length > 0) {
                                for (var j = 0; j < actions.length; ++j) {
                                    var action = actions[j];
                                    if (action.type === 'Sitecore.Rules.ConditionalRenderings.HideRenderingAction') {
                                        rendering.hidden = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!placeholders.hasOwnProperty(placeholder)) {
            placeholders[placeholder] = [];
        }
        placeholders[placeholder].push(rendering);
        logger.debug('Registering ' + rendering.renderingId + ' to ' + placeholder);
    }
    return placeholders;
}
exports.buildLayout = buildLayout;

},{".":23,"..":8,"@uniformdev/common":31}],20:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDataItemToRuntimeItem = void 0;
function convertDataItemToRuntimeItem(dataItem, name, url) {
    if (!dataItem) {
        return null;
    }
    var item = __assign(__assign({}, dataItem), { name: name || dataItem.name, children: [] });
    if (url || dataItem.url) {
        item.url = url || dataItem.url;
    }
    var childrenMap = dataItem.children;
    for (var childName in childrenMap) {
        if (!childrenMap.hasOwnProperty(childName))
            continue;
        var child = childrenMap[childName];
        var childUrl = !url
            ? undefined
            : url + (url.endsWith('/') ? '' : '/') + childName + (url.endsWith('/') ? '' : '/');
        item.children.push(convertDataItemToRuntimeItem(child, childName, childUrl));
    }
    return item;
}
exports.convertDataItemToRuntimeItem = convertDataItemToRuntimeItem;

},{}],21:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageProps = exports.getHtml = exports.getDatasources = exports.getDataItem = exports.getPageItem = void 0;
var common_1 = require("@uniformdev/common");
var common_2 = require("@uniformdev/common");
var getPageUrl_1 = require("./getPageUrl");
var convertDataItemToRuntimeItem_1 = require("./convertDataItemToRuntimeItem");
var noopLogger_1 = require("./noopLogger");
function getPageItem(path, logger, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDataItem(path, 'page', logger, config)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getPageItem = getPageItem;
var readFileAsync = typeof window === 'undefined'
    ? eval("(require('util').promisify)(require('fs').readFile)")
    : undefined;
var existsAsync = typeof window === 'undefined'
    ? eval("(require('util').promisify)(require('fs').exists)")
    : undefined;
function getDataItem(path, type, logger, config) {
    return __awaiter(this, void 0, void 0, function () {
        var filename, _a, _b, itemUrl, response, item;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(readFileAsync && existsAsync)) return [3 /*break*/, 3];
                    filename = 'public/uniform/api/content/' + config.UNIFORM_API_SITENAME + '/' + type + path;
                    if (filename.endsWith('/')) {
                        filename = filename.substring(0, filename.length - 1);
                    }
                    filename += '.json';
                    return [4 /*yield*/, existsAsync(filename)];
                case 1:
                    if (!_c.sent()) return [3 /*break*/, 3];
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, readFileAsync(filename)];
                case 2: return [2 /*return*/, _b.apply(_a, [(_c.sent()).toString()])];
                case 3:
                    itemUrl = getPageUrl_1.getPageUrl(path, type, config);
                    logger.debug('Making HTTP request (data): ' + itemUrl);
                    return [4 /*yield*/, common_1.fetchWithRetry(logger, itemUrl, 3)];
                case 4:
                    response = _c.sent();
                    if (response.status !== 200) {
                        throw new Error("No item, ajax request to " + response.url + " returned " + response.status + " code, text: " + response.statusText);
                    }
                    return [4 /*yield*/, response.json()];
                case 5:
                    item = _c.sent();
                    if (!item.id)
                        throw new Error('no item.id, ' + itemUrl + ', ' + JSON.stringify(item));
                    return [2 /*return*/, convertDataItemToRuntimeItem_1.convertDataItemToRuntimeItem(item, undefined, path)];
            }
        });
    });
}
exports.getDataItem = getDataItem;
function getDatasources(page) {
    return __awaiter(this, void 0, void 0, function () {
        var pageDatasources, datasources, id, datasource, guid;
        return __generator(this, function (_a) {
            pageDatasources = page.datasources || {};
            datasources = {};
            for (id in pageDatasources) {
                if (!pageDatasources.hasOwnProperty(id))
                    continue;
                datasource = convertDataItemToRuntimeItem_1.convertDataItemToRuntimeItem(pageDatasources[id], undefined, undefined);
                guid = common_2.parseGuid(id);
                datasources[guid] = datasource;
            }
            return [2 /*return*/, datasources];
        });
    });
}
exports.getDatasources = getDatasources;
function getHtml(page) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, ((_a = page.mvc) === null || _a === void 0 ? void 0 : _a.html) || {}];
        });
    });
}
exports.getHtml = getHtml;
function getPageProps(asPath, config, logger) {
    if (logger === void 0) { logger = noopLogger_1.noopLogger; }
    return __awaiter(this, void 0, void 0, function () {
        var path, item, home, datasources, html, props;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.debug("Rendering page with path: " + asPath);
                    if (asPath && asPath.startsWith('/-'))
                        throw new Error('Must not be handled by page!');
                    path = asPath + (asPath.endsWith('/') ? '' : '/');
                    return [4 /*yield*/, getPageItem(path, logger, config)];
                case 1:
                    item = _a.sent();
                    home = item;
                    return [4 /*yield*/, getDatasources(item)];
                case 2:
                    datasources = _a.sent();
                    return [4 /*yield*/, getHtml(item)];
                case 3:
                    html = _a.sent();
                    if (!item) {
                        throw new Error('No context item passed');
                    }
                    logger.debug("Resolved page '" + path + "'");
                    props = {
                        datasources: datasources,
                        html: html,
                        item: item,
                        page: item,
                        home: home,
                        path: path,
                    };
                    return [2 /*return*/, props];
            }
        });
    });
}
exports.getPageProps = getPageProps;

},{"./convertDataItemToRuntimeItem":20,"./getPageUrl":22,"./noopLogger":24,"@uniformdev/common":31}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageUrl = void 0;
var common_1 = require("@uniformdev/common");
function getPageUrl(itemPath, type, config) {
    var sitename = config.UNIFORM_API_SITENAME;
    var path = common_1.trim(itemPath, '/');
    if (!path) {
        path = '';
    }
    var url = '/uniform/api/content/' + sitename + '/';
    if (path) {
        url += type + '/' + path + '.json';
    }
    else {
        url += type + '.json';
    }
    return common_1.getApiUrlWithToken(config, url);
}
exports.getPageUrl = getPageUrl;

},{"@uniformdev/common":31}],23:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./buildLayout"), exports);
__exportStar(require("./convertDataItemToRuntimeItem"), exports);
__exportStar(require("./popVisibleRenderingsFromPlaceholdersMap"), exports);
__exportStar(require("./getPageProps"), exports);
__exportStar(require("./getPageUrl"), exports);
__exportStar(require("./parsePlaceholderKey"), exports);
__exportStar(require("./UniformContextProps"), exports);
__exportStar(require("./PageComponentProps"), exports);
__exportStar(require("./noopLogger"), exports);
__exportStar(require("./scriptLoader"), exports);

},{"./PageComponentProps":17,"./UniformContextProps":18,"./buildLayout":19,"./convertDataItemToRuntimeItem":20,"./getPageProps":21,"./getPageUrl":22,"./noopLogger":24,"./parsePlaceholderKey":25,"./popVisibleRenderingsFromPlaceholdersMap":26,"./scriptLoader":27}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noopLogger = void 0;
// parameter name prefixed with `_` to make TS stop complaining about unused parameters.
exports.noopLogger = {
    debug: function () {
        var _msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _msg[_i] = arguments[_i];
        }
    },
    info: function () {
        var _msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _msg[_i] = arguments[_i];
        }
    },
    warn: function () {
        var _msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _msg[_i] = arguments[_i];
        }
    },
    error: function () {
        var _msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _msg[_i] = arguments[_i];
        }
    },
};

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePlaceholderKey = void 0;
var common_1 = require("@uniformdev/common");
function parsePlaceholderKey(key) {
    if (key === '/') {
        return '/';
    }
    key = key.trim();
    key = key.toLowerCase();
    key = common_1.trimEnd(key, '/');
    key = key || 'main';
    return key;
}
exports.parsePlaceholderKey = parsePlaceholderKey;

},{"@uniformdev/common":31}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.popVisibleRenderingsFromPlaceholdersMap = void 0;
var common_1 = require("@uniformdev/common");
function popVisibleRenderingsFromPlaceholdersMap(placeholders, placeholderKey, logger) {
    var visibleRenderings = [];
    common_1.keys(placeholders).forEach(function (x) {
        if (false
            // --------------------------------------------------------
            // Exact match
            //   e.g. '/main/content' matches '/main/content'
            //
            || (x == placeholderKey)
            // --------------------------------------------------------
            // Loose placeholder
            //   e.g. 'content' matches '/main/content'
            //   but not '/main-content' and not '/main/content/top'
            //
            || (!x.startsWith('/') && placeholderKey.endsWith('/' + x))
            // --------------------------------------------------------
            || false) {
            var renderings_1 = placeholders[x];
            renderings_1.forEach(function (r, index) {
                if (!r || r.hidden)
                    return;
                logger.debug('Adding ' + r.componentName + ' [' + r.id + '] to ' + placeholderKey + ' (and removing from list of free renderings)');
                visibleRenderings.push(r);
                renderings_1[index] = undefined;
            });
        }
    });
    return visibleRenderings;
}
exports.popVisibleRenderingsFromPlaceholdersMap = popVisibleRenderingsFromPlaceholdersMap;

},{"@uniformdev/common":31}],27:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientScriptLoader = void 0;
var common_1 = require("@uniformdev/common");
function getClientScriptLoader() {
    return {
        type: "default",
        load: loadClientScripts
    };
}
exports.getClientScriptLoader = getClientScriptLoader;
function loadClientScripts(scripts, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cachedScripts, callback, _b, logger, ids, idsNotCached, promises, loadedScripts, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = args.cachedScripts, cachedScripts = _a === void 0 ? {} : _a, callback = args.callback, _b = args.logger, logger = _b === void 0 ? common_1.getNullLogger() : _b;
                    ids = Object.keys(scripts);
                    if (ids.length == 0) {
                        return [2 /*return*/, true];
                    }
                    idsNotCached = [];
                    ids.forEach(function (id) {
                        var cachedUrl = cachedScripts[id];
                        if (cachedUrl != scripts[id]) {
                            idsNotCached.push(id);
                        }
                    });
                    if (idsNotCached.length == 0) {
                        return [2 /*return*/, true];
                    }
                    promises = [];
                    idsNotCached.forEach(function (id) {
                        var url = scripts[id];
                        promises.push(load.js({ id: id, url: url }));
                    });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    loadedScripts = _c.sent();
                    loadedScripts.forEach(function (script) {
                        cachedScripts[script.id] = script.url;
                    });
                    if (callback) {
                        logger.debug("Client script loader - Scripts were loaded so invoking callback.", { scripts: scripts });
                        callback();
                    }
                    logger.debug("Client script loader - Finished loading scripts.", { scripts: loadedScripts });
                    return [2 /*return*/, true];
                case 3:
                    err_1 = _c.sent();
                    logger.error("Client script loader - Error while loading scripts.", { scripts: scripts });
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var load = (function () {
    return {
        css: _load('link'),
        js: _load('script'),
        img: _load('img')
    };
})();
function _load(tag) {
    return function (script) {
        return new Promise(function (resolve, reject) {
            var element = document.createElement(tag);
            var parent = document.body;
            var attr = 'src';
            element.onload = function () {
                resolve(script);
            };
            element.onerror = function () {
                element.remove();
                reject(script);
            };
            switch (tag) {
                case 'script':
                    element.async = script.notAsync == true ? false : true;
                    parent = document.head;
                    break;
                case 'link':
                    element.type = 'text/css';
                    element.rel = 'stylesheet';
                    attr = 'href';
                    parent = document.head;
            }
            var attr2 = document.createAttribute(attr);
            attr2.value = script.url;
            element.attributes.setNamedItem(attr2);
            parent.appendChild(element);
        });
    };
}

},{"@uniformdev/common":31}],28:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./subscriptions"), exports);
__exportStar(require("./queue"), exports);

},{"./queue":29,"./subscriptions":30}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniformQueue = void 0;
var subscriptions_1 = require("./subscriptions");
/**
 * Gets a new queue object.
 */
function getUniformQueue() {
    var map = new Map();
    var subscriptions = subscriptions_1.getSubscriptionManager();
    return {
        add: function (type, entry) {
            var _a;
            var values = (_a = map.get(type)) !== null && _a !== void 0 ? _a : [];
            if (values.indexOf(entry) == -1) {
                values === null || values === void 0 ? void 0 : values.push(entry);
                subscriptions.publish({
                    type: type,
                    when: new Date(),
                    entry: entry
                });
            }
            map.set(type, values);
        },
        get: function (type) {
            var values = map.get(type);
            if (!values) {
                return undefined;
            }
            return values.shift();
        },
        count: function (type) {
            var values = map.get(type);
            if (!values) {
                return 0;
            }
            return values.length;
        },
        subscribe: function (type, callback) {
            return subscriptions.subscribe(type, callback);
        }
    };
}
exports.getUniformQueue = getUniformQueue;

},{"./subscriptions":30}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionManager = void 0;
function getSubscriptionManager(isGlobal) {
    return new DefaultSubscriptionManager(isGlobal);
}
exports.getSubscriptionManager = getSubscriptionManager;
var DefaultSubscriptionManager = /** @class */ (function () {
    function DefaultSubscriptionManager(isGlobal) {
        if (isGlobal === void 0) { isGlobal = false; }
        this.allEvents = [];
        this.isGlobal = isGlobal;
        this.map = new Map();
        this.publish = this.publish.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.getSubscribers = this.getSubscribers.bind(this);
    }
    DefaultSubscriptionManager.prototype.subscribe = function (type, callback) {
        var callbacks = this.map.get(type);
        if (!callbacks) {
            callbacks = [];
            this.map.set(type, callbacks);
        }
        if (callbacks.indexOf(callback) == -1) {
            callbacks.push(callback);
            this.map.set(type, callbacks);
        }
        return function () {
            var position = callbacks.indexOf(callback);
            if (position == -1) {
                return false;
            }
            callbacks.splice(position, 1);
            return true;
        };
    };
    DefaultSubscriptionManager.prototype.publish = function (data) {
        var _a;
        if (data.silent === true) {
            return;
        }
        var callbacks = this.map.get(data.type);
        if (callbacks) {
            callbacks.forEach(function (callback) { return callback(data); });
        }
        var callbacks2 = this.map.get(undefined);
        if (callbacks2) {
            callbacks2.forEach(function (callback) { return callback(data); });
        }
        if (this.isGlobal != true) {
            if ((_a = window.uniform) === null || _a === void 0 ? void 0 : _a.subscriptions) {
                window.uniform.subscriptions.publish(data);
            }
        }
    };
    DefaultSubscriptionManager.prototype.getSubscribers = function (type) {
        var _a;
        return (_a = this.map.get(type)) !== null && _a !== void 0 ? _a : [];
    };
    return DefaultSubscriptionManager;
}());

},{}],31:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./events"), exports);
__exportStar(require("./logging"), exports);
__exportStar(require("./model"), exports);
__exportStar(require("./util"), exports);

},{"./events":28,"./logging":34,"./model":36,"./util":45}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNullLogger = exports.NullLogger = void 0;
exports.NullLogger = {
    debug: function () { },
    error: function () { },
    info: function () { },
    trace: function () { },
    warn: function () { }
};
function getNullLogger() {
    return exports.NullLogger;
}
exports.getNullLogger = getNullLogger;

},{}],33:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConsoleLogger = void 0;
var loglevel_1 = __importDefault(require("loglevel"));
// Be sure to set a level in order for loglevel to bind to the console properly.
// Otherwise, the exported logger instance will have `noop` functions for all
// console methods.
// Likely an issue due to how loglevel exports itself.
// NOTE: be _sure_ that UNIFORM_OPTIONS_DEBUG gets exposed via WebpackDefinePlugin.
// Next config has a `env` property that can be set to ensure this happens at build time.
function createConsoleLogger(config) {
    var level = config.UNIFORM_OPTIONS_DEBUG ? 'debug' : 'warn';
    loglevel_1.default.setLevel(level);
    return loglevel_1.default;
}
exports.createConsoleLogger = createConsoleLogger;

},{"loglevel":4}],34:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Logger"), exports);
__exportStar(require("./createConsoleLogger"), exports);

},{"./Logger":32,"./createConsoleLogger":33}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],36:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./UniformConfig"), exports);

},{"./UniformConfig":35}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendArray = exports.flattenArray = void 0;
function flattenArray(source, target) {
    if (!Array.isArray(source)) {
        return;
    }
    for (var i = 0; i < source.length; i++) {
        var value = source[i];
        if (value == undefined || value == null) {
            continue;
        }
        if (Array.isArray(value)) {
            flattenArray(value, target);
            continue;
        }
        if (target.indexOf(value) == -1) {
            target.push(value);
        }
    }
}
exports.flattenArray = flattenArray;
function appendArray(source, target) {
    if (!source) {
        return;
    }
    source.forEach(function (value) {
        if (target.indexOf(value) == -1) {
            target.push(value);
        }
    });
}
exports.appendArray = appendArray;

},{}],38:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorToJsonObject = void 0;
var serialize_error_1 = __importDefault(require("serialize-error"));
function errorToJsonObject(error) {
    var obj = serialize_error_1.default(error);
    // @ts-ignore
    var data = error.data;
    if (data) {
        obj.data = data;
    }
    return obj;
}
exports.errorToJsonObject = errorToJsonObject;

},{"serialize-error":6}],39:[function(require,module,exports){
(function (process){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithRetry = void 0;
var fetch_retry_1 = __importDefault(require("fetch-retry"));
// @ts-ignore because no typeso
var isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
var __1 = require("..");
var fetch = fetch_retry_1.default(isomorphic_unfetch_1.default);
function fetchWithRetry(logger, url, maxRetries, timeout) {
    if (maxRetries === void 0) { maxRetries = 3; }
    return __awaiter(this, void 0, void 0, function () {
        var attempts, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timeout = timeout || parseInt(__1.getEnv(process.env, 'UNIFORM_PUBLISH_PREFETCH_REQUEST_TIMEOUT', '10000'));
                    logger.debug('HTTP request to ' + url + (maxRetries > 1 ? ' (with max ' + maxRetries + ' retries)' : '') + ', timeout: ' + timeout + 'ms');
                    attempts = 0;
                    return [4 /*yield*/, fetch(url, {
                            // @ts-ignore
                            timeout: timeout,
                            retries: maxRetries - 1,
                            retryOn: function (attempt, _error, response) {
                                if (attempt >= maxRetries) {
                                    return false;
                                }
                                if (!response) {
                                    logger.debug('Keep retrying because no response');
                                    return true;
                                }
                                if (response.status === 200) {
                                    return false;
                                }
                                if (response.status === 404) {
                                    return false;
                                }
                                return true;
                            },
                            retryDelay: function (attempt, _error, _response) {
                                attempts += 1;
                                var wait = Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
                                logger.warn('Will retry in ' + wait / 1000 + 's, url: ' + url);
                                return wait;
                            },
                        })];
                case 1:
                    result = _a.sent();
                    if (attempts) {
                        logger.info("Url was fetched after " + attempts + " attempts: " + url);
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.fetchWithRetry = fetchWithRetry;

}).call(this,require('_process'))
},{"..":31,"_process":5,"fetch-retry":2,"isomorphic-unfetch":3}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiUrlWithToken = void 0;
function getApiUrlWithToken(config, relativePath) {
    var apiUrl = config.UNIFORM_API_URL;
    var uri = new URL(apiUrl.endsWith('/') ? apiUrl : apiUrl + '/');
    if (relativePath) {
        uri = new URL(relativePath.startsWith('.') ? relativePath : '.' + relativePath, uri);
    }
    if (config.UNIFORM_OPTIONS_PREVIEW) {
        uri.searchParams.set('uniform_preview', 'true');
    }
    return uri.href.toLowerCase();
}
exports.getApiUrlWithToken = getApiUrlWithToken;

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvEx = exports.getBoolEnv = exports.getEnv = void 0;
var __1 = require("..");
function getEnv(env, name, defaultValue) {
    if (defaultValue === void 0) { defaultValue = undefined; }
    return getEnvEx(env[name], name, defaultValue);
}
exports.getEnv = getEnv;
function getBoolEnv(env, name, defaultValue) {
    if (defaultValue === void 0) { defaultValue = undefined; }
    var value = env[name];
    if (value === undefined) {
        return defaultValue === undefined
            ? __1.throwException("FATAL .env file lacks " + name + " bool value")
            : defaultValue;
    }
    value = value.toString().trim().toLowerCase();
    return value === 'true' || value === '1' || value === 'yes';
}
exports.getBoolEnv = getBoolEnv;
function getEnvEx(value, name, defaultValue) {
    if (defaultValue === void 0) { defaultValue = undefined; }
    if (value === undefined) {
        return defaultValue === undefined
            ? __1.throwException("FATAL .env file lacks " + name + " value")
            : defaultValue;
    }
    if (Object.prototype.toString.call(value) === '[object String]') {
        return value.trim();
    }
    return value;
}
exports.getEnvEx = getEnvEx;

},{"..":31}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNestedObjectProp = void 0;
// Inspired by: https://stackoverflow.com/a/22129960/9324
/**
 * Examples:
 * {
 *   prop1: {
 *     prop2: {
 *       prop3: 'deep',
 *       prop4: [
 *         { prop5: 'deeper' }
 *       ]
 *     }
 *   }
 * }
 * 'prop1.prop2.prop3' == 'deep'
 * 'prop1.prop2.prop4.0.prop5' == 'deeper'
 */
// TODO: move this to common
function getNestedObjectProp(obj, propPath, defaultValue) {
    return propPath.split('.').reduce(function (o, p) { return (o ? o[p] : defaultValue); }, obj);
}
exports.getNestedObjectProp = getNestedObjectProp;

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyByPath = void 0;
// Inspired by: https://stackoverflow.com/a/22129960/9324
/**
 * Examples:
 * {
 *   prop1: {
 *     prop2: {
 *       prop3: 'deep',
 *       prop4: [
 *         { prop5: 'deeper' }
 *       ]
 *     }
 *   }
 * }
 * 'prop1.prop2.prop3' == 'deep'
 * 'prop1.prop2.prop4.0.prop5' == 'deeper'
 */
function getPropertyByPath(obj, propPath, defaultValue) {
    return propPath.split('.').reduce(function (o, p) { return (o && o[p]) || defaultValue; }, obj);
}
exports.getPropertyByPath = getPropertyByPath;

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGlobalObject = void 0;
var subscriptions_1 = require("../events/subscriptions");
var queue_1 = require("../events/queue");
function initializeGlobalObject() {
    if (window) {
        if (!window.uniform) {
            window.uniform = {};
        }
        if (!window.uniform.subscriptions) {
            window.uniform.subscriptions = subscriptions_1.getSubscriptionManager(true);
        }
        if (!window.uniform.queue) {
            window.uniform.queue = queue_1.getUniformQueue();
        }
    }
}
exports.initializeGlobalObject = initializeGlobalObject;

},{"../events/queue":29,"../events/subscriptions":30}],45:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./throwException"), exports);
__exportStar(require("./keys"), exports);
__exportStar(require("./surround"), exports);
__exportStar(require("./parseGuid"), exports);
__exportStar(require("./tryParseGuid"), exports);
__exportStar(require("./tryFormatGuid"), exports);
__exportStar(require("./getEnv"), exports);
__exportStar(require("./getEnv"), exports);
__exportStar(require("./trim"), exports);
__exportStar(require("./replace"), exports);
__exportStar(require("./errorToJsonObject"), exports);
__exportStar(require("./getPropertyByPath"), exports);
__exportStar(require("./getApiUrlWithToken"), exports);
__exportStar(require("./getNestedObjectProp"), exports);
__exportStar(require("./parseUniformConfig"), exports);
__exportStar(require("./fetchWithRetry"), exports);
__exportStar(require("./global"), exports);
__exportStar(require("./arrays"), exports);
__exportStar(require("./objects"), exports);

},{"./arrays":37,"./errorToJsonObject":38,"./fetchWithRetry":39,"./getApiUrlWithToken":40,"./getEnv":41,"./getNestedObjectProp":42,"./getPropertyByPath":43,"./global":44,"./keys":46,"./objects":47,"./parseGuid":48,"./parseUniformConfig":49,"./replace":50,"./surround":51,"./throwException":52,"./trim":53,"./tryFormatGuid":54,"./tryParseGuid":55}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keys = void 0;
function keys(obj) {
    return (obj && Object.getOwnPropertyNames(obj)) || [];
}
exports.keys = keys;

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendObject = void 0;
function appendObject(source, target) {
    if (!source) {
        return;
    }
    Object.keys(source).forEach(function (id) {
        target[id] = source[id];
    });
}
exports.appendObject = appendObject;

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGuid = void 0;
var __1 = require("..");
function parseGuid(value) {
    return __1.tryParseGuid(value) || __1.throwException("Cannot parse GUID: " + value);
}
exports.parseGuid = parseGuid;

},{"..":31}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUniformConfig = void 0;
var __1 = require("..");
function parseUniformConfig(env, runtime) {
    if (runtime === void 0) { runtime = true; }
    var UNIFORM_API_URL = __1.getEnv(env, 'UNIFORM_API_URL', runtime ? undefined : '');
    var UNIFORM_API_SITENAME = __1.getEnv(env, 'UNIFORM_API_SITENAME', runtime ? undefined : '');
    var UNIFORM_CONTENT_URL = __1.getEnv(env, 'UNIFORM_CONTENT_URL', UNIFORM_API_URL);
    var UNIFORM_API_MAPSERVICE = __1.getEnv(env, 'UNIFORM_API_MAPSERVICE', '/uniform/api/content/${UNIFORM_API_SITENAME}/map.json');
    var UNIFORM_OPTIONS_PREVIEW = __1.getBoolEnv(env, 'UNIFORM_OPTIONS_PREVIEW', true);
    var UNIFORM_OPTIONS_DEBUG = __1.getBoolEnv(env, 'UNIFORM_OPTIONS_DEBUG', false);
    var UNIFORM_OPTIONS_PREFETCH_LINKS = __1.getBoolEnv(env, 'UNIFORM_OPTIONS_PREFETCH_LINKS', false);
    var UNIFORM_OPTIONS_MVC_SPA_ENABLED = __1.getBoolEnv(env, 'UNIFORM_OPTIONS_MVC_SPA_ENABLED', true);
    return {
        UNIFORM_API_URL: UNIFORM_API_URL,
        UNIFORM_API_SITENAME: UNIFORM_API_SITENAME,
        UNIFORM_CONTENT_URL: UNIFORM_CONTENT_URL,
        UNIFORM_API_MAPSERVICE: UNIFORM_API_MAPSERVICE,
        UNIFORM_OPTIONS_PREVIEW: UNIFORM_OPTIONS_PREVIEW,
        UNIFORM_OPTIONS_DEBUG: UNIFORM_OPTIONS_DEBUG,
        UNIFORM_OPTIONS_PREFETCH_LINKS: UNIFORM_OPTIONS_PREFETCH_LINKS,
        UNIFORM_OPTIONS_MVC_SPA_ENABLED: UNIFORM_OPTIONS_MVC_SPA_ENABLED,
    };
}
exports.parseUniformConfig = parseUniformConfig;

},{"..":31}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace = void 0;
// https://stackoverflow.com/a/1144788/9324
function replace(value, searchValue, replaceValue) {
    var escapedSearchValue = searchValue.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    var replacedValue = value.replace(new RegExp(escapedSearchValue, 'g'), replaceValue);
    return replacedValue;
}
exports.replace = replace;

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.surround = void 0;
function surround(obj, arg) {
    return !obj ? arg : (obj.startsWith(arg) ? '' : arg) + obj + (obj.endsWith(arg) ? '' : arg);
}
exports.surround = surround;

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwException = void 0;
function throwException(message) {
    // typeof Error returns `object`
    // And for some reason `message instanceof Error` sometimes evaluates
    // to false when message is actually an Error object.
    // So, go with the highly scientific option and check for `object` type and
    // whether or not the `stack` property is defined.
    if (typeof message === 'object' && message.stack) {
        throw message;
    }
    throw new Error(message || 'Unknown error occurred, check stacktrace to get more info.');
}
exports.throwException = throwException;

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimEnd = exports.trimStart = exports.trim = void 0;
function trim(str, char) {
    return str.slice(getSliceStartIndex(str, char), getSliceEndIndex(str, char));
}
exports.trim = trim;
function trimStart(str, char) {
    return str.slice(getSliceStartIndex(str, char));
}
exports.trimStart = trimStart;
function trimEnd(str, char) {
    return str.slice(0, getSliceEndIndex(str, char));
}
exports.trimEnd = trimEnd;
function getSliceStartIndex(str, char) {
    var startCharIndex = -1;
    while (str.charAt(++startCharIndex) === char)
        ;
    return startCharIndex;
}
function getSliceEndIndex(str, char) {
    var endCharIndex = str.length;
    while (str.charAt(--endCharIndex) === char)
        ;
    return endCharIndex + 1;
}

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryFormatGuid = void 0;
/**
 * Format N
 * 32 digits
 * 00000000000000000000000000000000
 *
 * Format D
 * 32 digits separated by hyphens
 * 00000000-0000-0000-0000-000000000000
 *
 * Format B
 * 32 digits separated by hyphens, enclosed in braces
 * {00000000-0000-0000-0000-000000000000}
 * */
function tryFormatGuid(value, format) {
    if (!value)
        return '';
    var lowerValue = value.toLowerCase();
    switch (format) {
        case 'N':
            return toFormatN(lowerValue);
        case 'D':
            return toFormatD(lowerValue);
        case 'B':
            return toFormatB(lowerValue);
        default:
            throw new Error('format arg: unknown guid format');
    }
}
exports.tryFormatGuid = tryFormatGuid;
function toFormatN(value) {
    var result = value.replace(/[{}-]/g, '');
    if (result.length !== 32) {
        return '';
    }
    return result;
}
function toFormatD(value) {
    if (value.length === 36 && value[8] === '-') {
        return value;
    }
    var fN = toFormatN(value);
    if (!fN)
        return '';
    return fN.substring(0, 8) + "-" + fN.substring(8, 12) + "-" + fN.substring(12, 16) + "-" + fN.substring(16, 20) + "-" + fN.substring(20, 32);
}
function toFormatB(value) {
    if (value.length === 38 && value[0] === '{' && value[9] === '-') {
        return value;
    }
    var fD = toFormatD(value);
    if (!fD)
        return '';
    return "{" + fD + "}";
}

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseGuid = void 0;
var regex = /^([0-9A-F]{32})|[\{\[\(]?([0-9A-F]{8})\-([0-9A-F]{4})\-([0-9A-F]{4})\-([0-9A-F]{4})\-([0-9A-F]{12})[\]\}\)]?$/i;
function tryParseGuid(value) {
    var result = regex.exec(value || '');
    if (!result) {
        return '';
    }
    return result.reduce(function (prev, value, index) { return prev + (index > 0 && value ? value : ''); }, '').toLowerCase();
}
exports.tryParseGuid = tryParseGuid;

},{}],56:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getCookieValues = exports.removeCookie = exports.setCookie = exports.getCookie = void 0;
var tracking_1 = require("@uniformdev/tracking");
exports.getCookie = tracking_1.getCookie;
exports.setCookie = tracking_1.setCookie;
exports.removeCookie = tracking_1.removeCookie;
function getCookieValues(name) {
    var value = tracking_1.getCookie(name);
    if (value) {
        return value.split(",");
    }
    return [];
}
exports.getCookieValues = getCookieValues;

},{"@uniformdev/tracking":84}],57:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./tracker"), exports);
__exportStar(require("./visit"), exports);
__exportStar(require("./visitor"), exports);
__exportStar(require("./cookie"), exports);

},{"./cookie":56,"./tracker":58,"./visit":59,"./visitor":60}],58:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.doTracking = exports.initializeTracker = exports.gaElems = exports.gaNewElem = void 0;
var tracking_1 = require("@uniformdev/tracking");
var common_1 = require("@uniformdev/common");
var common_client_1 = require("@uniformdev/common-client");
var debugLogger = {
    debug: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker  DEBUG] " + message, data); },
    error: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker  ERROR] " + message, data); },
    info: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker   INFO] " + message, data); },
    trace: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker  TRACE] " + message, data); },
    warn: function (message, data) { console.log(new Date().toISOString() + " [Uniform Tracker   WARN] " + message, data); }
};
function getLogger(settings) {
    return (settings === null || settings === void 0 ? void 0 : settings.debug) == true ? debugLogger : common_1.getNullLogger();
}
function shouldAddSubscriptionsForContextCookies(settings) {
    return (settings === null || settings === void 0 ? void 0 : settings.mode) == "mvc";
}
function getTrackingConfig(settings, logger) {
    var _a, _b;
    if ((_a = settings === null || settings === void 0 ? void 0 : settings.context) === null || _a === void 0 ? void 0 : _a.tracking) {
        logger.debug("Uniform tracking - initializeTracker - Using tracking config from settings to determine tracker cookie types.", { settings: settings });
        return settings.context;
    }
    if ((_b = window.uniform) === null || _b === void 0 ? void 0 : _b.tracking) {
        logger.debug("Uniform tracking - initializeTracker - Using tracking config from global object to determine tracker cookie types.", { global: window.uniform });
        return window.uniform.tracking;
    }
}
function addSubscriptionsForContextCookies(trackingConfig, subs, logger) {
    var cookieTypes = tracking_1.getTrackerCookieTypes(trackingConfig);
    tracking_1.addSubscriptionsForTrackerCookies(subs, {
        cookieTypes: cookieTypes,
        logger: logger,
        loggerPrefix: "Uniform tracking - initializeTracker",
        getCookie: tracking_1.getCookie,
        removeCookie: tracking_1.removeCookie,
        setCookie: tracking_1.setCookie
    });
}
exports.gaNewElem = {};
exports.gaElems = {};
function gaInit() {
    var currdate = new Date();
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * currdate;
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga', exports.gaNewElem, exports.gaElems);
}
/**
 * Prepares the tracker and makes it available as a global JavaScript object.
 * No data is tracked when this function is called.
 * @param settings
 */
function initializeTracker(settings) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var logger, trackingConfig, scripts, scriptLoader, error_1, addSubscription, subscriptions, dispatchers, args, tracker;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    logger = getLogger(settings);
                    trackingConfig = getTrackingConfig(settings, logger);
                    if (!trackingConfig) {
                        logger.error("Uniform tracking - initializeTracker - Unable to resolve tracking config so tracker cannot be initialized.", { settings: settings });
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                    if (!((_a = trackingConfig.settings) === null || _a === void 0 ? void 0 : _a.scripts)) return [3 /*break*/, 4];
                    scripts = __assign({}, trackingConfig.settings.scripts);
                    //
                    //If the optimize script is included, remove it because this is that script.
                    if (scripts.optimize) {
                        delete scripts.optimize;
                        logger.debug("Uniform tracking - initializeTracker - Optimize script was removed from the collection of client scripts to load because that script is running this code.", { scripts: scripts });
                    }
                    scriptLoader = common_client_1.getClientScriptLoader();
                    if (!scriptLoader) {
                        logger.error("Uniform tracking - initializeTracker - Unable to resolve script loader so tracker cannot be initialized.", { trackingConfig: trackingConfig });
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, scriptLoader.load(scripts, { logger: logger })];
                case 2:
                    _d.sent();
                    logger.debug("Uniform tracking - initializeTracker - Scripts finished loading.", { scripts: scripts });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _d.sent();
                    logger.error("Uniform tracking - initializeTracker - Error occurred while loading scripts so tracker cannot be initialized.", { trackingConfig: trackingConfig, scripts: scripts, error: error_1 });
                    return [2 /*return*/, Promise.reject(error_1)];
                case 4:
                    addSubscription = function (name, type) {
                        if (!name) {
                            return;
                        }
                        var parts = name.split('.');
                        if (parts.length > 1 && parts[0] == "window") {
                            parts.splice(0, 1);
                        }
                        var callback = window;
                        for (var i = 0; i < parts.length; i++) {
                            if (!callback) {
                                break;
                            }
                            callback = callback[parts[i]];
                        }
                        if (callback == undefined || typeof callback !== "function") {
                            logger.error("Uniform tracking - initializeTracker - Unable to add a tracker subscription because the specified function does not exist.", { name: name, type: type });
                            return;
                        }
                        if (callback) {
                            subscriptions.subscribe(type, callback);
                        }
                    };
                    subscriptions = common_1.getSubscriptionManager();
                    //
                    //Add handlers for setting context data in cookies.
                    if (shouldAddSubscriptionsForContextCookies(settings)) {
                        logger.debug("Uniform tracking - initializeTracker - Adding subscriptions for context cookies.", { settings: settings });
                        addSubscriptionsForContextCookies(trackingConfig, subscriptions, logger);
                    }
                    //
                    //Add custom handlers specified on the settings.
                    addSubscription(settings.onTrackingFinished, "tracking-finished");
                    addSubscription(settings.onVisitCreated, "visit-created");
                    addSubscription(settings.onVisitUpdated, "visit-updated");
                    addSubscription(settings.onVisitorUpdated, "visitor-updated");
                    dispatchers = tracking_1.getDispatchersFromTrackingConfig(trackingConfig, {
                        getCookie: tracking_1.getCookie,
                        logger: logger,
                        loggerPrefix: "Uniform tracking - initializeTracker",
                        removeCookie: tracking_1.removeCookie,
                        setCookie: tracking_1.setCookie,
                        ga: {
                            initializeGa: function (destination, logger) {
                                if (!window.ga) {
                                    logger.error("Uniform tracking - initializeTracker - The global function ga is not defined, so initializing the GA library.", { destination: destination });
                                    gaInit();
                                }
                                if (!window.ga) {
                                    logger.error("Uniform tracking - initializeTracker - The global function ga is not defined, suggesting the GA library has not been loaded.", { destination: destination });
                                    return false;
                                }
                                if (!destination.trackingIds) {
                                    logger.debug("Uniform tracking - initializeTracker - No tracking ids set on GA destination so no GA tracker objects will be created.", { destination: destination });
                                    return false;
                                }
                                destination.trackingIds.forEach(function (trackingId) {
                                    try {
                                        window.ga("create", trackingId, "auto");
                                        logger.debug("Uniform tracking - initializeTracker - GA tracker object was created.", { trackingId: trackingId, destination: destination });
                                    }
                                    catch (error) {
                                        logger.error("Uniform tracking - initializeTracker - Error while creating GA tracker object.", { trackingId: trackingId, error: error });
                                    }
                                });
                                return true;
                            }
                        }
                    });
                    args = {
                        dispatchers: dispatchers,
                        sessionTimeout: (_b = settings.sessionTimeout) !== null && _b !== void 0 ? _b : 20,
                        storage: (_c = settings.storage) !== null && _c !== void 0 ? _c : "default",
                        subscriptions: subscriptions,
                        type: "js"
                    };
                    tracker = tracking_1.getSitecoreTracker(args, logger);
                    if (!tracker) {
                        logger.error("Uniform tracking - initializeTracker - No tracker was returned from getSitecoreTracker.", { args: args });
                        return [2 /*return*/, Promise.resolve(undefined)];
                    }
                    //
                    //Set the tracker on the global object.
                    if (!window.uniform) {
                        window.uniform = {};
                    }
                    window.uniform.tracker = tracker;
                    return [2 /*return*/, Promise.resolve(tracker)];
            }
        });
    });
}
exports.initializeTracker = initializeTracker;
/**
 * Tracks using tracking data from the global JavaScript object.
 * If the tracker is not already initialized, this function
 * initializes it.
 * @param settings
 */
function doTracking(settings) {
    var _a;
    var logger = getLogger(settings);
    if (!window.uniform) {
        return;
    }
    var source = settings.source;
    if (!source) {
        logger.error("Uniform tracking - doTracking - No source was specified.", { settings: settings });
        return;
    }
    var context = (_a = settings.context) !== null && _a !== void 0 ? _a : window.uniform;
    if (!context) {
        logger.warn("Uniform tracking - doTracking - No context was was resolved.", { settings: settings });
        return;
    }
    var useTracker = function (tracker) {
        if (!tracker) {
            logger.error("Uniform tracking - doTracking - No tracker is available.", { settings: settings });
            return;
        }
        logger.debug("Uniform tracking - doTracking - Tracker is available.", { settings: settings });
        var visitorId = tracking_1.getCookie(tracking_1.UniformCookieNames.VisitorId);
        logger.debug("Uniform tracking - doTracking - Visitor id was retrieved from cookie.", { visitorId: visitorId, cookie: tracking_1.UniformCookieNames.VisitorId });
        var results = tracker.track(source, context, { visitorId: visitorId, createVisitor: true, silent: settings.silent });
        logger.debug("Uniform tracking - doTracking - Tracking results were returned.", { results: results });
        if (results && results.visitor) {
            tracking_1.setCookie(tracking_1.UniformCookieNames.VisitorId, results.visitor.id);
            logger.debug("Uniform tracking - doTracking - Visitor id cookie was updated.", { visitorId: visitorId, cookie: tracking_1.UniformCookieNames.VisitorId });
        }
    };
    if (window.uniform.tracker) {
        logger.debug("Uniform tracking - doTracking - Using the tracker set on the global object.", { settings: settings });
        useTracker(window.uniform.tracker);
    }
    else {
        initializeTracker(settings).then(function (tracker) {
            logger.debug("Uniform tracking - doTracking - Using the newly initialized tracker.", { settings: settings });
            useTracker(tracker);
            logger.debug("Uniform tracking - doTracking - Tracking is finished.", { settings: settings });
        });
    }
}
exports.doTracking = doTracking;

},{"@uniformdev/common":31,"@uniformdev/common-client":8,"@uniformdev/tracking":84}],59:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getVisitGoals = void 0;
var tracking_1 = require("@uniformdev/tracking");
function getVisitGoals(visit) {
    return tracking_1.getVisitActivities('goal', visit);
}
exports.getVisitGoals = getVisitGoals;

},{"@uniformdev/tracking":84}],60:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getVisitorProfilePatternMatch = exports.getVisitorProperty = void 0;
function getVisitor() {
    var _a;
    return (_a = window === null || window === void 0 ? void 0 : window.uniform) === null || _a === void 0 ? void 0 : _a.visitor;
}
function getVisitorProperty(property) {
    if (property) {
        var visitor = getVisitor();
        if (visitor) {
            var i = Object.keys(visitor).findIndex(function (key) { return key == property; });
            if (i != -1) {
                return Object.values(visitor)[i];
            }
        }
    }
    return undefined;
}
exports.getVisitorProperty = getVisitorProperty;
function getVisitorProfilePatternMatch(profile, usePatternId) {
    var _a, _b;
    if (profile) {
        var visitor = getVisitor();
        if (visitor) {
            var data = (_b = (_a = visitor.data) === null || _a === void 0 ? void 0 : _a.patterns) === null || _b === void 0 ? void 0 : _b.data;
            if (data) {
                if (data[profile]) {
                    if (usePatternId === true) {
                        return data[profile].patternId;
                    }
                    return data[profile].name;
                }
            }
        }
    }
    return undefined;
}
exports.getVisitorProfilePatternMatch = getVisitorProfilePatternMatch;

},{}],61:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.GaDestination = void 0;
var GaDestination = /** @class */ (function () {
    function GaDestination(trackingIds, init) {
        this.type = "ga";
        this.trackingIds = trackingIds;
        Object.assign(this, init);
    }
    return GaDestination;
}());
exports.GaDestination = GaDestination;

},{}],62:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.GaDispatcher = void 0;
var GaDispatcher = /** @class */ (function () {
    /**
     *
     * @param converter
     * @param trackingIds
     * @param setCustomDimensionValues Sets the values that are written
     * as custom dimensions onto a map whose key is used to identify the
     * position of the custom dimension. These values are added to every
     * event that is written to Google Analytics.
     */
    function GaDispatcher(converters, settings) {
        this.requiresBrowser = true;
        this.type = "ga";
        this.activities = settings === null || settings === void 0 ? void 0 : settings.activities;
        this.converters = converters;
        this.trackingIds = settings === null || settings === void 0 ? void 0 : settings.trackingIds;
        this.setCustomDimensionValues = settings === null || settings === void 0 ? void 0 : settings.setCustomDimensionValues;
    }
    GaDispatcher.prototype.getCustomDimensionFields = function (results, logger) {
        var fields = {};
        var map = new Map();
        if (this.setCustomDimensionValues) {
            this.setCustomDimensionValues(results, map);
        }
        map.forEach(function (value, key) {
            fields["dimension" + key] = value;
        });
        logger.debug("GA dispatcher - Converted tracking results into Google Analytics custom dimensions.", { map: map, fields: fields });
        return fields;
    };
    GaDispatcher.prototype.dispatchActivity = function (results, logger) {
        var _this = this;
        var _a;
        //
        //
        if (!results) {
            logger.debug("GA dispatcher - No tracked activity results are available to dispatch.");
            return;
        }
        //
        //Google Analytics tracking script must be loaded.
        if (!window.ga) {
            logger.error("GA dispatcher - GA tracking script has not been loaded. The tracking script must be loaded before the GA dispatcher can dispatch events to GA. Dispatch aborted.", { trackingIds: this.trackingIds, activity: results });
            return;
        }
        //
        //
        if (this.activities && this.activities.length == 0) {
            logger.debug("GA dispatcher - An empty array of activities was specified so no activities will be dispatched.");
            return;
        }
        //
        //
        var events = [];
        results.visitActivities.forEach(function (activity) {
            if (_this.activities && _this.activities.indexOf(activity.type) == -1) {
                logger.debug("GA dispatcher - The activity type was not selected as an activity to dispatch.", { type: activity.type, allowed: _this.activities, activity: activity });
                return;
            }
            for (var i = 0; i < _this.converters.length; i++) {
                var gaEvent = _this.converters[i].convert(activity);
                if (!gaEvent) {
                    logger.debug("GA dispatcher - The activity was not converted into a format that can be dispatched.", activity);
                    continue;
                }
                logger.debug("GA dispatcher - The activity was converted into a format that can be dispatched.", { activity: activity, gaEvent: gaEvent });
                events.push(gaEvent);
            }
        });
        //
        //
        var fields = this.getCustomDimensionFields(results, logger);
        //
        //
        if (events.length == 0) {
            logger.debug("GA dispatcher - No GA events were resolved, so no events will be dispatched.");
            if (fields && Object.keys(fields).length > 0) {
                logger.debug("GA dispatcher - Since no events will be dispatched, no custom dimensions will be dispatched.", fields);
            }
            return;
        }
        //
        //Create trackers for the specified tracking ids.
        (_a = this.trackingIds) === null || _a === void 0 ? void 0 : _a.forEach(function (id) {
            logger.debug("GA dispatcher - Creating tracker for tracking id " + id);
            window.ga('create', id, 'auto', id);
        });
        var trackingIds = this.trackingIds;
        //
        //
        window.ga(function (_tracker) {
            var trackers = [];
            if (trackingIds) {
                //
                //Only use the trackers that are specified.
                logger.debug("GA dispatcher - Events will be dispatched to the specified Google Analytics tracker(s).", { trackingIds: trackingIds });
                trackingIds === null || trackingIds === void 0 ? void 0 : trackingIds.forEach(function (id) {
                    var tracker = window.ga.getByName(id);
                    if (tracker) {
                        trackers.push(tracker);
                    }
                });
            }
            else {
                //
                //Since no trackers were specified, use them all.
                logger.debug("GA dispatcher - No tracking ids were specified, so events will be dispatched to all Google Analytics trackers.");
                window.ga.getAll().forEach(function (tracker) {
                    trackers.push(tracker);
                });
            }
            if (trackers.length == 0) {
                logger.debug("GA dispatcher - No trackers were resolved, so no events will be dispatched to Google Analytics.", { trackingIds: trackingIds });
                return;
            }
            logger.debug("GA dispatcher - Ready to dispatch events to Google Analytics.", { events: events, trackers: trackers.map(function (t) { return t.get("name"); }) });
            trackers.forEach(function (tracker) {
                events.forEach(function (event) {
                    doSendEvent(tracker, event, fields, logger);
                });
            });
        });
    };
    return GaDispatcher;
}());
exports.GaDispatcher = GaDispatcher;
function doSendEvent(tracker, e, fields, logger) {
    fields.nonInteraction = true;
    var trackingId = tracker.get('trackingId');
    tracker.send('event', e.category, e.action, e.label, e.value, fields);
    logger.debug("GA dispatcher - Event dispatched to Google Analytics.", __assign(__assign({ trackingId: trackingId }, e), { fields: fields }));
}

},{}],63:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./ga/destination"), exports);
__exportStar(require("./ga/dispatcher"), exports);
__exportStar(require("./oracleDmp/contextReaders"), exports);
__exportStar(require("./oracleDmp/destination"), exports);
__exportStar(require("./oracleDmp/dispatcher"), exports);
__exportStar(require("./sitecore/tracker"), exports);
__exportStar(require("./sitecore/gaEventConverter"), exports);
__exportStar(require("./sitecore/oracleDmpEventConverter"), exports);
__exportStar(require("./sitecore/contextReaders"), exports);
__exportStar(require("./sitecore/activities"), exports);
__exportStar(require("./sitecore/destination"), exports);
__exportStar(require("./sitecore/dispatcher"), exports);
__exportStar(require("./sitecore/cookies"), exports);
__exportStar(require("./sitecore/profiles"), exports);

},{"./ga/destination":61,"./ga/dispatcher":62,"./oracleDmp/contextReaders":64,"./oracleDmp/destination":65,"./oracleDmp/dispatcher":66,"./sitecore/activities":67,"./sitecore/contextReaders":68,"./sitecore/cookies":69,"./sitecore/destination":70,"./sitecore/dispatcher":71,"./sitecore/gaEventConverter":72,"./sitecore/oracleDmpEventConverter":73,"./sitecore/profiles":75,"./sitecore/tracker":77}],64:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getOracleDmpContextReader = void 0;
var common_1 = require("@uniformdev/common");
var models_1 = require("../../models");
function getOracleDmpContextReader() {
    return {
        type: "oracleDmp",
        getTrackedActivity: function (source, readerContext) {
            var url = readerContext.url, context = readerContext.context, visit = readerContext.visit, visitor = readerContext.visitor, date = readerContext.date, _a = readerContext.logger, logger = _a === void 0 ? common_1.getNullLogger() : _a;
            console.log(url + date);
            var activity = new models_1.TrackedActivityResults(visit, visitor);
            if (source !== "oracleDmp") {
                return activity;
            }
            logger.debug("Oracle DMP context reader - Reading tracking activity from context.", { context: context });
            return activity;
        }
    };
}
exports.getOracleDmpContextReader = getOracleDmpContextReader;

},{"../../models":85,"@uniformdev/common":31}],65:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.OracleDmpDestination = void 0;
var OracleDmpDestination = /** @class */ (function () {
    function OracleDmpDestination(containerIds, init) {
        this.type = "oracleDmp";
        this.containerIds = containerIds;
        Object.assign(this, init);
    }
    return OracleDmpDestination;
}());
exports.OracleDmpDestination = OracleDmpDestination;

},{}],66:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.OracleDmpDispatcher = exports.getOracleDmpCallbackName = void 0;
function getOracleDmpCallbackName(containerId) {
    if (!containerId) {
        return;
    }
    return "callback_" + containerId;
}
exports.getOracleDmpCallbackName = getOracleDmpCallbackName;
var OracleDmpDispatcher = /** @class */ (function () {
    function OracleDmpDispatcher(converters, settings) {
        this.requiresBrowser = true;
        this.type = "oracleDmp";
        this.activities = settings === null || settings === void 0 ? void 0 : settings.activities;
        this.converters = converters;
        this.containerIds = settings === null || settings === void 0 ? void 0 : settings.containerIds;
    }
    OracleDmpDispatcher.prototype.dispatchActivity = function (results, logger) {
        var _this = this;
        var _a;
        //
        //
        if (!results) {
            logger.debug("Oracle DMP dispatcher - No tracked activity results are available to dispatch.");
            return;
        }
        //
        //
        if (this.containerIds && this.containerIds.length == 0) {
            logger.debug("Oracle DMP dispatcher - An empty array of tracking ids means dispatch is disabled.", { activity: results });
            return;
        }
        //
        //Oracle DMP script must be loaded.
        if (!window.bk_doCallbackTag) {
            logger.error("Oracle DMP dispatcher - Oracle DMP tracking script has not been loaded. The tracking script must be loaded before phints can be dispatched. Dispatch aborted.", { containerIds: this.containerIds, activity: results });
            return;
        }
        //
        //
        if (this.activities && this.activities.length == 0) {
            logger.debug("Oracle DMP dispatcher - An empty array of activities was specified so no activities will be dispatched.");
            return;
        }
        //
        //
        var phintsArray = [];
        results.visitActivities.forEach(function (activity) {
            if (_this.activities && _this.activities.indexOf(activity.type) == -1) {
                logger.debug("Oracle DMP dispatcher - The activity type was not selected as an activity to dispatch.", { type: activity.type, allowed: _this.activities, activity: activity });
                return;
            }
            for (var i = 0; i < _this.converters.length; i++) {
                var phints = _this.converters[i].convert(activity);
                if (!phints) {
                    logger.debug("Oracle DMP dispatcher - The activity was not converted into a format that can be dispatched.", activity);
                    continue;
                }
                logger.debug("Oracle DMP dispatcher - The activity was converted into a format that can be dispatched.", { activity: activity, phints: phints });
                phintsArray.push(phints);
            }
        });
        //
        //
        if (phintsArray.length == 0) {
            logger.debug("Oracle DMP dispatcher - No Oracle DMP phints were resolved, so no phints will be dispatched.");
            return;
        }
        //
        //
        window.bk_allow_multiple_calls = true;
        window.bk_use_multiple_iframes = true;
        (_a = this.containerIds) === null || _a === void 0 ? void 0 : _a.forEach(function (containerId) {
            logger.debug("Oracle DMP dispatcher - Adding phints to page context for container " + containerId, phintsArray);
            phintsArray.forEach(function (phints) {
                Object.keys(phints).forEach(function (key) {
                    window.bk_addPageCtx(key, phints[key]);
                });
            });
            var callbackName = getOracleDmpCallbackName(containerId);
            if (!callbackName) {
                logger.error("Oracle DMP dispatcher - Unable to determine callback name for container " + containerId);
                return;
            }
            logger.debug("Oracle DMP dispatcher - Dispatching phints to container " + containerId, { callbackName: callbackName, phintsArray: phintsArray });
            window.bk_doCallbackTag(containerId, callbackName);
        });
    };
    return OracleDmpDispatcher;
}());
exports.OracleDmpDispatcher = OracleDmpDispatcher;

},{}],67:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getVisitActivities = void 0;
function getVisitActivities(type, visit) {
    var _a;
    var result = {};
    if (visit) {
        var activities = (_a = visit.data) === null || _a === void 0 ? void 0 : _a.activities;
        if (activities) {
            var filtered = activities.filter(function (a) { return a.type == type; });
            filtered.forEach(function (activity) {
                var _a, _b;
                var id = (_a = activity.data) === null || _a === void 0 ? void 0 : _a.id;
                var date = new Date(activity.date);
                if (id && date) {
                    var dates = (_b = result[id]) !== null && _b !== void 0 ? _b : [];
                    dates.push(date);
                    result[id] = dates;
                }
            });
        }
    }
    return result;
}
exports.getVisitActivities = getVisitActivities;

},{}],68:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getSitecoreContextReader = exports.CONTEXT_SOURCE_SITECORE = void 0;
var trackedActivity_1 = require("../../models/trackedActivity");
var patternMatchers_1 = require("./patternMatchers");
var common_1 = require("@uniformdev/common");
var scoring_1 = require("./scoring");
var cookies_1 = require("../../cookies");
var trackers_1 = require("../../trackers");
exports.CONTEXT_SOURCE_SITECORE = "sitecore";
function getSitecoreContextReader(type, logger) {
    if (logger === void 0) { logger = common_1.getNullLogger(); }
    switch (type) {
        case 'cookie':
            return getNotImplementedContextReader(type);
        case 'js':
            return getJsContextReader();
        case 'jss':
            return getJssContextReader();
        case 'default':
        case 'uniform':
            break;
        default:
            logger.info("Sitecore context reader - The specified Sitecore context reader type is not supported. The default type will be used.", { source: type });
    }
    return getUniformContextReader();
}
exports.getSitecoreContextReader = getSitecoreContextReader;
function getNotImplementedContextReader(type) {
    return {
        type: type,
        getTrackedActivity: function (source, context) {
            var visit = context.visit, visitor = context.visitor, _a = context.logger, logger = _a === void 0 ? common_1.getNullLogger() : _a;
            var activity = new trackedActivity_1.TrackedActivityResults(visit, visitor);
            if (source !== "sitecore") {
                return activity;
            }
            logger.error("Sitecore context reader - Context reader not implemented.", { source: source, type: this.type });
            return activity;
        }
    };
}
function getJsContextReader() {
    return {
        type: "js",
        getTrackedActivity: function (source, readerContext) {
            var _a;
            var url = readerContext.url, context = readerContext.context, visit = readerContext.visit, visitor = readerContext.visitor, date = readerContext.date, _b = readerContext.logger, logger = _b === void 0 ? common_1.getNullLogger() : _b;
            var activity = new trackedActivity_1.TrackedActivityResults(visit, visitor);
            if (source !== "sitecore") {
                return activity;
            }
            var tracking = (_a = context === null || context === void 0 ? void 0 : context.tracking) !== null && _a !== void 0 ? _a : {};
            logger.debug("JS context reader - Reading tracking activity from context.", { tracking: tracking, context: context });
            var context2 = {
                page: {
                    item: tracking.item,
                    url: url
                },
                goals: tracking.goals,
                pageEvents: tracking.events,
                campaigns: tracking.campaigns,
                profiles: tracking.profiles
            };
            doSetActivityResults(context2, date, activity, logger);
            return activity;
        }
    };
}
function getTrackingForJss(readerContext, logger) {
    var _a, _b;
    var context = readerContext.context;
    if ((_b = (_a = context === null || context === void 0 ? void 0 : context.sitecore) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.tracking) {
        logger.debug("JSS context reader - Tracking data retrieved from context.sitecore.context.tracking.", context);
        return context.sitecore.context.tracking;
    }
    if (context === null || context === void 0 ? void 0 : context.tracking) {
        logger.debug("JSS context reader - Tracking data retrieved from context.tracking.", context);
        return context.tracking;
    }
    return undefined;
}
function getJssContextReader() {
    return {
        type: "jss",
        getTrackedActivity: function (source, readerContext) {
            var _a;
            var url = readerContext.url, context = readerContext.context, visit = readerContext.visit, visitor = readerContext.visitor, date = readerContext.date, _b = readerContext.logger, logger = _b === void 0 ? common_1.getNullLogger() : _b;
            var activity = new trackedActivity_1.TrackedActivityResults(visit, visitor);
            if (source !== "sitecore") {
                return activity;
            }
            var tracking = (_a = getTrackingForJss(readerContext, logger)) !== null && _a !== void 0 ? _a : {};
            logger.debug("JSS context reader - Reading tracking activity from context.", { tracking: tracking, context: context });
            var context2 = {
                page: {
                    item: tracking.item,
                    url: url
                },
                goals: tracking.goals,
                pageEvents: tracking.events,
                campaigns: tracking.campaigns,
                profiles: tracking.profiles
            };
            doSetActivityResults(context2, date, activity, logger);
            return activity;
        }
    };
}
function getUniformContextReader() {
    return {
        type: "uniform",
        getTrackedActivity: function (source, readerContext) {
            var url = readerContext.url, context = readerContext.context, visit = readerContext.visit, visitor = readerContext.visitor, date = readerContext.date, _a = readerContext.logger, logger = _a === void 0 ? common_1.getNullLogger() : _a;
            var activity = new trackedActivity_1.TrackedActivityResults(visit, visitor);
            if (source !== "sitecore") {
                return activity;
            }
            logger.debug("Uniform context reader - Reading tracking activity from context.", { context: context });
            var tracking = context.tracking;
            var context2 = {
                page: {
                    item: tracking === null || tracking === void 0 ? void 0 : tracking.item,
                    url: url
                },
                goals: tracking === null || tracking === void 0 ? void 0 : tracking.goals,
                pageEvents: tracking === null || tracking === void 0 ? void 0 : tracking.events,
                campaigns: tracking === null || tracking === void 0 ? void 0 : tracking.campaigns,
                profiles: tracking === null || tracking === void 0 ? void 0 : tracking.profiles
            };
            doSetActivityResults(context2, date, activity, logger);
            return activity;
        }
    };
}
function doSetActivityResults(context, date, activity, logger) {
    var _a, _b;
    if (!context.page) {
        logger.debug("Sitecore context reader - No page was found in the context so page view will be tracked.", context);
    }
    else {
        handlePageView(context.page, activity, date, logger);
    }
    //
    //
    if (!context.goals) {
        logger.debug("Sitecore context reader - No goals were found in the context so none will be tracked.", context);
    }
    else {
        handleGoals(context.goals, activity, date, logger);
    }
    //
    //
    if (!context.pageEvents) {
        logger.debug("Sitecore context reader - No page events were found in the context so none will be tracked.", context);
    }
    else {
        handlePageEvents(context.pageEvents, activity, date, logger);
    }
    //
    //
    if (!context.campaigns) {
        logger.debug("Sitecore context reader - No campaigns were found in the context so none will be tracked.", context);
    }
    else {
        handleCampaigns(context.campaigns, activity, date, logger);
    }
    //
    //
    var points = getEngagementValue(context);
    if (points == 0) {
        logger.debug("Sitecore context reader - No changes to engagement value were found in the context so it will not be updated.", context);
    }
    else {
        handleEngagementValue(points, activity, date, logger);
    }
    //
    //
    if (!context.profiles) {
        logger.debug("Sitecore context reader - No profiles were found in the context so none will be tracked.", context);
    }
    else {
        handleProfiles(context.profiles, activity, date, logger);
    }
    //
    //
    var personalization = (_b = (_a = window === null || window === void 0 ? void 0 : window.uniform) === null || _a === void 0 ? void 0 : _a.tracking) === null || _b === void 0 ? void 0 : _b.personalization;
    if (!personalization) {
        logger.debug("Sitecore context reader - No personalization details were found so no origin-generated personalization activity will be tracked. Note: Personalization details will only be included when origin-based personalization occurs. If no origin-based personalization is used, this message indicates things are working as expected.");
    }
    else {
        handlePersonalization(personalization, activity, date, logger);
    }
}
function getEngagementValue(context) {
    if (!(context === null || context === void 0 ? void 0 : context.goals)) {
        return 0;
    }
    var points = 0;
    Object.keys(context.goals).forEach(function (key) {
        var goal = context.goals[key];
        if (!isNaN(goal === null || goal === void 0 ? void 0 : goal.points)) {
            points += goal.points;
        }
    });
    Object.keys(context.pageEvents).forEach(function (key) {
        var pageEvent = context.pageEvents[key];
        if (!isNaN(pageEvent === null || pageEvent === void 0 ? void 0 : pageEvent.points)) {
            points += pageEvent.points;
        }
    });
    return points;
}
function handleEngagementValue(points, activity, date, _logger) {
    if (isNaN(points) || points <= 0) {
        return;
    }
    var doUpdateValue = function (source) {
        var _a, _b;
        if (!source.data) {
            source.data = {};
        }
        var currentValue = (_b = (_a = source.data.value) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : 0;
        source.data.value = {
            date: date,
            data: currentValue + points
        };
    };
    activity.visitUpdateCommands.push(function (visit) {
        doUpdateValue(visit);
    });
    activity.visitorUpdateCommands.push(function (visitor) {
        doUpdateValue(visitor);
    });
}
function handleGoals(goals, activity, date, _logger) {
    if (!goals) {
        return;
    }
    Object.keys(goals).forEach(function (key) {
        var goal = goals[key];
        activity.visitActivities.push({
            type: "goal",
            date: date,
            data: __assign({ id: key }, goal)
        });
    });
}
function handlePageEvents(pageEvents, activity, date, _logger) {
    if (!pageEvents) {
        return;
    }
    Object.keys(pageEvents).forEach(function (key) {
        var pageEvent = pageEvents[key];
        activity.visitActivities.push({
            type: "page event",
            date: date,
            data: __assign({ id: key }, pageEvent)
        });
    });
}
function handlePageView(page, activity, date, _logger) {
    if (!page) {
        return;
    }
    activity.visitActivities.push({
        type: "page view",
        date: date,
        data: page
    });
}
function handlePersonalization(personalization, activity, date, logger) {
    if (!personalization) {
        return;
    }
    Object.keys(personalization).forEach(function (key) {
        var obj = personalization[key];
        if (!obj) {
            logger.error("Sitecore context reader - Key was included in personalization data but no object was set. Personalization data is corrupt.", { key: key });
            return;
        }
        var data = obj.activity;
        if (!data) {
            logger.debug("Sitecore context reader - Key was included in personalization data but no activity was set. This usually means the component has personalization but none of the personalization rules were activated.", { key: key });
            return;
        }
        //
        //With server-side rendering, two separate tasks are performed:
        // 1. Conditional logic determines what content to display.
        // 2. Personalization events are created for the client tracker.
        //
        //The code that creates the personalization events does not know
        //whether the visitor is in a test. The personalization event is
        //the same regardless of whether the visitor is in a test, with
        //the exception of the isIncludedInTest value. 
        //
        //The following code sets this value on the personalization event
        //to the value from the testing cookie. This must happen before 
        //the event is associated with the visit.
        var cookie = cookies_1.getCookie(trackers_1.UniformCookieNames.Testing);
        if (cookie) {
            var parts = cookie.split('|');
            if (parts.length == 2) {
                var included = parts[1] == 'T' ? true : false;
                if (data.isIncludedInTest != true && included) {
                    logger.debug("Sitecore context reader - Setting the isIncludedInTest value on the personalization event to true in order to match the testing cookie value.", { key: key, data: data });
                    data.isIncludedInTest = true;
                }
            }
        }
        var e = {
            type: "personalization",
            date: date,
            data: data
        };
        logger.debug("Sitecore context reader - Adding personalization activity from origin-based personalization.", { event: e });
        activity.visitActivities.push(e);
        logger.debug("Sitecore context reader - Origin-based personalization event was handled, so remove the definition from the collection.", { key: key, personalization: __assign({}, personalization) });
        delete personalization[key];
    });
}
function getStoredProfile(profileId, source) {
    var _a, _b;
    var profilesData = (_b = (_a = source.data) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b.data;
    if (profilesData) {
        return profilesData[profileId];
    }
    return undefined;
}
function getCurrentProfileScoresFromSource(profileId, source) {
    var scores = {};
    var profile = getStoredProfile(profileId, source);
    if (profile) {
        scores.updateCount = profile.updateCount;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            scores[profileKeyId] = profile.keys[profileKeyId].value;
        });
    }
    return scores;
}
function getProfileUpdateCountFromSource(profileId, source) {
    var profile = getStoredProfile(profileId, source);
    if (profile) {
        return profile.updateCount;
    }
    return 0;
}
function updateProfileKeys(updatedScores, currentProfile, profileDefinition) {
    Object.keys(updatedScores.keys).forEach(function (profileKeyId) {
        var updatedProfileKeyValue = updatedScores.keys[profileKeyId];
        //
        //Add the profile key to the current profile if needed.
        if (!currentProfile.keys) {
            currentProfile.keys = {};
        }
        if (!currentProfile.keys[profileKeyId]) {
            currentProfile.keys[profileKeyId] = {};
        }
        //
        //Update the profile name on the current profile.
        if (profileDefinition.name) {
            currentProfile.name = profileDefinition.name;
        }
        //
        //Get the updated profile key name if available.
        var updatedProfileKeyName = undefined;
        if (profileDefinition.keys) {
            var profileKeyDefinition = profileDefinition.keys[profileKeyId];
            if (profileKeyDefinition) {
                updatedProfileKeyName = profileKeyDefinition.name;
            }
        }
        //
        //Update the profile key on the current profile.
        var currentProfileKey = currentProfile.keys[profileKeyId];
        if (updatedProfileKeyName) {
            currentProfileKey.name = updatedProfileKeyName;
        }
        currentProfileKey.value = updatedProfileKeyValue;
    });
}
function applyPatternMatching(matcher, profileDefinition, updatedScores, patternMatches, profileId) {
    if (matcher && profileDefinition.patterns) {
        var match = matcher.match(updatedScores.keys, profileDefinition);
        if (match) {
            var pattern = profileDefinition.patterns[match.patternId];
            var patternMatch = {
                patternId: match.patternId,
                distance: match.distance,
                name: pattern.name
            };
            patternMatches[profileId] = patternMatch;
        }
        else {
            delete patternMatches[profileId];
        }
    }
}
function getUpdatesForTrackedActivityResults(date, profiles, patternMatches) {
    //
    //
    var updates = [];
    if (Object.keys(profiles).length > 0) {
        //
        //Add a visit activity to indicate the profile values were updated.
        if (Object.keys(profiles).length > 0) {
            updates.push({
                type: "profiles",
                date: date,
                data: profiles
            });
        }
        //
        //Add a visit activity to indicate the pattern matches were updated.
        if (Object.keys(patternMatches).length > 0) {
            updates.push({
                type: "patterns",
                date: date,
                data: patternMatches
            });
        }
    }
    return updates;
}
function handleProfiles(profileDefinitions, activity, date, logger) {
    if (!profileDefinitions || !activity.visit) {
        return;
    }
    var matcher = patternMatchers_1.getPatternMatcher();
    if (!matcher) {
        logger.warn("Sitecore context reader - No pattern matcher was resolved, so no pattern matches will be tracked.");
    }
    //
    //Create buffers to store the changes to the visit and visitor.
    //These changes are written to the visit and visitor after all
    //of the profiles are processed.
    var profilesVisit = {};
    var profilesVisitor = {};
    var patternMatchesVisit = {};
    var patternMatchesVisitor = {};
    //
    //For each profile, update the values and pattern matches on the visit.
    Object.keys(profileDefinitions).forEach(function (profileId) {
        //
        //Get the profile key values from the profile.
        var profileDefinition = profileDefinitions[profileId];
        //
        //Get the component responsible for updating the profile values.
        var score = scoring_1.getScorer(profileDefinition.type);
        if (!score) {
            logger.error("Sitecore context reader - No scorer was resolved, so this profile will not be tracked.", profileDefinition);
            return;
        }
        //
        //Get the profile key values to add to the current 
        //profile values. These are used to determine whether
        //to continue with the scoring process, and to provide
        //data for the visit activity event.
        var eventData = {
            id: profileId,
            keys: {}
        };
        Object.keys(profileDefinition.keys).forEach(function (profileKeyId) {
            var profileKey = profileDefinition.keys[profileKeyId];
            eventData.keys[profileKeyId] = profileKey.value;
        });
        //
        //If no scores were set, continue to the next profile.
        if (Object.keys(eventData.keys).length == 0) {
            logger.debug("Sitecore context reader - No profile key values were greater than zero, so this profile will not be tracked.", profileDefinition);
            return;
        }
        //
        //Add a visit activity with the profile key values.
        activity.visitActivities.push({
            type: "profile score",
            date: date,
            data: eventData
        });
        //
        //Get the current profile values for the visit.
        var currentScoresVisit = getCurrentProfileScoresFromSource(profileId, activity.visit);
        var currentUpdateCountVisit = getProfileUpdateCountFromSource(profileId, activity.visit);
        var updatedScoresVisit = score(currentScoresVisit, profileId, profileDefinition, currentUpdateCountVisit);
        //
        //Get the current profile values for the visitor.
        var currentScoresVisitor = getCurrentProfileScoresFromSource(profileId, activity.visitor);
        var currentUpdateCountVisitor = getProfileUpdateCountFromSource(profileId, activity.visitor);
        var updatedScoresVisitor = score(currentScoresVisitor, profileId, profileDefinition, currentUpdateCountVisitor);
        //
        //Update the buffer with names and values for the visit.
        if (!profilesVisit[profileId]) {
            profilesVisit[profileId] = {
                updateCount: 0
            };
        }
        var currentProfileVisit = profilesVisit[profileId];
        //
        //Update the buffer with names and values for the visitor.
        if (!profilesVisitor[profileId]) {
            profilesVisitor[profileId] = {
                updateCount: 0
            };
        }
        var currentProfileVisitor = profilesVisitor[profileId];
        //
        //Keep track of the number of times the profile values
        //are updated. This value is needed to calculate
        //profile values in certain cases (i.e. when the 
        //profile is set to the type "Average").
        currentProfileVisit.updateCount = updatedScoresVisit.updateCount;
        currentProfileVisitor.updateCount = updatedScoresVisitor.updateCount;
        //
        //
        updateProfileKeys(updatedScoresVisit, currentProfileVisit, profileDefinition);
        profilesVisit[profileId] = currentProfileVisit;
        updateProfileKeys(updatedScoresVisitor, currentProfileVisitor, profileDefinition);
        profilesVisitor[profileId] = currentProfileVisitor;
        //
        //Pattern matching.
        applyPatternMatching(matcher, profileDefinition, updatedScoresVisit, patternMatchesVisit, profileId);
        applyPatternMatching(matcher, profileDefinition, updatedScoresVisitor, patternMatchesVisitor, profileId);
    });
    //
    //
    var updatesVisit = getUpdatesForTrackedActivityResults(date, profilesVisit, patternMatchesVisit);
    if (updatesVisit.length == 0) {
        logger.debug("Sitecore context reader - No profile scores changed on the visit, so no profile scoring will be tracked.");
    }
    else {
        updatesVisit.forEach(function (update) {
            activity.visitUpdates.push(update);
        });
    }
    //
    //
    var updatesVisitor = getUpdatesForTrackedActivityResults(date, profilesVisitor, patternMatchesVisitor);
    if (updatesVisitor.length == 0) {
        logger.debug("Sitecore context reader - No profile scores changed on the visitor, so no profile scoring will be tracked.");
    }
    else {
        updatesVisitor.forEach(function (update) {
            activity.visitorUpdates.push(update);
        });
    }
}
function handleCampaigns(campaigns, activity, date, logger) {
    if (!campaigns) {
        return;
    }
    //
    //There should be only 1 campaign. Create visit activity 
    //for each so there is tracking, but only create a visit
    //update for the first campaign.
    var trackableCampaigns = getTrackableCampaigns(campaigns, date, logger);
    if (trackableCampaigns.length == 0) {
        return;
    }
    //
    //Add visit activities
    trackableCampaigns.forEach(function (trackableCampaign) {
        activity.visitActivities.push({
            type: "campaign",
            date: date,
            data: trackableCampaign
        });
    });
    //
    //Add visit update
    activity.visitUpdates.push({
        type: "campaign",
        date: date,
        data: trackableCampaigns[trackableCampaigns.length - 1]
    });
}
function getTrackableCampaigns(campaigns, _date, _logger) {
    var trackableCampaigns = [];
    if (campaigns) {
        for (var key in campaigns) {
            var trackableCampaign = campaigns[key];
            trackableCampaigns.push({
                id: key,
                name: trackableCampaign.name
            });
        }
    }
    return trackableCampaigns;
}

},{"../../cookies":79,"../../models/trackedActivity":86,"../../trackers":103,"./patternMatchers":74,"./scoring":76,"@uniformdev/common":31}],69:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getCookieValueFromVisit = exports.getCookieValueFromVisitor = void 0;
var activities_1 = require("./activities");
/**
 * Gets the values for a property from the visitor
 * in a format that can be set as a cookie value.
 * @param visitor
 */
function getCookieValueFromVisitor(type, visitor) {
    var _a, _b;
    if (visitor === null || visitor === void 0 ? void 0 : visitor.data) {
        if (type == 'patterns') {
            return getValueForCookie((_a = visitor.data.patterns) === null || _a === void 0 ? void 0 : _a.data, function (p) { return p.patternId; });
        }
        if (type == 'profiles') {
            return getValueForCookie((_b = visitor.data.profiles) === null || _b === void 0 ? void 0 : _b.data, function (p) {
                if (p.keys) {
                    var values = [];
                    Object.keys(p.keys).forEach(function (key) {
                        var _a, _b;
                        var value = (_b = (_a = p.keys[key]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
                        if (value > 0) {
                            values.push(key + "_" + value);
                        }
                    });
                    if (values.length > 0) {
                        return values.join("|");
                    }
                }
                return undefined;
            });
        }
    }
    return undefined;
}
exports.getCookieValueFromVisitor = getCookieValueFromVisitor;
;
/**
 * Gets the values for a property from the visit
 * in a format that can be set as a cookie value.
 * @param visit
 */
function getCookieValueFromVisit(type, visit) {
    var _a, _b;
    if (visit === null || visit === void 0 ? void 0 : visit.data) {
        if (type == 'goals') {
            var goals = activities_1.getVisitActivities('goal', visit);
            var value = getValueForCookie(goals, function (dates) {
                return dates.map(function (date) { return date.getTime(); }).join("|");
            });
            return value;
        }
        if (type == 'campaign') {
            return (_b = (_a = visit.data.campaign) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id;
        }
    }
    return undefined;
}
exports.getCookieValueFromVisit = getCookieValueFromVisit;
;
function getValueForCookie(data, getValue) {
    if (data) {
        var values_1 = [];
        Object.keys(data).forEach(function (key) {
            var value = getValue(data[key]);
            if (value) {
                values_1.push(key + "=" + value);
            }
        });
        return values_1.join(",");
    }
    return undefined;
}

},{"./activities":67}],70:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.XdbDestination = void 0;
var XdbDestination = /** @class */ (function () {
    function XdbDestination(init) {
        this.type = "xdb";
        Object.assign(this, init);
    }
    return XdbDestination;
}());
exports.XdbDestination = XdbDestination;

},{}],71:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.XdbDispatcher = void 0;
var axios_1 = __importDefault(require("axios"));
var XdbDispatcher = /** @class */ (function () {
    function XdbDispatcher(settings) {
        this.requiresBrowser = true;
        this.type = "xdb";
        this.httpHeaders = settings === null || settings === void 0 ? void 0 : settings.httpHeaders;
        this.queryStringParameters = settings === null || settings === void 0 ? void 0 : settings.queryStringParameters;
    }
    XdbDispatcher.prototype.dispatchActivity = function (_results, logger) {
        var _this = this;
        var url = window.location.href;
        if (this.queryStringParameters) {
            var startPos = this.queryStringParameters.startsWith('?') ? 1 : 0;
            var qs_1 = this.queryStringParameters.substring(startPos);
            if (qs_1.length > 0) {
                if (window.location.search.length == 0) {
                    url = url + "?" + qs_1;
                }
                else {
                    url = url + "&" + qs_1;
                }
            }
        }
        axios_1["default"]
            .get(url, {
            method: 'GET',
            headers: this.httpHeaders,
            withCredentials: true
        })
            .then(function (response) { return logger.debug("XdbDispatcher - Response received after sending request to Sitecore CD instance.", { response: response, settings: { httpHeaders: _this.httpHeaders, queryStringParameters: _this.queryStringParameters } }); })["catch"](function (err) { return logger.error("XdbDispatcher - Error sending request to Sitecore CD instance.", { url: url, settings: { httpHeaders: _this.httpHeaders, queryStringParameters: _this.queryStringParameters }, err: err }); });
    };
    return XdbDispatcher;
}());
exports.XdbDispatcher = XdbDispatcher;

},{"axios":109}],72:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getGaTrackedActivityConverterForSitecore = void 0;
/**
 * Converts Sitecore-specific events into events for Google Analytics.
 */
function getGaTrackedActivityConverterForSitecore() {
    return {
        type: "default",
        convert: function (activity) {
            switch (activity.type) {
                case "page view":
                    return convertPageView("Sitecore Page View", activity);
                case "page event":
                    return convertEvent("Sitecore Event", activity);
                case "goal":
                    return convertEvent("Sitecore Goal", activity);
                case "personalization":
                    return convertPersonalization("Uniform Personalization", activity);
                default:
                    return undefined;
            }
        }
    };
}
exports.getGaTrackedActivityConverterForSitecore = getGaTrackedActivityConverterForSitecore;
/**
 * Converts page event and goals.
 * @param category
 * @param activity
 */
function convertEvent(category, activity) {
    return {
        category: category,
        action: activity.data.name,
        label: undefined,
        value: activity.data.points
    };
}
/**
 * Converts page view event.
 * @param category
 * @param activity
 */
function convertPageView(category, activity) {
    return {
        category: category,
        action: activity.data.item.id,
        label: activity.data.item.name,
        value: 0
    };
}
/**
 * Converts personalization event.
 * @param category
 * @param activity
 */
function convertPersonalization(category, activity) {
    var _a, _b, _c, _d;
    var pageName = (_b = (_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a.page) === null || _b === void 0 ? void 0 : _b.name;
    var componentName = (_d = (_c = activity === null || activity === void 0 ? void 0 : activity.data) === null || _c === void 0 ? void 0 : _c.component) === null || _d === void 0 ? void 0 : _d.name;
    return {
        category: category,
        action: pageName + "|" + componentName,
        label: activity.data.rule.name,
        value: activity.data.isIncludedInTest
    };
}

},{}],73:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getOracleDmpTrackedActivityConverterForSitecore = void 0;
/**
 * Converts Sitecore-specific events into phints for Oracle DMP.
 */
function getOracleDmpTrackedActivityConverterForSitecore() {
    return {
        type: "default",
        convert: function (activity) {
            switch (activity.type) {
                case "page view":
                    return convertPageView(activity);
                case "campaign":
                    return convertCampaign(activity);
                case "page event":
                    return convertEvent(activity);
                case "goal":
                    return convertEvent(activity);
                case "personalization":
                    return convertPersonalization(activity);
                default:
                    return undefined;
            }
        }
    };
}
exports.getOracleDmpTrackedActivityConverterForSitecore = getOracleDmpTrackedActivityConverterForSitecore;
/**
 * Converts campaigns.
 * @param activity
 */
function convertCampaign(activity) {
    var _a;
    var campaignName = (_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a.name;
    if (!campaignName) {
        return;
    }
    return {
        campaigns: campaignName
    };
}
/**
 * Converts page event and goals.
 * @param activity
 */
function convertEvent(activity) {
    var _a;
    var eventName = (_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a.name;
    // const engagementValue = activity?.data?.points ?? 0;
    if (!eventName) {
        return;
    }
    return {
        events: eventName
    };
}
/**
 * Converts page view event.
 * @param activity
 */
function convertPageView(activity) {
    var _a, _b, _c, _d;
    var itemId = (_b = (_a = activity === null || activity === void 0 ? void 0 : activity.data) === null || _a === void 0 ? void 0 : _a.item) === null || _b === void 0 ? void 0 : _b.id;
    var itemName = (_d = (_c = activity === null || activity === void 0 ? void 0 : activity.data) === null || _c === void 0 ? void 0 : _c.item) === null || _d === void 0 ? void 0 : _d.name;
    return {
        itemId: itemId,
        itemName: itemName
    };
}
/**
 * Converts personalization event.
 * @param activity
 */
function convertPersonalization(_activity) {
    // const pageName = activity?.data?.page?.name;
    // const componentName = activity?.data?.component?.name;
    // const isIncludedInTest = activity?.data?.isIncludedInTest ?? false != true;
    return;
}

},{}],74:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getPatternMatcher = void 0;
var scoring_1 = require("./scoring");
function getPatternMatcher(getDistance) {
    return new DefaultPatternMatcher(getDistance !== null && getDistance !== void 0 ? getDistance : getSquaredDistance);
}
exports.getPatternMatcher = getPatternMatcher;
var DefaultPatternMatcher = /** @class */ (function () {
    function DefaultPatternMatcher(getDistance) {
        this.getDistance = getDistance;
    }
    DefaultPatternMatcher.prototype.match = function (scores, profile) {
        if (!scores || !profile) {
            return undefined;
        }
        var values = Object.keys(scores).map(function (profileKeyId) {
            return scores[profileKeyId];
        });
        return getMatch(values, profile, this.getDistance);
    };
    return DefaultPatternMatcher;
}());
function getMatch(visitorValues, profile, getDistance) {
    var patterns = profile === null || profile === void 0 ? void 0 : profile.patterns;
    if (!patterns) {
        return undefined;
    }
    //
    //If the visitor has no values, no pattern should match.
    if (!visitorValues.find(function (value) { return value > 0; })) {
        return undefined;
    }
    var bestMatchId = undefined;
    var bestMatchPattern;
    var shortestDistance = 0;
    Object.keys(patterns).forEach(function (patternId) {
        var pattern = patterns[patternId];
        var normalizedPatternScores = scoring_1.getNormalizedScores(pattern.keys, profile.keys);
        var patternValues = Object.keys(normalizedPatternScores).map(function (patternId) {
            return normalizedPatternScores[patternId];
        });
        var distance = getDistance(visitorValues, patternValues);
        if (shortestDistance > distance || bestMatchId == undefined) {
            shortestDistance = distance;
            bestMatchId = patternId;
            bestMatchPattern = pattern;
        }
    });
    //
    //
    if (!bestMatchId) {
        return undefined;
    }
    return {
        name: bestMatchPattern === null || bestMatchPattern === void 0 ? void 0 : bestMatchPattern.name,
        patternId: bestMatchId,
        distance: shortestDistance
    };
}
/**
 * Get Euclidean squared distance.
 * @param a
 * @param b
 */
function getSquaredDistance(a, b) {
    var sum = 0;
    var n;
    for (n = 0; n < a.length; n++) {
        sum += Math.pow(a[n] - b[n], 2);
    }
    return Math.sqrt(sum);
}

},{"./scoring":76}],75:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}],76:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getNormalizedScores = exports.getScorerPercentage = exports.getScorerAverage = exports.getScorerSum = exports.getScorer = void 0;
function getScorer(type) {
    switch (type) {
        case "Average":
            return getScorerAverage();
        case "Sum":
            return getScorerSum();
        case "Percentage":
            return getScorerPercentage();
        default:
            return undefined;
    }
}
exports.getScorer = getScorer;
function getScorerSum() {
    return function (currentScores, profileId, profile, updateCount) {
        var newScores = getNormalizedScores(currentScores, profile.keys);
        var scoresChanged = false;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            var profileKey = profile.keys[profileKeyId];
            if (profileKey.value != 0) {
                scoresChanged = true;
            }
            newScores[profileKeyId] += profileKey.value;
        });
        return {
            profileId: profileId,
            keys: newScores,
            updateCount: updateCount + 1,
            scoresChanged: scoresChanged
        };
    };
}
exports.getScorerSum = getScorerSum;
function getScorerAverage() {
    return function (currentScores, profileId, profile, updateCount) {
        var newScores = getNormalizedScores(currentScores, profile.keys);
        var scoresChanged = false;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            var profileKey = profile.keys[profileKeyId];
            if (profileKey.value != 0) {
                scoresChanged = true;
            }
            newScores[profileKeyId] = ((newScores[profileKeyId] * updateCount) + profileKey.value) / (updateCount + 1);
        });
        return {
            profileId: profileId,
            keys: newScores,
            updateCount: updateCount + 1,
            scoresChanged: scoresChanged
        };
    };
}
exports.getScorerAverage = getScorerAverage;
function getScorerPercentage() {
    return function (currentScores, profileId, profile, updateCount) {
        var sum = 0;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            var profileKey = profile.keys[profileKeyId];
            sum += profileKey.value;
        });
        var newScores = getNormalizedScores(currentScores, profile.keys);
        var newUpdateCount = sum > 0 ? updateCount + 1 : updateCount;
        var scoresChanged = false;
        if (sum > 0) {
            Object.keys(profile.keys).forEach(function (profileKeyId) {
                var profileKey = profile.keys[profileKeyId];
                if (profileKey.value != 0) {
                    scoresChanged = true;
                }
                newScores[profileKeyId] = ((newScores[profileKeyId] * updateCount) + (profileKey.value / sum)) / newUpdateCount;
            });
        }
        return {
            profileId: profileId,
            keys: newScores,
            updateCount: newUpdateCount,
            scoresChanged: scoresChanged
        };
    };
}
exports.getScorerPercentage = getScorerPercentage;
function getNormalizedScores(scores, profileKeys) {
    var normalizedScores = {};
    Object.keys(profileKeys).forEach(function (profileKeyId) {
        var _a;
        var currentScore = (_a = scores[profileKeyId]) !== null && _a !== void 0 ? _a : 0;
        normalizedScores[profileKeyId] = currentScore;
    });
    return normalizedScores;
}
exports.getNormalizedScores = getNormalizedScores;

},{}],77:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getSitecoreTracker = exports.SitecoreCookieNames = void 0;
var common_1 = require("@uniformdev/common");
var contextReaders_1 = require("./contextReaders");
var decay_1 = require("../../decay");
var trackers_1 = require("../../trackers");
var SitecoreCookieNames;
(function (SitecoreCookieNames) {
    SitecoreCookieNames["Campaign"] = "UNIFORM_TRACKER_SITECORE_campaign";
    SitecoreCookieNames["Goals"] = "UNIFORM_TRACKER_SITECORE_goals";
    SitecoreCookieNames["PatternMatches"] = "UNIFORM_TRACKER_SITECORE_pattern_matches";
    SitecoreCookieNames["ProfileScores"] = "UNIFORM_TRACKER_SITECORE_profile_scores";
})(SitecoreCookieNames = exports.SitecoreCookieNames || (exports.SitecoreCookieNames = {}));
/**
 * Gets a map of context readers that are able
 * to read Sitecore tracking data.
 * @param args
 * @param logger
 */
function getDefaultContextReadersForSitecoreTracker(args, logger) {
    var _a;
    var reader = contextReaders_1.getSitecoreContextReader((_a = args.type) !== null && _a !== void 0 ? _a : 'default', logger);
    var readers = new Map();
    readers.set(contextReaders_1.CONTEXT_SOURCE_SITECORE, [reader]);
    return readers;
}
/**
 * Adds default context readers to args based on settings in args.
 * @param args
 * @param logger
 */
function addDefaultContextReadersIfNeeded(args, logger) {
    if (args.doNotIncludeDefaultContextReaders == true) {
        logger.debug("getSitecoreTracker - Will not add default context readers.", args);
        return;
    }
    logger.debug("getSitecoreTracker - Adding default context readers.", args);
    var defaultMap = getDefaultContextReadersForSitecoreTracker(args, logger);
    if (!defaultMap) {
        logger.debug("getSitecoreTracker - No default default context readers were retrieved.", args);
        return;
    }
    if (!args.contextReaders) {
        args.contextReaders = defaultMap;
        return;
    }
    Array.from(defaultMap.keys()).forEach(function (key) {
        var _a, _b;
        var defaultReaders = (_a = defaultMap.get(key)) !== null && _a !== void 0 ? _a : [];
        if (defaultReaders.length == 0) {
            return;
        }
        var specifiedReaders = (_b = args.contextReaders.get(key)) !== null && _b !== void 0 ? _b : [];
        defaultReaders.forEach(function (defaultReader) {
            if ((specifiedReaders === null || specifiedReaders === void 0 ? void 0 : specifiedReaders.findIndex(function (specifiedReader) { return specifiedReader.type == defaultReader.type; })) != -1) {
                specifiedReaders.push(defaultReader);
            }
        });
        args.contextReaders.set(key, specifiedReaders);
    });
    args.contextReaders = getDefaultContextReadersForSitecoreTracker(args, logger);
}
/**
 * This function simplifies the process of creating
 * a tracker for a Sitecore site by adding default
 * settings that are needed when tracking data is
 * provided from Sitecore (whether the data comes
 * from JSS Layout Service or the Uniform Page
 * Service).
 * @param args
 * @param logger
 */
function getSitecoreTracker(args, logger) {
    if (!logger) {
        logger = common_1.getNullLogger();
    }
    addDefaultContextReadersIfNeeded(args, logger);
    if (!args.contextReaders) {
        logger.error("getSitecoreTracker - No context readers were resolved for the Sitecore tracker. Without a context reader, the tracker is unable to read trackable data. The null tracker will be used. This tracker does not track anything; it simply writes to the log.", args);
        return undefined;
    }
    logger.debug("getSitecoreTracker - Context reader(s) resolved for Sitecore tracker.", args.contextReaders);
    logger.debug("getSitecoreTracker - Using Sitecore profile decay settings.", args.decay);
    args.extensions = {
        onNewVisitCreated: function (date, visitor, oldVisit, newVisit, logger) {
            var _a, _b;
            var referrer = (_a = window === null || window === void 0 ? void 0 : window.document) === null || _a === void 0 ? void 0 : _a.referrer;
            newVisit.data.referrer = referrer;
            logger.debug("Sitecore tracker extensions - New visit created, so set referrer.", referrer);
            if (oldVisit) {
                var settings = (_b = args.decay) !== null && _b !== void 0 ? _b : decay_1.getDefaultDecaySettings();
                applyProfilesFromOldVisit(settings, date, visitor, oldVisit, newVisit, logger);
            }
        }
    };
    return trackers_1.getDefaultTracker(args, {
        logger: logger
    });
}
exports.getSitecoreTracker = getSitecoreTracker;
function getProfileDataWithDecay(oldData, differenceForDecay, settings, logger) {
    //
    //Add the decayed profile scores into a buffer.
    var newData = {};
    Object.keys(oldData).forEach(function (profileId) {
        var _a;
        var profile = oldData[profileId];
        var keys = {};
        //
        //If, after applying decay, the profile still has values,
        //the update count should be set to 1 to indicate
        var hasValues = false;
        Object.keys(profile.keys).forEach(function (profileKeyId) {
            var _a;
            var oldProfileKey = profile.keys[profileKeyId];
            var newProfileKey = JSON.parse(JSON.stringify(oldProfileKey));
            newProfileKey.value = decay_1.doDecay((_a = newProfileKey.value) !== null && _a !== void 0 ? _a : 0, differenceForDecay, settings, logger);
            if (!hasValues && newProfileKey.value > 0) {
                hasValues = true;
            }
            keys[profileKeyId] = newProfileKey;
        });
        //
        //Since the update count is decayed at the same rate as the 
        //profile, it is possible that the update count will be zero
        //while the decayed profile still has values. In this case,
        //the update count should be set to 1.
        var decayedUpdateCount = decay_1.doDecay((_a = profile.updateCount) !== null && _a !== void 0 ? _a : 0, differenceForDecay, settings, logger);
        if (hasValues && decayedUpdateCount == 0) {
            logger.debug("Sitecore tracker extensions - After decay was applied, the update count for the profile was zero. But since the decayed profile still has values, the update count will be set to one.", { profile: profileId, keys: keys });
            decayedUpdateCount = 1;
        }
        //
        //Set the decayed values on the buffer.
        newData[profileId] = {
            keys: keys,
            name: profile.name,
            updateCount: decay_1.doDecay(profile.updateCount, differenceForDecay, settings, logger)
        };
    });
    return newData;
}
/**
 * Applies the profile scores from an old visit to
 * a new visit and the associated visitor. This is
 * where decay logic is applied to the profile scores.
 * @param settings
 * @param date
 * @param oldVisit
 * @param newVisit
 * @param visitor
 * @param logger
 */
function applyProfilesFromOldVisit(settings, date, visitor, oldVisit, newVisit, logger) {
    var _a, _b;
    if (!oldVisit) {
        return;
    }
    if (!newVisit) {
        logger.error("Sitecore tracker extensions - Cannot copy profiles to new visit when no new visit is provided.", { oldVisitId: oldVisit.id });
        return;
    }
    logger.debug("Sitecore tracker extensions - New visit created, so apply profiles from the old visit.", { date: date, visitorId: visitor.id, oldVisit: oldVisit, newVisit: newVisit });
    //
    //Get values from the old visit
    var profileDataFromOldVisit = (_b = (_a = oldVisit.data) === null || _a === void 0 ? void 0 : _a.profiles) === null || _b === void 0 ? void 0 : _b.data;
    if (!profileDataFromOldVisit) {
        logger.debug("Sitecore tracker extensions - No profile data is set on the old visit, so there are no profiles to copy.", { oldVisitId: oldVisit.id, newVisitId: newVisit.id });
        return;
    }
    //
    //Get the decayed values
    var differenceForDecay = decay_1.getDifferenceAsTimeIncrements(oldVisit.updated, newVisit.updated, settings, logger);
    logger.debug("Sitecore tracker extensions - Profile decay values were determined.", { unit: settings.timeUnit, increments: differenceForDecay });
    var profileDataForNewVisit = getProfileDataWithDecay(profileDataFromOldVisit, differenceForDecay, settings, logger);
    logger.debug("Sitecore tracker extensions - Decayed profile was determined.", { withDecay: profileDataForNewVisit, withoutDecay: profileDataFromOldVisit });
    //
    //Set the decayed values on the new visit
    if (!newVisit.data) {
        newVisit.data = {};
    }
    if (newVisit.data.profiles) {
        logger.debug("Sitecore tracker extensions - The current profiles on the new visit will be replaced with decayed profile from the old visit.", { newVisitId: newVisit.id, current: newVisit.data.profiles });
    }
    logger.debug("Sitecore tracker extensions - The decayed profiles from the old visit will be applied to the new visit.", { oldVisitId: oldVisit.id, newVisitId: newVisit.id, decay: settings, differenceForDecay: differenceForDecay, newProfiles: profileDataForNewVisit });
    var newProfiles = {
        data: profileDataForNewVisit,
        date: date.toISOString()
    };
    newProfiles.date = date.toISOString();
    newVisit.data.profiles = newProfiles;
    //
    //Set the decayed values on the visitor
    if (!visitor) {
        logger.debug("Sitecore tracker extensions - No visitor was specified so the decayed profiles cannot be assigned to the visitor.", { visitorId: oldVisit.visitorId, newProfiles: newProfiles });
        return;
    }
    if (!visitor.data) {
        visitor.data = {};
    }
    logger.debug("Sitecore tracker extensions - The decayed profiles from the old visit will be applied to visitor.", { oldVisitId: oldVisit.id, visitorId: visitor.id, decay: settings, differenceForDecay: differenceForDecay, newProfiles: profileDataForNewVisit });
    visitor.data.profiles = JSON.parse(JSON.stringify(newProfiles));
}

},{"../../decay":80,"../../trackers":103,"./contextReaders":68,"@uniformdev/common":31}],78:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}],79:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.removeCookie = exports.getCookie = exports.setCookie = void 0;
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
exports.setCookie = setCookie;
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return undefined;
}
exports.getCookie = getCookie;
function removeCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
exports.removeCookie = removeCookie;

},{}],80:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getDifferenceAsTimeIncrements = exports.doDecay = exports.getDefaultDecaySettings = void 0;
var DEFAULT_DECAY_RATE = 3;
/**
 * Gets the default decay settings.
 */
function getDefaultDecaySettings() {
    return {
        rate: DEFAULT_DECAY_RATE,
        round: 'default',
        timeUnit: 'default',
        timeIncrement: 1,
        type: 'default'
    };
}
exports.getDefaultDecaySettings = getDefaultDecaySettings;
/**
 * Applies decay to the specified values.
 * @param value
 * @param periods
 * @param settings
 * @param logger
 */
function doDecay(value, periods, settings, logger) {
    if (value <= 0 || periods <= 0) {
        return 0;
    }
    var decay = getDecay(periods, settings.type, settings.rate, logger);
    var valueWithDecay = value * decay;
    return doRounding(valueWithDecay, settings.round, logger);
}
exports.doDecay = doDecay;
/**
 * Calculates the difference between two dates
 * and then determines the number of intervals
 * that difference can be described with.
 *
 * For example, if there are 36 hours between
 * the two dates and the settings specify the
 * decay rate is every 4 hours, 9 is returned.
 * @param oldDate
 * @param newDate
 * @param settings
 * @param logger
 */
function getDifferenceAsTimeIncrements(oldDate, newDate, settings, logger) {
    var _a, _b;
    var time = 0;
    switch ((_a = settings.timeUnit) !== null && _a !== void 0 ? _a : 'default') {
        case 'seconds':
            time = 1000;
            break;
        case 'minutes':
            time = 1000 * 60;
            break;
        case 'hours':
            time = 1000 * 60 * 60;
            break;
        case 'days':
        case 'default':
            time = 1000 * 60 * 60 * 24;
            break;
        default:
            logger.error("The specified decay unit is not supported. No decay will be used.", { settings: settings });
    }
    if (time == 0) {
        return 0;
    }
    var difference = getDateDifference(oldDate, newDate);
    var diffByTime = Math.abs(difference / time);
    var increment = (_b = settings.timeIncrement) !== null && _b !== void 0 ? _b : 1;
    var diffByIncrement = Math.floor(diffByTime / increment);
    return diffByIncrement;
}
exports.getDifferenceAsTimeIncrements = getDifferenceAsTimeIncrements;
function getDate(value) {
    if (typeof value === 'string') {
        return new Date(value);
    }
    return value;
}
function getDateDifference(oldDate, newDate) {
    return getDate(newDate).getTime() - getDate(oldDate).getTime();
}
function getDecay(periods, type, rate, logger) {
    if (type === void 0) { type = 'default'; }
    if (rate === void 0) { rate = DEFAULT_DECAY_RATE; }
    switch (type) {
        case 'compound':
            return Math.pow((1 - rate / 100), periods);
        case 'simple':
        case 'default':
            return (1 - (rate / 100 * periods));
        default:
            logger.error("The specified decay type is not supported. No decay will be used.", { type: type });
    }
    return 1;
}
function doRounding(value, rounding, logger) {
    if (rounding === void 0) { rounding = 'default'; }
    switch (rounding) {
        case 'none':
            return value;
        case 'down':
            return Math.floor(value);
        case 'up':
            return Math.ceil(value);
        case 'closest':
        case 'default':
            break;
        default:
            logger.error("The specified rounding option is not supported. Default rounding will be used.", { value: value, rounding: rounding });
    }
    return Math.round(value);
}

},{}],81:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}],82:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}],83:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./destination"), exports);
__exportStar(require("./dispatcher"), exports);

},{"./destination":81,"./dispatcher":82}],84:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./contextReader"), exports);
__exportStar(require("./connectors/index"), exports);
var decay_1 = require("./decay");
__createBinding(exports, decay_1, "getDefaultDecaySettings");
__exportStar(require("./dispatchers"), exports);
__exportStar(require("./models/index"), exports);
__exportStar(require("./repositories"), exports);
__exportStar(require("./storage"), exports);
__exportStar(require("./trackers"), exports);
__exportStar(require("./cookies"), exports);

},{"./connectors/index":63,"./contextReader":78,"./cookies":79,"./decay":80,"./dispatchers":83,"./models/index":85,"./repositories":91,"./storage":94,"./trackers":103}],85:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./visit"), exports);
__exportStar(require("./visitor"), exports);
__exportStar(require("./trackedActivity"), exports);
__exportStar(require("./utils"), exports);

},{"./trackedActivity":86,"./utils":87,"./visit":88,"./visitor":89}],86:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.QUEUE_ENTRY_TYPE_TRACKER = exports.TrackedActivityResults = exports.VisitorUpdate = exports.VisitUpdate = exports.VisitActivity = exports.TrackedActivity = void 0;
var TrackedActivity = /** @class */ (function () {
    function TrackedActivity(type, date, init) {
        this.type = type;
        this.date = date;
        Object.assign(this, init);
    }
    return TrackedActivity;
}());
exports.TrackedActivity = TrackedActivity;
var VisitActivity = /** @class */ (function (_super) {
    __extends(VisitActivity, _super);
    function VisitActivity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VisitActivity;
}(TrackedActivity));
exports.VisitActivity = VisitActivity;
var VisitUpdate = /** @class */ (function (_super) {
    __extends(VisitUpdate, _super);
    function VisitUpdate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VisitUpdate;
}(TrackedActivity));
exports.VisitUpdate = VisitUpdate;
var VisitorUpdate = /** @class */ (function (_super) {
    __extends(VisitorUpdate, _super);
    function VisitorUpdate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VisitorUpdate;
}(TrackedActivity));
exports.VisitorUpdate = VisitorUpdate;
var TrackedActivityResults = /** @class */ (function () {
    function TrackedActivityResults(visit, visitor) {
        this.visitUpdates = [];
        this.visitUpdateCommands = [];
        this.visitorUpdates = [];
        this.visitorUpdateCommands = [];
        this.visitActivities = [];
        this.visit = visit;
        this.visitor = visitor;
    }
    /**
     * Copies activities and updates from the source into this object.
     * The visit and visitor objects are NOT copied.
     * @param source
     * @param target
     */
    TrackedActivityResults.prototype.append = function (source) {
        var _this = this;
        if (!source) {
            return;
        }
        source.visitActivities.forEach(function (a) { return _this.visitActivities.push(a); });
        source.visitUpdates.forEach(function (a) { return _this.visitUpdates.push(a); });
        source.visitUpdateCommands.forEach(function (a) { return _this.visitUpdateCommands.push(a); });
        source.visitorUpdates.forEach(function (a) { return _this.visitorUpdates.push(a); });
        source.visitorUpdateCommands.forEach(function (a) { return _this.visitorUpdateCommands.push(a); });
    };
    return TrackedActivityResults;
}());
exports.TrackedActivityResults = TrackedActivityResults;
exports.QUEUE_ENTRY_TYPE_TRACKER = "tracker";

},{}],87:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getLatestVisit = exports.appendTrackedActivityResults = void 0;
function appendTrackedActivityResults(source, target) {
    if (!source) {
        return;
    }
    source.visitActivities.forEach(function (a) { return target.visitActivities.push(a); });
    source.visitUpdates.forEach(function (a) { return target.visitUpdates.push(a); });
    source.visitorUpdates.forEach(function (a) { return target.visitorUpdates.push(a); });
}
exports.appendTrackedActivityResults = appendTrackedActivityResults;
function getLatestVisit(visitor) {
    var latest = undefined;
    for (var i = 0; i < visitor.visits.length; i++) {
        var current = visitor.visits[i];
        if (!latest || current.updated > latest.updated) {
            latest = current;
        }
    }
    return latest;
}
exports.getLatestVisit = getLatestVisit;

},{}],88:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.Visit = void 0;
var DEFAULT_DATE = new Date(0).toISOString();
var Visit = /** @class */ (function () {
    function Visit(id, visitorId, start, init) {
        this.updated = DEFAULT_DATE;
        this.id = id;
        this.visitorId = visitorId;
        this.start = start;
        Object.assign(this, init);
    }
    return Visit;
}());
exports.Visit = Visit;

},{}],89:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getCurrentVisit = exports.Visitor = void 0;
var DEFAULT_DATE = new Date(0).toISOString();
var Visitor = /** @class */ (function () {
    function Visitor(id, init) {
        this.updated = DEFAULT_DATE;
        this.visits = [];
        this.id = id;
        Object.assign(this, init);
    }
    return Visitor;
}());
exports.Visitor = Visitor;
function getCurrentVisit(visitor) {
    if (visitor === null || visitor === void 0 ? void 0 : visitor.visits) {
        var filtered = visitor.visits.filter(function (v) { return !v.end; });
        if (filtered.length == 1) {
            return filtered[0];
        }
        return filtered.reduce(function (prev, current) { return (new Date(prev.start) > new Date(current.start)) ? prev : current; });
    }
    return;
}
exports.getCurrentVisit = getCurrentVisit;

},{}],90:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.getTrackingDataRepository = void 0;
var visitor_1 = require("../models/visitor");
var utils_1 = require("../models/utils");
var common_1 = require("@uniformdev/common");
var uuid_1 = require("uuid");
function getTrackingDataRepository(storage, settings) {
    return new DefaultTrackingDataRepository(storage, settings === null || settings === void 0 ? void 0 : settings.subscriptions, settings === null || settings === void 0 ? void 0 : settings.logger);
}
exports.getTrackingDataRepository = getTrackingDataRepository;
var DefaultTrackingDataRepository = /** @class */ (function () {
    function DefaultTrackingDataRepository(storageProvider, subscriptions, logger) {
        this.type = "default";
        this.logger = logger !== null && logger !== void 0 ? logger : common_1.getNullLogger();
        this.storageProvider = storageProvider;
        this.subscriptions = subscriptions;
    }
    DefaultTrackingDataRepository.prototype.getNewVisitId = function () {
        return uuid_1.v4();
    };
    DefaultTrackingDataRepository.prototype.getNewVisitorId = function () {
        return uuid_1.v4();
    };
    /**
     *
     * @param visitor -
     * @param sessionTimeout - Number of minutes of inactivity before a new visit is created.
     * @param logger
     */
    DefaultTrackingDataRepository.prototype.getCurrentVisit = function (visitor, sessionTimeout) {
        var now = new Date();
        var visit = utils_1.getLatestVisit(visitor);
        if (visit) {
            //
            //Determine if the current visit has timed out.
            var timeoutDate = calculateTimeout(visit.updated, sessionTimeout);
            if (now < timeoutDate) {
                var diff = getDifference(timeoutDate, now);
                this.logger.debug('Default tracking data repository - Most recent visit is still active.', {
                    ttl: diff,
                    visit: visit,
                    now: now,
                    end: timeoutDate
                });
                return {
                    current: visit,
                    previous: undefined,
                    isNewVisit: false
                };
            }
            //
            //The visit has timed out, so update the visit.
            visit.end = timeoutDate.toISOString();
            this.saveVisitorNoUpdate(visitor);
            //
            //Publish event.
            this.logger.debug('Default tracking data repository - Most recent visit is no longer active.', visit);
            if (this.subscriptions) {
                this.subscriptions.publish({
                    type: "visit-timeout",
                    when: now,
                    visit: visit,
                    visitor: visitor
                });
            }
        }
        //
        //Create a new visit.
        var newVisit = this.addVisit(visitor, now);
        //
        //Publish event.
        if (this.subscriptions) {
            this.subscriptions.publish({
                type: "visit-created",
                when: new Date(),
                visit: newVisit,
                visitor: visitor
            });
        }
        return {
            current: newVisit,
            previous: visit,
            isNewVisit: true
        };
    };
    /**
     * Get the specified visitor from persistent storage.
     * @param visitorId - Id of the visitor to retrieve.
     * @param logger
     */
    DefaultTrackingDataRepository.prototype.getVisitor = function (visitorId) {
        if (!this.storageProvider) {
            this.logger.error('Default tracking data repository - No storage provider is available, so unable to get data for visitor ' + visitorId);
            return undefined;
        }
        if (visitorId != undefined && visitorId != '') {
            var visitor = this.storageProvider.read(visitorId, this.logger);
            if (visitor) {
                return visitor;
            }
        }
        return undefined;
    };
    DefaultTrackingDataRepository.prototype.createVisitor = function () {
        return this.doCreateVisitor(this.getNewVisitorId());
    };
    DefaultTrackingDataRepository.prototype.doCreateVisitor = function (visitorId) {
        var now = new Date();
        var visitor = new visitor_1.Visitor(visitorId, { updated: now.toISOString() });
        this.storageProvider.write(visitor, this.logger);
        this.logger.debug('Default tracking data repository - New visitor created.', visitor);
        //
        //Publish event.
        if (this.subscriptions) {
            this.subscriptions.publish({
                type: "visitor-created",
                when: new Date(),
                visitor: visitor
            });
        }
        return visitor;
    };
    /**
     * Save the visitor but do not treat it as an update.
     * No events are fired and no updated timestamp is
     * set. This is used in cases like when a visit is
     * determined to have timed out.
     * @param visitor
     */
    DefaultTrackingDataRepository.prototype.saveVisitorNoUpdate = function (visitor) {
        this.storageProvider.write(visitor);
        this.logger.debug('Default tracking data repository - Visitor saved to the repository but update events were fired.', visitor);
    };
    /**
     *
     * @param date
     * @param visitor
     * @param visitChanges
     * @param visitorChanges
     * @param logger
     */
    DefaultTrackingDataRepository.prototype.saveVisitor = function (date, visitor, visitChanges, visitorChanges) {
        //
        //
        visitor.updated = date.toISOString();
        this.storageProvider.write(visitor);
        this.logger.debug('Default tracking data repository - Visitor saved to the repository.', visitor);
        //
        //Publish event.
        if (this.subscriptions) {
            var now = new Date();
            if (visitChanges.size > 0) {
                this.subscriptions.publish({
                    type: "visit-updated",
                    when: now,
                    changes: visitChanges,
                    visitor: visitor
                });
            }
            if (visitorChanges.length > 0) {
                this.subscriptions.publish({
                    type: "visitor-updated",
                    when: now,
                    changes: visitorChanges,
                    visitor: visitor
                });
            }
        }
    };
    /**
     * Creates a new visit and associates it with the specified visitor.
     * @param visitor - Visitor to associate with the visit.
     * @param when -
     * @param logger -
     */
    DefaultTrackingDataRepository.prototype.addVisit = function (visitor, when) {
        var updated = when.toISOString();
        visitor.updated = updated;
        var visit = {
            id: this.getNewVisitId(),
            visitorId: visitor.id,
            start: updated,
            updated: updated,
            data: {}
        };
        this.logger.debug('Default tracking data repository - New visit created.', visit);
        if (!visitor.visits) {
            visitor.visits = [];
        }
        visitor.visits.push(visit);
        this.storageProvider.write(visitor);
        return visit;
    };
    return DefaultTrackingDataRepository;
}());
/**
 * Returns a new Date by adding the timeout to an existing date.
 * @param date - The date.
 * @param timeout - Number of minutes to add to the date.
 */
function calculateTimeout(date, timeout) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return new Date(date.getTime() + timeout * 1000 * 60);
}
/**
 *
 * @param date1
 * @param date2
 */
function getDifference(date1, date2) {
    if (typeof date1 === 'string') {
        date1 = new Date(date1);
    }
    if (typeof date2 === 'string') {
        date2 = new Date(date2);
    }
    var diff = date1.getTime() - date2.getTime();
    var ms = diff % 1000;
    var sec = Math.floor((diff / 1000) % 60);
    var min = Math.floor((diff / 1000 / 60) % 60);
    var hours = Math.floor((diff / 1000 / 60 / 60) % 60);
    var days = Math.floor(diff / 1000 / 60 / 60 / 24);
    return { diff: diff, milliseconds: ms, seconds: sec, minutes: min, hours: hours, days: days };
}

},{"../models/utils":87,"../models/visitor":89,"@uniformdev/common":31,"uuid":135}],91:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./defaultRepository"), exports);
__exportStar(require("./repository"), exports);

},{"./defaultRepository":90,"./repository":92}],92:[function(require,module,exports){
'use strict';
exports.__esModule = true;

},{}],93:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var localStorage_1 = require("./localStorage");
function getStorageProvider(storage, getCustomProvider, logger) {
    switch (storage) {
        case 'custom':
            var provider = getCustomProvider ? getCustomProvider() : undefined;
            if (!provider) {
                logger.error('When the custom storage provider type is specified, getCustomProvider must return a provider.', { storage: storage });
            }
            return provider;
        case 'default':
        case 'local':
            break;
        default:
            logger.error('The storage option specified for the tracker is not supported. Default storage provider will be used.', { storage: storage });
    }
    return new localStorage_1.LocalStorageProvider();
}
exports["default"] = getStorageProvider;

},{"./localStorage":95}],94:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./provider"), exports);
__exportStar(require("./getStorageProvider"), exports);

},{"./getStorageProvider":93,"./provider":96}],95:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.LocalStorageProvider = void 0;
var LocalStorageProvider = /** @class */ (function () {
    function LocalStorageProvider() {
    }
    LocalStorageProvider.prototype.read = function (visitorId, _logger) {
        if (visitorId) {
            var value = localStorage.getItem(visitorId);
            if (value) {
                return JSON.parse(value);
            }
        }
        return undefined;
    };
    LocalStorageProvider.prototype.write = function (visitor, _logger) {
        if (visitor && visitor.id) {
            localStorage.setItem(visitor.id, JSON.stringify(visitor));
        }
    };
    return LocalStorageProvider;
}());
exports.LocalStorageProvider = LocalStorageProvider;

},{}],96:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getStorageProvider = void 0;
var localStorage_1 = require("./localStorage");
function getStorageProvider(storage, getCustomProvider, logger) {
    switch (storage) {
        case 'custom':
            var provider = getCustomProvider ? getCustomProvider() : undefined;
            if (!provider) {
                logger.error('When the custom storage provider type is specified, getCustomProvider must return a provider.', { storage: storage });
            }
            return provider;
        case 'default':
        case 'local':
            break;
        default:
            logger.error('The storage option specified for the tracker is not supported. Default storage provider will be used.', { storage: storage });
    }
    return new localStorage_1.LocalStorageProvider();
}
exports.getStorageProvider = getStorageProvider;

},{"./localStorage":95}],97:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.DefaultTracker = void 0;
var utils_1 = require("./utils");
var trackedActivity_1 = require("../models/trackedActivity");
var common_1 = require("@uniformdev/common");
/**
 * Default implementation of the Uniform tracker.
 */
var DefaultTracker = /** @class */ (function () {
    function DefaultTracker(settings) {
        var _a, _b, _c, _d, _e;
        this.contextReaders = new Map();
        this.state = 'unknown';
        this.contextReaders = (_a = settings.contextReaders) !== null && _a !== void 0 ? _a : new Map();
        this.dispatchers = (_b = settings.dispatchers) !== null && _b !== void 0 ? _b : [];
        this.logger = (_c = settings.logger) !== null && _c !== void 0 ? _c : common_1.getNullLogger();
        this.extensions = settings.extensions;
        this.repository = settings.repository;
        this.sessionTimeout = (_d = settings.sessionTimeout) !== null && _d !== void 0 ? _d : 20;
        this.subscriptions = (_e = settings.subscriptions) !== null && _e !== void 0 ? _e : common_1.getSubscriptionManager();
    }
    DefaultTracker.prototype.event = function (type, e, settings) {
        var _this = this;
        this.logger.debug('Default tracker - Start event() handling.', { event: e, settings: settings });
        var callback = function (_date, activity) {
            switch (type) {
                case "visit-activity":
                    activity.visitActivities.push(e);
                    break;
                case "visit-update":
                    activity.visitUpdates.push(e);
                    break;
                case "visitor-update":
                    activity.visitorUpdates.push(e);
                    break;
                default:
                    _this.logger.error("Default tracker - Specified event type is not supported. Event will not be captured.", { type: type, event: e });
            }
        };
        var results = this.doTracking(settings, callback);
        this.logger.debug('Default tracker - Finished event() handling.', { results: results });
        return results;
    };
    DefaultTracker.prototype.initialize = function (settings) {
        this.logger.debug('Default tracker - Start initialize() handling.', { settings: settings });
        var results = this.doTracking(settings, function (_date, _activity) { });
        this.logger.debug('Default tracker - Finished initialize() handling.', { results: results });
        return results;
    };
    DefaultTracker.prototype.subscribe = function (type, callback) {
        return this.subscriptions.subscribe(type, callback);
    };
    DefaultTracker.prototype.track = function (source, context, settings) {
        var _this = this;
        this.logger.debug('Default tracker - Start track() handling.', { source: source, context: context, settings: settings });
        var callback = function (date, activity) {
            var visit = activity.visit, visitor = activity.visitor;
            //
            //Get the url
            var url = new URL(window === null || window === void 0 ? void 0 : window.location.href);
            //
            //Make sure at least one context reader is available.
            var readers = source ? _this.contextReaders.get(source) : undefined;
            if (!readers) {
                _this.logger.warn('Default tracker - No context readers are registered for the source. No tracking data will be created.', { source: source });
                return;
            }
            //
            //Use the context reader to determine the tracked activity.
            var readerContext = {
                date: date, context: context, visit: visit, visitor: visitor, url: url,
                logger: _this.logger
            };
            _this.contextReaders.forEach(function (readers, id) {
                _this.logger.debug('Default tracker - Reading activity from context using context readers.', { id: id, readers: readers });
                readers.forEach(function (reader) {
                    var activity2 = reader.getTrackedActivity(source, readerContext);
                    _this.logger.debug('Default tracker - Activity read from reader.', { type: reader.type, activity: activity2 });
                    activity.append(activity2);
                });
            });
        };
        var results = this.doTracking(settings, callback);
        this.logger.debug('Default tracker - Finished track() handling.', { results: results });
        return results;
    };
    DefaultTracker.prototype.doTracking = function (settings, callback) {
        var _this = this;
        var _a;
        this.logger.debug('Default tracker - Start doTracking().');
        var visitorId = settings.visitorId, _b = settings.createVisitor, createVisitor = _b === void 0 ? false : _b;
        var visitor = undefined;
        var visit = undefined;
        //
        //
        var activity = new trackedActivity_1.TrackedActivityResults();
        var date = new Date().toISOString();
        try {
            //
            //Get the visitor.
            if (visitorId) {
                visitor = this.repository.getVisitor(visitorId);
            }
            if (!visitor) {
                if (!createVisitor) {
                    this.logger.error('Default tracker - No visitor was returned from the repository. Tracking will abort.');
                    return activity;
                }
                //
                //Create a new visitor.
                visitor = this.repository.createVisitor();
                if (!visitor) {
                    this.logger.error('Default tracker - Unable to create new visitor. Tracking will abort.');
                    return activity;
                }
            }
            //
            //Get the visit.
            var result = this.repository.getCurrentVisit(visitor, this.sessionTimeout);
            visit = result.current;
            if (!visit) {
                this.logger.error('Default tracker - No visit was returned from the repository. Tracking will abort.');
                return activity;
            }
            if (result.isNewVisit && ((_a = this.extensions) === null || _a === void 0 ? void 0 : _a.onNewVisitCreated)) {
                var now = new Date();
                this.extensions.onNewVisitCreated(now, visitor, result.previous, visit, this.logger);
            }
            //
            //
            activity.visit = visit;
            activity.visitor = visitor;
            //
            //
            callback(date, activity);
            //
            //
            //Determine whether the visit or the visitor changed so
            //handlers can be called. This should be called before
            //any changes are applied to the visit or visitor in
            //case the current state of either is needed.
            var visitChanges = utils_1.getVisitChanges(activity, visit, visitor);
            var visitorChanges = utils_1.getVisitorChanges(activity, visit, visitor);
            //
            //
            if (visitChanges.size == 0 && visitorChanges.length == 0) {
                this.logger.debug('Default tracker - No changes were made to the visit or the visitor, so there is nothing to track.');
            }
            //
            //Update the visit.
            if (activity.visitActivities.length > 0 || activity.visitUpdates.length > 0) {
                visit.updated = date;
            }
            if (!visit.data) {
                visit.data = {};
            }
            if (!visit.data["activities"]) {
                visit.data["activities"] = [];
            }
            activity.visitActivities.forEach(function (activity) {
                visit.data["activities"].push(activity);
            });
            activity.visitUpdates.forEach(function (update) {
                visit.data[update.type] = {
                    date: date,
                    data: update.data
                };
            });
            activity.visitUpdateCommands.forEach(function (command) {
                command(visit);
            });
            //
            //Update the visitor.
            if (!visitor.data) {
                visitor.data = {};
            }
            activity.visitorUpdates.forEach(function (update) {
                visitor.data[update.type] = {
                    date: date,
                    data: update.data
                };
            });
            activity.visitorUpdateCommands.forEach(function (command) {
                command(visitor);
            });
            //
            //Provide a way to perform tasks like recalculating 
            //pattern matches. This logic should be handled by
            //the tracker, not the repository.
            var when = new Date();
            if (this.extensions && this.extensions.onBeforeVisitorSaved) {
                this.extensions.onBeforeVisitorSaved(when, visitor, visitChanges, visitorChanges, this.logger);
            }
            //
            //Save the visitor to persistent storage using the 
            //repository. The repository may trigger events to 
            //notify subscribers that something has changed.
            this.repository.saveVisitor(when, visitor, visitChanges, visitorChanges);
            //
            //Dispatch the results if any dispatchers are specified.
            if (this.dispatchers) {
                var isRunningInBrowser_1 = (typeof window !== 'undefined' && window.document != undefined);
                this.dispatchers.forEach(function (dispatcher) {
                    if (!dispatcher.requiresBrowser || isRunningInBrowser_1) {
                        _this.logger.debug("Default tracker - Dispatching activity.", { type: dispatcher.type, activity: activity });
                        dispatcher.dispatchActivity(activity, _this.logger);
                    }
                });
            }
            //
            //Update global objects.
            this.logger.debug("Default tracker - Updating global object.", { visit: visit, visitor: visitor });
            if (!window.uniform) {
                window.uniform = {};
            }
            window.uniform.tracker = this;
            window.uniform.visit = visit;
            window.uniform.visitor = visitor;
            //
            //Notify subscribers that tracking is finished.
            var trackingFinishedEvent = {
                type: "tracking-finished",
                when: new Date(),
                visit: activity.visit,
                visitor: activity.visitor
            };
            if (settings.silent !== true) {
                this.logger.debug("Default tracker - Notify subscribers that tracking is finished.", { subscriptions: this.subscriptions });
                this.subscriptions.publish(trackingFinishedEvent);
            }
            else {
                this.logger.debug("Default tracker - Tracking settings indicate silent mode. Tracking is finished but subscribers will not be notified.", { subscriptions: this.subscriptions });
            }
        }
        catch (ex) {
            this.logger.error('Default tracker - Error thrown during doTracking().', ex);
        }
        finally {
            this.state = 'ready';
            this.logger.debug('Default tracker - Finished doTracking().');
        }
        return activity;
    };
    return DefaultTracker;
}());
exports.DefaultTracker = DefaultTracker;

},{"../models/trackedActivity":86,"./utils":107,"@uniformdev/common":31}],98:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getDispatchersForGaDestinations = void 0;
var dispatcher_1 = require("../connectors/ga/dispatcher");
var gaEventConverter_1 = require("../connectors/sitecore/gaEventConverter");
function getDispatchersForGaDestinations(destinations, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var dispatchers = [];
    destinations.forEach(function (destination) {
        var dispatcher = getDispatcher(destination, args);
        if (!dispatcher) {
            logger.error(loggerPrefix + " - Unable to get dispatcher for GA destination.", destination);
            return;
        }
        dispatchers.push(dispatcher);
    });
    return dispatchers;
}
exports.getDispatchersForGaDestinations = getDispatchersForGaDestinations;
function getDispatcher(destination, args) {
    if (!destination) {
        return;
    }
    var ga = args.ga, logger = args.logger, loggerPrefix = args.loggerPrefix;
    if (!ga) {
        logger.debug(loggerPrefix + " - No GA settings were specified on args so no GA dispatch will be performed.", args);
        return;
    }
    var initializeGa = ga.initializeGa;
    if (!initializeGa) {
        logger.debug(loggerPrefix + " - No function to initialize GA was specified on args so no GA dispatch will be performed.", args);
        return;
    }
    if (!initializeGa(destination, logger)) {
        logger.debug(loggerPrefix + " - Unable to initialize GA so no GA dispatch will be performed.", destination);
        return;
    }
    var converters = getActivityConverters(destination, args);
    var dispatcher = new dispatcher_1.GaDispatcher(converters, destination);
    if (destination.mappings) {
        var mappings_1 = destination.mappings;
        var setValues = function (_results, values) {
            mappings_1.forEach(function (mapping) {
                if (!mapping.action) {
                    return;
                }
                var action = new Function(mapping.action);
                var result = action();
                if (result) {
                    values.set(mapping.index, result);
                }
            });
        };
        dispatcher.setCustomDimensionValues = setValues;
    }
    return dispatcher;
}
/**
 * Gets the tracked activity converters for the specified destination.
 * @param destination
 * @param logger
 */
function getActivityConverters(destination, args) {
    var _a;
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var converters = (_a = destination.activityConverters) !== null && _a !== void 0 ? _a : [];
    if (destination.doNotUseDefaultActivityConverter != true) {
        var converter_1 = gaEventConverter_1.getGaTrackedActivityConverterForSitecore();
        if (converter_1) {
            if (converters.every(function (c) { return c.type != converter_1.type; })) {
                converters.push(converter_1);
                logger.debug(loggerPrefix + " - Added default GA tracked activity converter for Sitecore.", { converters: converters });
            }
        }
    }
    return converters;
}

},{"../connectors/ga/dispatcher":62,"../connectors/sitecore/gaEventConverter":72}],99:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.getDefaultTracker = void 0;
var repositories_1 = require("../repositories");
var storage_1 = require("../storage");
var common_1 = require("@uniformdev/common");
var defaultTracker_1 = require("./defaultTracker");
/**
 * This function is usually called by a custom tracker.
 * @param args - Settings that control the tracker that is retrieved.
 * @param args2 - Settings that control how this function works.
 */
function getDefaultTracker(args, args2) {
    var _a;
    //
    //Get the logger.
    var logger = (_a = args2 === null || args2 === void 0 ? void 0 : args2.logger) !== null && _a !== void 0 ? _a : common_1.getNullLogger();
    //
    //Get the storage provider.
    var storageProvider = storage_1.getStorageProvider(args.storage, args.getCustomStorageProvider, logger);
    if (!storageProvider) {
        logger.error("Tracker - No storage provider was resolved. This is required in order to create a tracker.", { settings: args });
        return undefined;
    }
    //
    //Get the repository.
    var repository = repositories_1.getTrackingDataRepository(storageProvider, {
        logger: logger,
        subscriptions: args.subscriptions
    });
    if (!repository) {
        logger.error("Tracker - No tracking data repository was resolved. This is required in order to create a tracker.", { settings: args });
        return undefined;
    }
    logger.debug("Tracker - Using repository type " + repository.type, repository);
    //
    //Get the session timeout value.
    if (!args.sessionTimeout || args.sessionTimeout < 0) {
        logger.debug("Tracker - Session timeout will be determined by the tracker.");
    }
    else {
        logger.debug("Tracker - Session timeout " + args.sessionTimeout + " minute(s).");
    }
    //
    //Create the tracker.
    var settings3 = {
        contextReaders: args.contextReaders,
        dispatchers: args.dispatchers,
        extensions: args.extensions,
        logger: logger,
        repository: repository,
        sessionTimeout: args.sessionTimeout,
        subscriptions: args.subscriptions
    };
    return new defaultTracker_1.DefaultTracker(settings3);
}
exports.getDefaultTracker = getDefaultTracker;

},{"../repositories":91,"../storage":94,"./defaultTracker":97,"@uniformdev/common":31}],100:[function(require,module,exports){
"use strict";
exports.__esModule = true;

},{}],101:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getDispatchersFromTrackingConfig = void 0;
var common_1 = require("@uniformdev/common");
var ga_1 = require("./ga");
var oracleDmp_1 = require("./oracleDmp");
var xdb_1 = require("./xdb");
/**
 * Returns a map of destinations from tracking data, grouped by type.
 * @param trackingData
 * @param args
 */
function getDestinationMapFromTrackingConfig(trackingConfig, args) {
    var _a;
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var map = new Map();
    if (!trackingConfig) {
        logger.warn(loggerPrefix + " - No tracking config was specified.", { args: args });
    }
    var allDestinations = trackingConfig.destinations;
    if ((_a = allDestinations === null || allDestinations === void 0 ? void 0 : allDestinations.length) !== null && _a !== void 0 ? _a : 0 > 0) {
        allDestinations.forEach(function (destination) {
            var _a;
            var type = destination.type;
            var destinations = (_a = map.get(type)) !== null && _a !== void 0 ? _a : [];
            if (destination.configId && destinations.some(function (d) { return d.configId == destination.configId; })) {
                logger.debug(loggerPrefix + " - Destination is included in the tracking data multiple times. It will not be added to the destination map more than once.", destination);
                return;
            }
            destinations.push(destination);
            map.set(type, destinations);
        });
    }
    return map;
}
/**
 * When dispatchers are configured in Sitecore, they
 * are exposed in tracking data as destinations. This
 * function controls the process responsible for
 * converting these destinations into dispatchers.
 * @param trackingConfig
 * @param args
 */
function getDispatchersFromTrackingConfig(trackingConfig, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var dispatchers = [];
    var map = getDestinationMapFromTrackingConfig(trackingConfig, { logger: logger, loggerPrefix: loggerPrefix });
    var keys = Array.from(map.keys());
    keys.forEach(function (key) {
        var _a, _b, _c, _d;
        var destinations = (_a = map.get(key)) !== null && _a !== void 0 ? _a : [];
        if (destinations.length == 0) {
            return;
        }
        switch (key) {
            case "ga":
                if (!args.ga) {
                    logger.error(loggerPrefix + " - GA settings are missing from args so unable to configure GA dispatchers.", args);
                    return;
                }
                var gaDispatchers = (_b = ga_1.getDispatchersForGaDestinations(destinations, args)) !== null && _b !== void 0 ? _b : [];
                if (gaDispatchers.length > 0) {
                    logger.debug(loggerPrefix + " - GA dispatchers were registered.", gaDispatchers);
                    common_1.appendArray(gaDispatchers, dispatchers);
                }
                return;
            case "oracleDmp":
                var oracleDmpDispatchers = (_c = oracleDmp_1.getDispatchersForOracleDmpDestinations(destinations, args)) !== null && _c !== void 0 ? _c : [];
                if (oracleDmpDispatchers.length > 0) {
                    logger.debug(loggerPrefix + " - Oracle DMP dispatchers were registered.", oracleDmpDispatchers);
                    common_1.appendArray(oracleDmpDispatchers, dispatchers);
                }
                return;
            case "xdb":
                var xdbDispatchers = (_d = xdb_1.getDispatchersForXdbDestinations(destinations, args)) !== null && _d !== void 0 ? _d : [];
                if (xdbDispatchers.length > 0) {
                    logger.debug(loggerPrefix + " - xDB dispatchers were registered.", xdbDispatchers);
                    common_1.appendArray(xdbDispatchers, dispatchers);
                }
                return;
            default:
                logger.error(loggerPrefix + " - The specified destination type is not supported.", { type: key, destinations: destinations.length });
                return;
        }
    });
    return dispatchers;
}
exports.getDispatchersFromTrackingConfig = getDispatchersFromTrackingConfig;

},{"./ga":98,"./oracleDmp":105,"./xdb":108,"@uniformdev/common":31}],102:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.setCookiesForSitecoreVisitorUpdated = exports.setCookiesForSitecoreVisitUpdated = exports.setCookiesForSitecoreVisitCreated = exports.getTrackerCookieTypes = exports.addSubscriptionsForTrackerCookies = void 0;
var tracker_1 = require("./tracker");
var cookies_1 = require("../connectors/sitecore/cookies");
var tracker_2 = require("../connectors/sitecore/tracker");
var models_1 = require("../models");
var common_1 = require("@uniformdev/common");
/**
 * Certain tracker data can be configured to be set in cookies.
 * This function adds subscriptions to the tracker to set those
 * cookies.
 * @param subs
 * @params args
 */
function addSubscriptionsForTrackerCookies(subs, args) {
    var cookieTypes = args.cookieTypes;
    if (!cookieTypes || cookieTypes.length == 0) {
        return;
    }
    subs.subscribe("visit-created", function (e) {
        setCookiesForSitecoreVisitCreated(e, args);
    });
    subs.subscribe("visit-updated", function (e) {
        setCookiesForSitecoreVisitUpdated(e, args);
    });
    subs.subscribe("visitor-updated", function (e) {
        setCookiesForSitecoreVisitorUpdated(e, args);
    });
}
exports.addSubscriptionsForTrackerCookies = addSubscriptionsForTrackerCookies;
function getTrackerCookieTypes(trackingConfig) {
    var _a;
    var cookieTypes = [];
    common_1.appendArray((_a = trackingConfig === null || trackingConfig === void 0 ? void 0 : trackingConfig.settings) === null || _a === void 0 ? void 0 : _a.cookies, cookieTypes);
    return cookieTypes;
}
exports.getTrackerCookieTypes = getTrackerCookieTypes;
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
function setCookiesForSitecoreVisitCreated(e, args) {
    var _a, _b, _c, _d;
    var cookieTypes = args.cookieTypes, logger = args.logger, loggerPrefix = args.loggerPrefix, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (cookieTypes.indexOf('visitCount') > -1) {
        var count = (_b = (_a = e.visitor) === null || _a === void 0 ? void 0 : _a.visits.length) !== null && _b !== void 0 ? _b : 0;
        if (count == 0) {
            logger.debug(loggerPrefix + " - Visit created event was triggered. No visits are assigned to the visitor, so removing the cookie for visit count.", { cookie: tracker_1.UniformCookieNames.VisitCount, event: e });
            removeCookie(tracker_1.UniformCookieNames.VisitCount);
        }
        else {
            logger.debug(loggerPrefix + " - Visit created event was triggered. Updating the cookie for visit count.", { cookie: tracker_1.UniformCookieNames.VisitCount, count: (_c = e.visitor) === null || _c === void 0 ? void 0 : _c.visits.length });
            setCookie(tracker_1.UniformCookieNames.VisitCount, (_d = e.visitor) === null || _d === void 0 ? void 0 : _d.visits.length);
        }
    }
    //
    //Remove visit-specific cookies.
    if (cookieTypes.indexOf('goals') > -1) {
        logger.debug(loggerPrefix + " - Visit created event was triggered. Resetting the cookie for goal tracking.", { cookie: tracker_2.SitecoreCookieNames.Goals });
        removeCookie(tracker_2.SitecoreCookieNames.Goals);
    }
}
exports.setCookiesForSitecoreVisitCreated = setCookiesForSitecoreVisitCreated;
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
function setCookiesForSitecoreVisitUpdated(e, args) {
    var cookieTypes = args.cookieTypes, logger = args.logger, loggerPrefix = args.loggerPrefix, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (e.visitor) {
        var visit = models_1.getCurrentVisit(e.visitor);
        if (visit) {
            if (e.changes.get(visit.id)) {
                if (cookieTypes.indexOf('goals') > -1) {
                    var goals = cookies_1.getCookieValueFromVisit('goals', visit);
                    logger.debug(loggerPrefix + " - Visit updated event was triggered. Updating the cookie for goal tracking.", { cookie: tracker_2.SitecoreCookieNames.Goals, visit: visit });
                    if (!goals) {
                        removeCookie(tracker_2.SitecoreCookieNames.Goals);
                    }
                    else {
                        setCookie(tracker_2.SitecoreCookieNames.Goals, goals);
                    }
                }
                if (cookieTypes.indexOf('campaign') > -1) {
                    var campaignId = cookies_1.getCookieValueFromVisit('campaign', visit);
                    logger.debug(loggerPrefix + " - Visit updated event was triggered. Updating the cookie for campaign tracking.", { cookie: tracker_2.SitecoreCookieNames.Campaign, visit: visit });
                    if (!campaignId) {
                        removeCookie(tracker_2.SitecoreCookieNames.Campaign);
                    }
                    else {
                        setCookie(tracker_2.SitecoreCookieNames.Campaign, campaignId);
                    }
                }
            }
        }
    }
}
exports.setCookiesForSitecoreVisitUpdated = setCookiesForSitecoreVisitUpdated;
/**
 * Sets cookie values needed for server-side personalization.
 * @param e
 * @param args
 */
function setCookiesForSitecoreVisitorUpdated(e, args) {
    var cookieTypes = args.cookieTypes, logger = args.logger, loggerPrefix = args.loggerPrefix, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (e.visitor) {
        if (cookieTypes.indexOf('patterns') > -1) {
            var patterns = cookies_1.getCookieValueFromVisitor('patterns', e.visitor);
            logger.debug(loggerPrefix + " - Visitor updated event was triggered. Updating the cookie for pattern match tracking.", { cookie: tracker_2.SitecoreCookieNames.PatternMatches, visitor: e.visitor });
            if (!patterns) {
                removeCookie(tracker_2.SitecoreCookieNames.PatternMatches);
            }
            else {
                setCookie(tracker_2.SitecoreCookieNames.PatternMatches, patterns);
            }
        }
        if (cookieTypes.indexOf('profiles') > -1) {
            var profiles = cookies_1.getCookieValueFromVisitor('profiles', e.visitor);
            logger.debug(loggerPrefix + " - Visitor updated event was triggered. Updating the cookie for profile score tracking.", { cookie: tracker_2.SitecoreCookieNames.ProfileScores, visitor: e.visitor });
            if (!profiles) {
                removeCookie(tracker_2.SitecoreCookieNames.ProfileScores);
            }
            else {
                setCookie(tracker_2.SitecoreCookieNames.ProfileScores, profiles);
            }
        }
    }
}
exports.setCookiesForSitecoreVisitorUpdated = setCookiesForSitecoreVisitorUpdated;

},{"../connectors/sitecore/cookies":69,"../connectors/sitecore/tracker":77,"../models":85,"./tracker":106,"@uniformdev/common":31}],103:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
var tracker_1 = require("./tracker");
__createBinding(exports, tracker_1, "UniformCookieNames");
var getTracker_1 = require("./getTracker");
__createBinding(exports, getTracker_1, "getDefaultTracker");
var nullTracker_1 = require("./nullTracker");
__createBinding(exports, nullTracker_1, "getNullTracker");
__exportStar(require("./handleDestinations"), exports);
__exportStar(require("./handleTrackerEvents"), exports);
__exportStar(require("./global"), exports);
__exportStar(require("./ga"), exports);
__exportStar(require("./oracleDmp"), exports);
__exportStar(require("./xdb"), exports);

},{"./ga":98,"./getTracker":99,"./global":100,"./handleDestinations":101,"./handleTrackerEvents":102,"./nullTracker":104,"./oracleDmp":105,"./tracker":106,"./xdb":108}],104:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getNullTracker = void 0;
var trackedActivity_1 = require("../models/trackedActivity");
function getNullTracker() {
    return new NullTracker();
}
exports.getNullTracker = getNullTracker;
var NullTracker = /** @class */ (function () {
    function NullTracker() {
        this.contextReaders = new Map();
        this.state = "ready";
    }
    NullTracker.prototype.event = function (_type, _e, _settings) {
        return new trackedActivity_1.TrackedActivityResults();
    };
    NullTracker.prototype.initialize = function (_settings) {
        return new trackedActivity_1.TrackedActivityResults();
    };
    NullTracker.prototype.track = function (_source, _context, _settings) {
        return new trackedActivity_1.TrackedActivityResults();
    };
    NullTracker.prototype.subscribe = function (_type, _callback) {
        return function () { return false; };
    };
    return NullTracker;
}());

},{"../models/trackedActivity":86}],105:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getDispatchersForOracleDmpDestinations = void 0;
var dispatcher_1 = require("../connectors/oracleDmp/dispatcher");
var oracleDmpEventConverter_1 = require("../connectors/sitecore/oracleDmpEventConverter");
function getDispatchersForOracleDmpDestinations(destinations, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var dispatchers = [];
    destinations.forEach(function (destination) {
        var dispatcher = getDispatcher(destination, args);
        if (!dispatcher) {
            logger.error(loggerPrefix + " - Unable to get dispatcher for Oracle DMP destination.", destination);
            return;
        }
        dispatchers.push(dispatcher);
    });
    return dispatchers;
}
exports.getDispatchersForOracleDmpDestinations = getDispatchersForOracleDmpDestinations;
function getDispatcher(destination, args) {
    if (!destination) {
        return;
    }
    var oracleDmp = args.oracleDmp, logger = args.logger, loggerPrefix = args.loggerPrefix;
    var initializeFromArgs = oracleDmp === null || oracleDmp === void 0 ? void 0 : oracleDmp.initializeOracleDmp;
    var wasInitialized = initializeFromArgs ? initializeFromArgs(destination, logger) : doInitializeOracleDmp(destination, args);
    if (!wasInitialized) {
        logger.debug(loggerPrefix + " - Unable to initialize Oracle DMP so no Oracle DMP dispatch will be performed.", destination);
        return;
    }
    var converters = getActivityConverters(destination, args);
    var dispatcher = new dispatcher_1.OracleDmpDispatcher(converters, destination);
    return dispatcher;
}
function doInitializeOracleDmp(destination, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    //
    //Add the callback function to window. This function must exist in order for data to be 
    if (!window) {
        logger.error(loggerPrefix + " - Cannot initialize Oracle DMP dispatcher when window is undefined.", destination);
        return false;
    }
    destination.containerIds.forEach(function (containerId) {
        var callbackName = dispatcher_1.getOracleDmpCallbackName(containerId);
        if (!callbackName) {
            logger.error(loggerPrefix + " - Cannot initialize Oracle DMP dispatcher for container because callback name could not be determined.", { containerId: containerId });
            return;
        }
        var callback = function (data) {
            var _a, _b;
            //
            //Use settings from destination.dataHandling to determine 
            //how to handle the data.
            if (!destination.dataHandling) {
                logger.info(loggerPrefix + " - No data handling settings were specified on the Oracle DMP destination, so the callback data will not be handled.", { data: data, destination: destination });
                return;
            }
            var wasDataChanged = false;
            if (data === null || data === void 0 ? void 0 : data.campaigns) {
                if (handleCampaigns(data.campaigns, destination, args)) {
                    wasDataChanged = true;
                }
                ;
            }
            if (wasDataChanged) {
                if (!((_a = window === null || window === void 0 ? void 0 : window.uniform) === null || _a === void 0 ? void 0 : _a.subscriptions)) {
                    logger.info(loggerPrefix + " - Unable to get a reference to the Uniform global subscription manager from the window, so unable to publish event to notify subscribers that Oracle DMP data was handled.", { data: data, destination: destination });
                    return;
                }
                if (!destination.triggerName) {
                    logger.info(loggerPrefix + " - No trigger name is specified on the Oracle DMP destination, so unable to publish event to notify subscribers that Oracle DMP data was handled.", { data: data, destination: destination });
                    return;
                }
                logger.info(loggerPrefix + " - Publishing event to notify subscribers that Oracle DMP data was handled.", { data: data, destination: destination });
                (_b = window.uniform.subscriptions) === null || _b === void 0 ? void 0 : _b.publish({
                    type: destination.triggerName,
                    when: new Date()
                });
            }
        };
        Object.defineProperty(window, callbackName, { get: function () { return callback; } });
    });
    return true;
}
function handleCampaigns(campaigns, destination, args) {
    var handling = destination.dataHandling;
    if (!handling) {
        return false;
    }
    var wasDataChanged = false;
    var dataTypes = ["campaigns", "audiences"];
    dataTypes.forEach(function (dataType) {
        var setting = handling[dataType];
        if (!setting) {
            return;
        }
        if (handleData(dataType, campaigns, function (member) { return member[setting.property]; }, destination, args)) {
            wasDataChanged = true;
        }
    });
    return wasDataChanged;
}
/**
 * Returns true if the data being handled is different from the data that was previously handled.
 * @param dataType
 * @param data
 * @param getValue
 * @param destination
 * @param logger
 */
function handleData(dataType, data, getValue, destination, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    if (!(destination === null || destination === void 0 ? void 0 : destination.dataHandling)) {
        return false;
    }
    if (!Array.isArray(data)) {
        logger.debug(loggerPrefix + " - Oracle DMP " + dataType + " are expected to be an array.", data);
        return false;
    }
    var setting = destination === null || destination === void 0 ? void 0 : destination.dataHandling[dataType];
    if (!setting) {
        logger.debug(loggerPrefix + " - Oracle DMP destination is not configured to handle " + dataType + " data.", { destination: destination, data: data });
        return false;
    }
    switch (setting.type) {
        case "cookie":
            return handleDataToCookie(setting.data, dataType, data, getValue, destination, args);
        default:
            logger.debug(loggerPrefix + " - Unsupported type specified for handling " + dataType + " data from Oracle DMP.", { type: setting.type, data: data });
            return false;
    }
}
function handleDataToCookie(cookieName, dataType, data, getValue, destination, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix, getCookie = args.getCookie, removeCookie = args.removeCookie, setCookie = args.setCookie;
    if (!cookieName) {
        logger.debug(loggerPrefix + " - Oracle DMP destination is configured to save " + dataType + " to a cookie, but the cookie name is not specified. Data will not be saved.", { destination: destination, data: data });
        return false;
    }
    var values = [];
    data.forEach(function (member) {
        var value = getValue(member);
        if (value && values.indexOf(value) == -1) {
            values.push(value);
        }
    });
    var currentValue = getCookie(cookieName);
    if (!currentValue && values.length == 0) {
        logger.debug(loggerPrefix + " - No " + dataType + " were returned from Oracle DMP and no values are currently set in the cookie, so data handling is complete.", { cookie: cookieName, data: data });
        return false;
    }
    if (values.length == 0) {
        logger.debug(loggerPrefix + " - No " + dataType + " were returned from Oracle DMP so the cookie will be deleted.", { cookie: cookieName, data: data });
        removeCookie(cookieName);
        return true;
    }
    var newValue = values.sort().join(',');
    if (newValue == currentValue) {
        return false;
    }
    logger.debug(loggerPrefix + " - Data for " + dataType + " from Oracle DMP will be set on the cookie.", { cookie: cookieName, values: values });
    setCookie(cookieName, newValue);
    return true;
}
/**
 * Gets the tracked activity converters for the specified destination.
 * @param destination
 * @param logger
 */
function getActivityConverters(destination, args) {
    var _a;
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var converters = (_a = destination.activityConverters) !== null && _a !== void 0 ? _a : [];
    if (destination.doNotUseDefaultActivityConverter != true) {
        var converter_1 = oracleDmpEventConverter_1.getOracleDmpTrackedActivityConverterForSitecore();
        if (converter_1) {
            if (converters.every(function (c) { return c.type != converter_1.type; })) {
                converters.push(converter_1);
                logger.debug(loggerPrefix + " - Added default GA tracked activity converter for Sitecore.", { converters: converters });
            }
        }
    }
    return converters;
}

},{"../connectors/oracleDmp/dispatcher":66,"../connectors/sitecore/oracleDmpEventConverter":73}],106:[function(require,module,exports){
'use strict';
exports.__esModule = true;
exports.UniformCookieNames = void 0;
var UniformCookieNames;
(function (UniformCookieNames) {
    UniformCookieNames["Testing"] = "UNIFORM_TRACKER_testing";
    UniformCookieNames["VisitorId"] = "UNIFORM_TRACKER_visitor_id";
    UniformCookieNames["VisitCount"] = "UNIFORM_TRACKER_visit_count";
})(UniformCookieNames = exports.UniformCookieNames || (exports.UniformCookieNames = {}));

},{}],107:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getVisitorChanges = exports.getVisitChanges = void 0;
function getVisitChanges(activity, visit, _visitor) {
    var _a, _b, _c;
    var changes = [];
    if (((_a = activity === null || activity === void 0 ? void 0 : activity.visitActivities) === null || _a === void 0 ? void 0 : _a.length) > 0 || ((_b = activity === null || activity === void 0 ? void 0 : activity.visitUpdates) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        changes.push("activities");
    }
    if (((_c = activity === null || activity === void 0 ? void 0 : activity.visitUpdates) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        activity.visitUpdates.forEach(function (update) {
            if (!changes.includes(update.type)) {
                changes.push(update.type);
            }
        });
    }
    var map = new Map();
    map.set(visit.id, changes);
    return map;
}
exports.getVisitChanges = getVisitChanges;
function getVisitorChanges(activity, _visit, _visitor) {
    var _a;
    var changes = [];
    if (((_a = activity === null || activity === void 0 ? void 0 : activity.visitorUpdates) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        activity.visitorUpdates.forEach(function (update) {
            if (!changes.includes(update.type)) {
                changes.push(update.type);
            }
        });
    }
    return changes;
}
exports.getVisitorChanges = getVisitorChanges;

},{}],108:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.getDispatchersForXdbDestinations = void 0;
var dispatcher_1 = require("../connectors/sitecore/dispatcher");
function getDispatchersForXdbDestinations(destinations, args) {
    var logger = args.logger, loggerPrefix = args.loggerPrefix;
    var dispatchers = [];
    destinations.forEach(function (destination) {
        var dispatcher = getDispatcher(destination, args);
        if (!dispatcher) {
            logger.error(loggerPrefix + " - Unable to get dispatcher for xDB destination.", destination);
            return;
        }
        dispatchers.push(dispatcher);
    });
    return dispatchers;
}
exports.getDispatchersForXdbDestinations = getDispatchersForXdbDestinations;
function getDispatcher(destination, _args) {
    if (!destination) {
        return;
    }
    var dispatcher = new dispatcher_1.XdbDispatcher(destination);
    return dispatcher;
}

},{"../connectors/sitecore/dispatcher":71}],109:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":111}],110:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    if (
      (utils.isBlob(requestData) || utils.isFile(requestData)) &&
      requestData.type
    ) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = unescape(encodeURIComponent(config.auth.password)) || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

},{"../core/buildFullPath":117,"../core/createError":118,"./../core/settle":122,"./../helpers/buildURL":126,"./../helpers/cookies":128,"./../helpers/isURLSameOrigin":130,"./../helpers/parseHeaders":132,"./../utils":134}],111:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":112,"./cancel/CancelToken":113,"./cancel/isCancel":114,"./core/Axios":115,"./core/mergeConfig":121,"./defaults":124,"./helpers/bind":125,"./helpers/spread":133,"./utils":134}],112:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],113:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":112}],114:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],115:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"../helpers/buildURL":126,"./../utils":134,"./InterceptorManager":116,"./dispatchRequest":119,"./mergeConfig":121}],116:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":134}],117:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":127,"../helpers/isAbsoluteURL":129}],118:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":120}],119:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":114,"../defaults":124,"./../utils":134,"./transformData":123}],120:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

},{}],121:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

},{"../utils":134}],122:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":118}],123:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":134}],124:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this,require('_process'))
},{"./adapters/http":110,"./adapters/xhr":110,"./helpers/normalizeHeaderName":131,"./utils":134,"_process":5}],125:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],126:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":134}],127:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],128:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":134}],129:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],130:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":134}],131:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":134}],132:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":134}],133:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],134:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

},{"./helpers/bind":125}],135:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "v1", {
  enumerable: true,
  get: function () {
    return _v.default;
  }
});
Object.defineProperty(exports, "v3", {
  enumerable: true,
  get: function () {
    return _v2.default;
  }
});
Object.defineProperty(exports, "v4", {
  enumerable: true,
  get: function () {
    return _v3.default;
  }
});
Object.defineProperty(exports, "v5", {
  enumerable: true,
  get: function () {
    return _v4.default;
  }
});
Object.defineProperty(exports, "NIL", {
  enumerable: true,
  get: function () {
    return _nil.default;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _version.default;
  }
});
Object.defineProperty(exports, "validate", {
  enumerable: true,
  get: function () {
    return _validate.default;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});

var _v = _interopRequireDefault(require("./v1.js"));

var _v2 = _interopRequireDefault(require("./v3.js"));

var _v3 = _interopRequireDefault(require("./v4.js"));

var _v4 = _interopRequireDefault(require("./v5.js"));

var _nil = _interopRequireDefault(require("./nil.js"));

var _version = _interopRequireDefault(require("./version.js"));

var _validate = _interopRequireDefault(require("./validate.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./nil.js":137,"./parse.js":138,"./stringify.js":142,"./v1.js":143,"./v3.js":144,"./v4.js":146,"./v5.js":147,"./validate.js":148,"./version.js":149}],136:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (let i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = '0123456789abcdef';

  for (let i = 0; i < length32; i += 8) {
    const x = input[i >> 5] >>> i % 32 & 0xff;
    const hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));

  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

var _default = md5;
exports.default = _default;
},{}],137:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports.default = _default;
},{}],138:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports.default = _default;
},{"./validate.js":148}],139:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;
},{}],140:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
// find the complete implementation of crypto (msCrypto) on IE11.
const getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);
const rnds8 = new Uint8Array(16);

function rng() {
  if (!getRandomValues) {
    throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
  }

  return getRandomValues(rnds8);
}
},{}],141:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    const msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (let i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  const l = bytes.length / 4 + 2;
  const N = Math.ceil(l / 16);
  const M = new Array(N);

  for (let i = 0; i < N; ++i) {
    const arr = new Uint32Array(16);

    for (let j = 0; j < 16; ++j) {
      arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }

    M[i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (let i = 0; i < N; ++i) {
    const W = new Uint32Array(80);

    for (let t = 0; t < 16; ++t) {
      W[t] = M[i][t];
    }

    for (let t = 16; t < 80; ++t) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];

    for (let t = 0; t < 80; ++t) {
      const s = Math.floor(t / 20);
      const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

var _default = sha1;
exports.default = _default;
},{}],142:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports.default = _default;
},{"./validate.js":148}],143:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports.default = _default;
},{"./rng.js":140,"./stringify.js":142}],144:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _md = _interopRequireDefault(require("./md5.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;
},{"./md5.js":136,"./v35.js":145}],145:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(require("./stringify.js"));

var _parse = _interopRequireDefault(require("./parse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
},{"./parse.js":138,"./stringify.js":142}],146:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _stringify = _interopRequireDefault(require("./stringify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports.default = _default;
},{"./rng.js":140,"./stringify.js":142}],147:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("./v35.js"));

var _sha = _interopRequireDefault(require("./sha1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;
},{"./sha1.js":141,"./v35.js":145}],148:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regex = _interopRequireDefault(require("./regex.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports.default = _default;
},{"./regex.js":139}],149:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(require("./validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports.default = _default;
},{"./validate.js":148}]},{},[57])(57)
});
