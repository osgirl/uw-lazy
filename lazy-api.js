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
		files.structure(projectPath, require('./api/templates/structure.json'));

		output.ok('directories created');

		output.break();

		output.write('Building package.json:');

		let inputSettings = files.restoreValues();

		interaction.package(require('./api/templates/package.json'), _.merge({name, author: 'web-systems@utilitywarehouse.co.uk'}), inputSettings, (result) => {

			inputSettings = _.merge(inputSettings, result);

			files.package(result); output.break(); output.ok('package.json created');

			output.break();
			output.write('Building Makefile:');

			interaction.runtime(inputSettings, (result) => {

				inputSettings = _.merge(inputSettings, result);
				output.break();

				files.makefile('./api/templates/Makefile', inputSettings); output.ok('Makefile created');

				output.break();

				output.write('Preparing git repository');

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

						files.gitignore('./api/templates/gitignore'); output.ok('.gitignore created');

						output.break();

						output.write('Preparing Circle CI');

						output.break();

						files.circle('./api/templates/circle.yml'); output.ok('circle.yml created');

						interaction.circleNotification(inputSettings, (result) => {
							inputSettings = _.merge(inputSettings, result);

							files.cache(inputSettings);

							circle.setup(name, inputSettings.circle, () => {
								output.ok('project registered');
								output.ok('build requested');

								output.break();

								output.write('Preparing Docker');

								output.break();

								files.dockerignore('./api/templates/dockerignore'); output.ok('.dockerignore created');

								files.dockerfile('./api/templates/Dockerfile'); output.ok('Dockerfile created');

								docker.createRepository(name, (err) => {
									if (err) {
										output.error('Failed to create docker hub repository.', err);
									} else {
										output.ok('DockerHub repository created');
									}
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
