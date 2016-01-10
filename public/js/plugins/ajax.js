import lscache from 'lscache';

var _xmlParser = new DOMParser(),
	jsonpCallbackId = 0,
	jsonpTimeoutHandler = function(){};

function checkResponseStatus(res) {
	var error;
	if (res.status < 400) {
		return res;
	} else {
		error = new Error(res.statusText);
		error.statusCode = res.status;
		error.response = res;
		throw error;
	}
}

function textParser(res) {
	return res.text();
}

function xmlParser(res) {
	return new Promise(function (resolve) {
		res.text().then(function(text) {
			resolve({
				result: _xmlParser.parseFromString(text, 'application/xml'),
				url: res.url
			});
		});
	});
}

function parseJson(res) {
	return new Promise(function (resolve) {
		res.json().then(function (data) {
			resolve({
				result: data,
				url: res.url
			});
		});
	});
}

function cacheResponse(ttl) {
	return function(data) {
		if (ttl) {
			lscache.set(data.url, data.result, ttl); // Last parameter is TTL in minutes
		}
		return data.result;
	};
}

function getData(url, responseParser, options) {
	var data = lscache.get(url),
		_options = options || { ttl: 0 };
	if (data) {
		return Promise.resolve(data);
	} else {
		return fetch(url)
			.then(checkResponseStatus)
			.then(responseParser)
			.then(cacheResponse(_options.ttl, url));
	}
}

/* ---------------------------------------------------------------------- */

export function getJson(url, options) {
	return getData(url, parseJson, options);
}

export function getXml(url, options) {
	return getData(url, xmlParser, options);
}

export function getText(url, options) {
	return getData(url, textParser, options);
}

export function putJson(url, data) {
	return fetch(url, {
		method: 'put',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(checkResponseStatus);
}


/*
	Idea from http://blog.garstasio.com/you-dont-need-jquery/ajax/#jsonp
*/
export function getJsonp(url, options) {
	var _options = options || { // TODO Merge options
		cache: false,
		callbackParamName: 'callback',
		timeout: 10000
	};

	return new Promise(function(resolve, reject) {
		var script = document.createElement('script'),
			callbackFnName = '_pdJsonpCallback_' + (jsonpCallbackId++),
			toHandler;

		// If we get to the timeout before having the response, we reject the promise
		// so we don't have the client waiting forever and we clear the global function
		// so it doesn't get invoked later, if the response arrives
		toHandler = setTimeout(function() {
			reject(new Error('JsonP timeout: ' + url));
			setTimeout(function() { window[callbackFnName] = jsonpTimeoutHandler; }, 4);
		}, _options.timeout);

		window[callbackFnName] = function(data) {
			resolve(data);
			setTimeout(function() {
				delete window[callbackFnName];
				if (toHandler) { clearTimeout(toHandler); }
			}, 4);
		};

		script.setAttribute('src', url + '&' + _options.callbackParamName + '=' + callbackFnName);
		document.body.appendChild(script);
	});
}
