var zlib = require('zlib'),
	fs = require('fs');

var filePath = __dirname + '/../public_dist/js/main.js';
fs.readFile(filePath, {encoding: 'utf8'}, function(err, content) {
	console.log('Original size:', content.length, 'bytes');
	zlib.gzip(content, function(_err, result) {
		console.log('Compressed size:', result.length, 'bytes');
	});

});