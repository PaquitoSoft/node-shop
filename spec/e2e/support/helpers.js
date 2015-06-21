'use strict';

var fs = require('fs'),
	async = require('async');

var CHECK_EXIST_THRESHOLD = 1000; // milliseconds

var elements = {};

var _css = by.css;

function _getRandom(limit) {
	return Math.floor(Math.random() * (limit - 0));
}
/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
*/

function findEl(selector) {
	// if (!elements[selector]) {
	// 	elements[selector] = driver.findElement(_css(selector));
	// }
	// return elements[selector];

	return driver.findElement(_css(selector));
}

function findEls(selector) {
	// if (!elements[selector]) {
	// 	elements[selector] = driver.findElements(selector);
	// }
	// return elements[selector];

	return driver.findElements(_css(selector));
}

function takeScreenshot(name) {
	var _name = name || 'screenshot-' + Date.now();
	driver.takeScreenshot().then(function(png) {
		fs.writeFileSync('tmp/' + _name + '.png', png, { encoding: 'base64' });
	});
}

function checkElementsCount(selector, count) {
	findEls(selector).then(function(elements) {
	// findEls(by.css(selector)).then(function(elements) {
		console.log('Checking elements count:', selector, '--', count);
		// console.log(arguments);
		expect(elements.length).toEqual(count);
		console.log('Check OK:', selector);
	});
}

function waitForElement(selector, threshold) {
	driver.wait(driver.isElementPresent(_css(selector)), threshold || CHECK_EXIST_THRESHOLD);

	// var count = 0,
	// 	startTime = Date.now();

	// async.whilst(
	// 	function() {
	// 		return count === 1 || Date.now() - startTime > threshold || CHECK_EXIST_THRESHOLD;
	// 	},
	// 	function(done) {
	// 		// findEl(selector).then(function(el) {
	// 		// 	console.log(arguments);
	// 		// });
	// 		driver.isElementPresent(_css(selector)).then(function() {
	// 			console.log(arguments);
	// 		});
	// 	}, function(err) {
	// 		console.log('End checking exists:', err);
	// 	}
	// );
}

function clickElement(selector) {
	console.log('Clicking element:', selector);
	findEl(selector).then(function(el) {
		el.click();
	});
}

function clickRandomElement(selector) {
	findEls(selector).then(function(els) {
		console.log('Clicking this link:', els[_getRandom(els.length)]);
		els[_getRandom(els.length)].click();
	});
}

module.exports = {
	takeScreenshot: takeScreenshot,
	waitForElement: waitForElement,
	checkElementsCount: checkElementsCount,
	clickElement: clickElement,
	clickRandomElement: clickRandomElement
};

