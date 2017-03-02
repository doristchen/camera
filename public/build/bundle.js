/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global requestAnimationFrame, fetch, URL */

var drawRect = function drawRect(canvasCtx, dimensions) {
  var x = dimensions.x,
      y = dimensions.y,
      w = dimensions.w,
      h = dimensions.h;

  canvasCtx.strokeRect(x, y, w, h);
};

var onSuccessMedia = function onSuccessMedia(stream) {
  var streamVideo = document.querySelector('#stream');
  var feedCanvas = document.querySelector('#feed');
  var width = feedCanvas.width,
      height = feedCanvas.height;

  var feedContext = feedCanvas.getContext('2d');
  var videoSourceUrl = window.URL.createObjectURL(stream);

  document.querySelector('#trainButton').addEventListener('click', function () {
    var personId = document.querySelector('#personId').value;
    fetch('/train', {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        data: feedCanvas.toDataURL('image/png'),
        personId: personId
      })
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
    });
  });

  document.querySelector('#identifyButton').addEventListener('click', function () {
    fetch('/identify', {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        data: feedCanvas.toDataURL('image/png')
      })
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
    });
  });
  console.log('videoSource', videoSourceUrl, width, height);
  streamVideo.autoplay = true;
  streamVideo.src = videoSourceUrl;

  feedContext.drawImage(streamVideo, 0, 0, width, height);

  var renderFeedCanvas = function renderFeedCanvas() {
    feedContext.drawImage(streamVideo, 0, 0, width, height);
    // drawRect(feedContext, {x: 50, y: 50, w: 100, h: 100})
    requestAnimationFrame(renderFeedCanvas);
  };

  requestAnimationFrame(renderFeedCanvas);

  // setTimeout(() => {
  //   fetch('/submit', {
  //     method: 'post',
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8'
  //     },
  //     body: JSON.stringify({
  //       data: feedCanvas.toDataURL('image/png')
  //     })
  //   }).then((res) => {
  //     return res.json()
  //   }).then((data) => {
  //     console.log(data)
  //   })
  // }, 3000)

  var feedImage = feedContext.getImageData(0, 0, width, height);
  console.log(feedImage);
};

navigator.getUserMedia({ 'video': true }, onSuccessMedia, function () {});

/***/ })
/******/ ]);