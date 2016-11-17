#!/usr/bin/env node

const program = require('commander');
const output = require('./api/src/output');
const path = require('path');
const files = require('./api/src/files');
const interaction = require('./api/src/interaction');
const github = require('./api/src/github');
const circle = require('./api/src/circle');
const docker = require('./api/src/docker');
const _ = require('lodash');

process.on('unhandledRejection', function(reason, p){
    output.die(reason);
});

/**
 *  program execution
 */
program
	.version('0.0.1')
	.arguments('<name> [directory]')
	.usage('lazy api <name>')
	.option('--no-interaction', `don't ask questions`)
	.action(function(name, directory) {

		if (!directory) {
			directory = name;
		}

		interaction.enable(program.interaction);

		const projectPath = path.resolve(directory);

		output.header(program);
		output.write('Creating project %s in %s', output.em(name), output.arg(projectPath));
		output.break();

		files.root(projectPath);
		files.structure(projectPath, require(files.path('structure.json')));

		output.ok('directories created');

		output.break();

		output.write('Building package.json:');

		let inputSettings = files.restoreValues();

		interaction.package(require(files.path('package.json')), _.merge({name, author: 'web-systems@utilitywarehouse.co.uk'}), inputSettings, (result) => {
			inputSettings = _.merge(inputSettings, result);

			files.package(result); output.break(); output.ok('package.json created');

			output.break();
			output.write('Building Makefile:');

			interaction.runtime(inputSettings, (result) => {
				inputSettings = _.merge(inputSettings, result);
				output.break();

				files.makefile(files.path('Makefile'), inputSettings); output.ok('Makefile created');

				output.break();

				output.write('Preparing git repository');

				files.dockerignore(files.path('dockerignore')); output.ok('.dockerignore created');
				files.dockerfile(files.path('Dockerfile')); output.ok('Dockerfile created');
				files.gitignore(files.path('gitignore')); output.ok('.gitignore created');
				files.circle(files.path('circle.yml')); output.ok('circle.yml created');

				output.break();

				github.create(name, (repoUrl, created) => {
					if (created) {
						output.ok('remote created');
					} else {
						output.warn('remote already exists, skipping creation');
					}

					github.push(projectPath, repoUrl, (pushed) => {
						if (pushed) {
							output.ok('local prepared');
							output.ok('init code pushed');
						} else {
							output.warn('remote already added, skipping push');
						}

						output.break();

						output.write('Preparing Circle CI');

						interaction.circle(inputSettings, (result) => {
							inputSettings = _.merge(inputSettings, result);

							files.cache(inputSettings);

							output.break();

							circle.setup(name, inputSettings.circle, () => {
								output.ok('project registered');
								output.ok('build requested');

								output.break();

								output.write('Preparing Docker');

								output.break();

								docker.createRepository(name, (err) => {
									if (err) {
										output.error('Failed to create docker hub repository.', err);
									} else {
										output.ok('DockerHub repository created');
									}
									output.break();

									output.caveats(projectPath);

									output.break();

									output.bye();

									output.break();
								});
							});
						});
					});
				});
			});
		});
	})
	.parse(process.argv);
