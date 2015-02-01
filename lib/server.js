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
// console.log('clientDataLayer# key:', key, '- attr:', attr);
	if (key) {
		ctx[key] = ctx[key] || {};
		ctx[key][attr] = data;
		context.current().clientDataLayer = ctx;
		// console.log('--->', context.current().clientDataLayer);
		return chunk;
	} else {
		return chunk.write(JSON.stringify(ctx));
	}
};

dust.helpers.set = function _set(chunk, context, bodies, params) {
	context.stack.head[dust.helpers.tap(params.param, chunk, context)] = dust.helpers.tap(params.value, chunk, context);
	return chunk;
}

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
var dustRender = consolidate.dust._render = consolidate.dust.render;
consolidate.dust.render = function(str, options, fn) {
    // console.log(fn.toString());
    // console.log('Options for dust rendering:', options);
    dustRender(str, options, function (err, html) {
        // console.log('COMPILED DUST TEMPLATE:', html);
        console.log(Object.keys(options));

        ractive.components.clientDataLayer = ractive.extend({
        	// onconstruct: function (component) {
        	// 	console.log('Ractive::clientDataLayer# Construct');
        	// 	console.log(component.data);
        	// },
        	oninit: function () {
        		console.log('Ractive::clientDataLayer# Init');
        		console.log(this._parent.data);

        		var ctx = this._parent.data.rDataLayer || {};
        		ctx[this.data.key] = ctx[this.data.key] || {};
        		ctx[this.data.key][this.data.attr] = this.data.value;
        		this._parent.data.rDataLayer = ctx;

    //     		var key = dust.helpers.tap(params.key, chunk, context),
				// 	attr = dust.helpers.tap(params.attr, chunk, context),
				// 	data = dust.helpers.tap(params.data, chunk, context),
				// 	ctx = context.get('clientDataLayer') || {};
				// // console.log('clientDataLayer# key:', key, '- attr:', attr);
				// if (key) {
				// 	ctx[key] = ctx[key] || {};
				// 	ctx[key][attr] = data;
				// 	context.current().clientDataLayer = ctx;
				// 	// console.log('--->', context.current().clientDataLayer);
				// 	return chunk;
				// } else {
				// 	return chunk.write(JSON.stringify(ctx));
				// }
        	},
        	onrender: function () {
        		console.log('Ractive::clientDataLayer# Render');
        		console.log(arguments);
        	},
        	oncomplete: function (a) {
        		console.log('Ractive::clientDataLayer# Complete');
        		console.log(arguments);
        	},
        	onchange: function () {
        		console.log('Ractive::clientDataLayer# Change');
        		console.log(arguments);
        	},
        	onupdate: function () {
        		console.log('Ractive::clientDataLayer# Update');
        		console.log(arguments);
        	},
        	oninsert: function () {
        		console.log('Ractive::clientDataLayer# Insert');
        		console.log(arguments);
        	}
        });

		options.clientDataLayer = function _clientDataLayer(key, attr, value) {
			// console.log('Client Data Layer Helper!!!');
			
			var ctx = this.data.rDataLayer || {};
    		ctx[key] = ctx[key] || {};
    		ctx[key][attr] = value;
    		this.data.rDataLayer = ctx;

    		// console.log(this.data);

    		return '';
		}

		options.rDataLayer = {};

		var t1 = process.hrtime();
        var r = new ractive({
            template: html,
            data: options,
            stripComments: false, // Para no eliminar los condicionales de Internet Explorer
            delimiters: ['{-', '-}']
        });
        console.log('Tiempo en instanciar Ractive:', process.hrtime(t1)[1] / 1000, '(micros)');

        // console.log('COMPILED RACTIVE TEMPLATE:', r.toHTML());
        var t2 = process.hrtime();
        console.log('Tiempo en generar el html a partir de la instancia Ractive:', process.hrtime(t2)[1] / 1000, '(micros)');

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
