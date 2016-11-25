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

process.on('unhandledRejection', function(reason, p) {
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
	.option('--no-structure', 'skin file structure')
	.option('--no-package', 'skip generation of package json')
	.option('--no-makefile', 'skip generation of Makefile')
	.option('--no-git', 'skin creation of git repository')
	.option('--no-circle', 'skin circle provisioning')
	.option('--no-docker', 'skip docker setup')
	.option('--structure-only', 'only file structure')
	.option('--package-only', 'only generation of package json')
	.option('--makefile-only', 'only generation of Makefile')
	.option('--git-only', 'only creation of git repository')
	.option('--circle-only', 'only circle provisioning')
	.option('--docker-only', 'only docker setup')
	.action(function(name, directory) {

		if (!directory) {
			directory = name;
		}
		interaction.enable(program.interaction);

		const projectPath = path.resolve(directory);

		output.header(program);
		output.write('Lazying project %s in %s', output.em(name), output.arg(projectPath));
		output.break();

		files.root(projectPath);

		let inputValues = files.restoreValues();

		const structureFunction = (inputSettings, next) => {

			files.structure(projectPath, require(files.path('structure.json')));

			output.ok('directories created');

			next(inputSettings);
		}

		const packageFunction = (inputSettings, next) => {
			output.write('Building package.json:');

			interaction.package(require(files.path('package.json')), _.merge({name, author: 'web-systems@utilitywarehouse.co.uk'}), inputSettings, (result) => {
				inputSettings = _.merge(inputValues, result);

				files.package(result); output.break(); output.ok('package.json created');

				next(inputSettings);
			});
		}

		const makefileFunction = (inputSettings, next) => {
			output.write('Building Makefile:');

			interaction.runtime(inputSettings, (result) => {
				inputSettings = _.merge(inputSettings, result);
				output.break();

				files.makefile(files.path('Makefile'), inputSettings); output.ok('Makefile created');

				next(inputSettings);
			})
		}

		const gitFunction = (inputSettings, next) => {
			output.write('Preparing git repository');

			files.gitignore(files.path('gitignore')); output.ok('.gitignore created');

			output.break();

			github.create(name, inputSettings.description, (repoUrl, created) => {
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

					next(inputSettings);
				})
			})
		}

		const circleFunction = (inputSettings, next) => {
			output.write('Preparing Circle CI');
			files.circle(files.path('circle.yml')); output.ok('circle.yml created');

			interaction.circle(inputSettings, (result) => {
				inputSettings = _.merge(inputSettings, result);

				output.break();

				circle.setup(name, inputSettings.circle, () => {
					output.ok('project registered');
					output.ok('build requested');

					next(inputSettings);
				})
			})
		}

		const dockerFunction = (inputSettings, next) => {
			output.write('Preparing Docker');

			files.dockerignore(files.path('dockerignore')); output.ok('.dockerignore created');
			files.dockerfile(files.path('Dockerfile')); output.ok('Dockerfile created');

			next(inputSettings);
		}

		const finishFunction = () => {
			output.caveats(projectPath);

			output.break();

			output.bye();

			output.break();
		}

		let execStack = [];

		const run = (ins, fn) => {
			fn(ins, (outs) => {

				files.cache(outs);

				const nextFn = execStack.shift();
				if (!nextFn) return;
				run(ins, nextFn);
			})
		}

		if (program.structure) execStack.push(structureFunction);
		if (program.package) execStack.push(packageFunction);
		if (program.makefile) execStack.push(makefileFunction);
		if (program.git) execStack.push(gitFunction);
		if (program.circle) execStack.push(circleFunction);
		if (program.docker) execStack.push(dockerFunction);

		if (program.structureOnly) execStack = [structureFunction];
		if (program.packageOnly) execStack = [packageFunction];
		if (program.makefileOnly) execStack = [makefileFunction];
		if (program.gitOnly) execStack = [gitFunction];
		if (program.circleOnly) execStack = [circleFunction];
		if (program.dockerOnly) execStack = [dockerFunction];

		execStack.push(finishFunction);

		run(inputValues, execStack.shift());


	})
	.parse(process.argv);
