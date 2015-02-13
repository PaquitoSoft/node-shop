/*
	Tarea para facilitar el uso del optimizador de RequireJS desde
	el ciclo de gestion del codigo mediante Grunt.
*/
'use strict';

module.exports = function(grunt) {

	grunt.registerMultiTask('requirejs', 'Tarea para ejecutar el optimizador de RequireJS.', function() {
		var theEnd = this.async(),
			configFilePath = this.data.configFile;

		var options = {
			cmd: 'node',
			args: ['node_modules/requirejs/bin/r.js', '-o', configFilePath],
			// Lista de opciones que se le pasan a la funcion child_process que ejecuta este proceso
			opts: {
				stdio: 'inherit',
				stderr: 'inherit'
			}
		};

		// Ejecutamos el proceso
		grunt.util.spawn(options, theEnd);

	});

};