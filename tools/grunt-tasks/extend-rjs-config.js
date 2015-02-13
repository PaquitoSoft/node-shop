/*
	This task creates a require.js augments a requirejs buid configuration file
	to include APP bundles.
*/
'use strict';

var path = require('path'),
	fs = require('fs'),
	filewalker = require('filewalker');

module.exports = function(grunt) {

	grunt.registerMultiTask('extendRjsConfig', 'Task to include application bundles into r.js configuration.', function() {
		var theEnd = this.async(),
			configFilePath = path.join(process.cwd(), this.data.configFilePath),
			bundlesDirectory = path.join(process.cwd(), this.data.bundlesDirectory),
			configFile = require(configFilePath);

		console.log('Reading bundles directory:', bundlesDirectory);

		filewalker(bundlesDirectory)
			.on('file', function(filePath, fileStats, fileAbsolutePath) {
				console.log('Processing file:', filePath);
				configFile.modules.push({
					name: 'bundles/' + filePath.replace(/\.js$/, ''),
					exclude: ['main']
				});
			})
			.on('error', theEnd)
			.on('done', function() {
				console.log('finishing...');
				fs.writeFile(configFilePath.replace(/\.json$/, '_extended.json'),
					JSON.stringify(configFile), theEnd);
			})
			.walk();
	});

};