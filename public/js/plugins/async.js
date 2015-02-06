(function() {
	'use strict';

	// Async operations plugin
	define(['jquery'], function($) {
		
		function parallel(fns, args, threshold, done) {
			var _fns = fns || [],
				count = fns.length,
				to, checker;

			if (typeof threshold === 'function') {
				done = threshold;
				threshold = 5000;
			}

			if (count) {
				
				checker = function() {
					if (--count <= 0) {
						clearTimeout(to);
						done();
					}
				};

				_fns.forEach(function(fn) {
					if (fn.length > 2) {
						// fn.call(null, context.path, serverData, checker);
						fn.apply(null, args.concat([checker]));
					} else {
						// fn.call(null, context.path, serverData);
						fn.apply(null, args);
						checker();
					}
				});

				to = setTimeout(function() {
					if (count > 0) {
						count = -1;
						console.warn('Async::parallel# Functions execution finished too late.');
						done();
					}
				}, threshold);

			} else {
				done();
			}

		}

		function pParallel(fns, args, threshold) {
			var deferred = $.Deferred();
			parallel(fns, args, threshold, function() {
				deferred.resolve();
			});
			return deferred.promise();
		}

		return {
			parallel: parallel,
			pParallel: pParallel
		};

	});
}());