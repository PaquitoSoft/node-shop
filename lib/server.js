'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var consolidate = require('consolidate');
var dust = require('dustjs-linkedin');
var ractive = require('ractive');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var async = require('async');
var _ = require('underscore');

var routes = require('./routes');
var services = require('./services');
var ractiveExtensions = require('./util/ractive-extensions');

var app = express();

app.set('isProductionMode', false);

// view engine setup
// app.engine('dust', consolidate.ractive);
app.engine('dust', ractiveExtensions.renderer);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, '..', 'views'));

app.set('appConfig', require('../package.json'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev', {
	skip: function(req) {
		return req.path.match(/\.js|css|png$/);
	}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

if (app.get('isProductionMode')) {
	app.use(express.static(path.join(__dirname, '..', 'public_dist')));
} else {
	app.use(express.static(path.join(__dirname, '..', 'public')));
}

app.use('/templates', express.static(path.join(__dirname, '..', 'views')));

// Session support
app.use(session({
	secret: '1dfjk.bchv.31nbv,.dsbncmvSDFSD',
	cookie: { maxAge: 3600 * 1000 }, // One hour TTL,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		db: 'node-shop-test'
	})
}));

// Configure custom routes
routes.configure(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log('Path not found:', req.path);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
    	console.log(err.stack);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports.start = function() {

	async.parallel({
		connectToDb: _.partial(services.db.connect, { connectionUrl: 'mongodb://localhost/node-shop-test' })/*,
		configureRactive: ractiveExtensions.config*/
	}, function (err) {
		var server;
		if (err) {
			console.log('ERROR initializing services:', err);
		} else {
			server = app.listen(3000, 5000, function() {
				var host = server.address().address,
					port = server.address().port,
					env = app.get('env');

				console.log('Application listening at http://%s:%s (enviroment: %s)', host, port, env);
			});
		}
	});

};
