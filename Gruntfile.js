/*
	Fichero para la configuracion de las tareas que gestinan 
	el codigo de la aplicacion.

	Si la ejecucion de GRUNT empieza a ser demasiado lenta, podemos organizar las tareas
	de modo que las dependencias se carguen bajo demanda: 
*/
module.exports = function(grunt) {
	// require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		// Validate JS code (client, server, tests)
		jshint: {
			files: ['app.js', 'lib/**/*.js', 'routes/**/*.js', 'spec/server/**/*.js', 'spec/functional/**/*.js'],
			options: {
				jshintrc: './.jshintrc'
			}
		},

		createJsBundles: {
			all: { // TODO Clean destination directory before beginning
				viewsPath: './views',
				partialsPath: './views/partials',
				destPath: './public/js/bundles'
			}
		},

		extendRjsConfig: {
			all: {
				configFilePath: './tools/requirejs/build.json',
				bundlesDirectory: './public/js/bundles'
			}
		},

		// Optimizador de codigo JS cliente para entorno de produccion
		requirejs: {
			all: {
				configFile: 'tools/requirejs/build_extended.json'
			}
		},

		
		// Tareas de limpieza de archivos
		clean: {
			jsBundles: ['public/js/bundles/**/*'],
			preBuild: {
				options: {
					force: true
				},
				src: ['public_dist']
			}
		},
		
		// Minimiza el codigo JS cliente inline en las plantillas dust indicadas
		minify_inline: {
			options: {},
			files: ['./views/layouts/application.dust']
		}

	});

	
	// Registramos las tareas propias
	grunt.loadTasks('./tools/grunt-tasks');

	// Registramos las tareas de terceros
	// grunt.loadNpmTasks('grunt-simple-mocha');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-concat');
	// grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	// grunt.loadNpmTasks('grunt-istanbul');
	// grunt.loadNpmTasks('grunt-shell');
	// grunt.loadNpmTasks('grunt-plato');
	// grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('build', [
		'clean:jsBundles',
		'createJsBundles',
		'extendRjsConfig',
		'clean:preBuild',
		'requirejs'
	]);

	grunt.registerTask('default', ['build']);

};