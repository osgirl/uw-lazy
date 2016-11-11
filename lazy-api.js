#!/usr/bin/env node

const program = require('commander');
const output = require('./api/src/output');
const path = require('path');
const files = require('./api/src/files');
const interaction = require('./api/src/interaction');
const github = require('./api/src/github');
const circle = require('./api/src/circle');

/**
 *  program execution
 */
program
	.version('0.0.1')
	.arguments('<name> [directory]')
	.usage('lazy api <name>')
	.action(function(name, directory) {

		if (!directory) {
			directory = name;
		}

		const projectPath = path.resolve(directory);

		output.header(program);
		output.write('Creating project %s in %s', output.em(name), output.arg(projectPath));
		output.break();

		files.root(projectPath);
		files.structure(projectPath, require('./api/templates/structure.json'));

		output.ok('directories created');

		output.break();

		output.write('Building package.json:');

		interaction.package(require('./api/templates/package.json'), {name, author: 'web-systems@utilitywarehouse.co.uk'}, (result) => {
			files.package(result); output.break(); output.ok('package.json created');

			files.circle('./api/templates/circle.yml'); output.ok('circle.yml created');

			files.makefile('./api/templates/Makefile'); output.ok('Makefile created');

			files.dockerignore('./api/templates/dockerignore'); output.ok('.dockerignore created');

			files.gitignore('./api/templates/gitignore'); output.ok('.gitignore created');

			output.break();

			output.write('Creating GitHub repository');

			github.create(name, (repoUrl) => {
				output.write('Preparing local repository');

				github.push(projectPath, repoUrl, () => {
					output.write('repository prepared');
					output.write('Registering keys with Circle CI');

					circle.setup(name, () => {});
				});
			});
		});
	})
	.parse(process.argv);
