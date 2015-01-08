'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var dust = require('dustjs-linkedin');
var ractive = require('ractive');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes');
var services = require('./services')

var app = express();

// view engine setup
app.engine('dust', consolidate.dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, '..', 'views'));


// Template level helpers
dust.helpers.clientDataLayer = function _clientDataLayer(chunk, context, bodies, params) {
	var key = dust.helpers.tap(params.key, chunk, context),
		attr = dust.helpers.tap(params.attr, chunk, context),
		data = dust.helpers.tap(params.data, chunk, context),
		ctx = context.get('clientDataLayer') || {};
console.log('clientDataLayer# key:', key, '- attr:', attr);
	if (key) {
		ctx[key] = ctx[key] || {};
		ctx[key][attr] = data;
		context.current().clientDataLayer = ctx;
		console.log('--->', context.current().clientDataLayer);
		return chunk;
	} else {
		return chunk.write(JSON.stringify(ctx));
	}
};

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
app.use(express.static(path.join(__dirname, '..', 'public')));

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

// Ractive templates preprocessing
var dustRender = consolidate.dust.render;
consolidate.dust.render = function(str, options, fn) {
    // console.log(fn.toString());
    dustRender(str, options, function (err, html) {
        // console.log('COMPILED DUST TEMPLATE:', html);
        console.log(Object.keys(options));

        var r = new ractive({
            // template: str.replace(/\r|\n|\t/g, ''),
            template: html,
            data: options,
            delimiters: ['{-', '-}']
        });

        fn(err, r.toHTML());
    })
};


module.exports.start = function() {

	services.db.connect({
		connectionUrl: 'mongodb://localhost/node-shop-test'
	}, function() {

		var server = app.listen(3000, 5000, function() {
			var host = server.address().address,
				port = server.address().port,
				env = app.get('env');

			console.log('Application listening at http://%s:%s (enviroment: %s)', host, port, env);
		});

	});

};
