'use strict';

// Browser storage plugin

var storage = window.localStorage;
var SEPARATOR = '|',
	TYPE_STRING = '#',
	TYPE_OBJECT = '@';

// TTL in seconds
function store(key, value, options) {
	var rawValue = value,
		_options = options || {},
		type = (typeof value === 'string') ? TYPE_STRING : TYPE_OBJECT,
		ttl = _options.ttl || '';

	console.log('Storing value:', value);
	if (type === TYPE_OBJECT) {
		rawValue = JSON.stringify(value);
	}

	rawValue = type + SEPARATOR + ttl + SEPARATOR + rawValue;

	storage.setItem(key, rawValue);
}

function retrieve(key) {
	var rawValue = storage.getItem(key),
		result = rawValue,
		parts;

	if (!result) return result;
	
	parts = rawValue.split(SEPARATOR);

	// Check if value is expired
	if (parts[1] && Date.now() > parts[1]) {
		storage.removeItem(key);
		return null;
	}

	// Parse value if needed
	if (parts[0] === TYPE_OBJECT) {
		result = JSON.parse(parts.slice(2).join(''));
	} else {
		result = parts.slice(2).join('');
	}

	return result;
}

function remove(key) {
	return storage.removeItem(key);
}

function clearAll() {
	return storage.clear();
}

module.exports = {
	store: store,
	retrieve: retrieve,
	remove: remove,
	clearAll: clearAll
};
