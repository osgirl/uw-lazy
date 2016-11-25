const _ = require('lodash');
const inquirer = require('inquirer');

let enabled = true;

module.exports.enable = function(enable) {
	enabled = enable;
}

module.exports.info = function(defaults = {}, callback) {
	if (!enabled) { //pick default answers

		if (!defaults.name) {
			throw 'Cannot run non-interactively without a name';
		}

		if (!defaults.ns) {
			throw 'Cannot run non-interactively without a namespace';
		}

		if (!defaults.description) {
			throw 'Cannot run non-interactively without a description';
		}

		return callback(defaults);
	}

	const name = defaults.name ? defaults.name : undefined;
	const ns = defaults.ns ? defaults.ns : undefined;
	const description = defaults.description ? defaults.description : undefined;

	inquirer.prompt([
		{type: 'input', name: 'name', message: 'name', default: name, },
		{type: 'input', name: 'ns', message: 'namespace', default: ns},
		{type: 'input', name: 'description', message: 'description', default: description},
	]).then(function (answers) {
		callback(answers);
	});
}

module.exports.package = function(source, defaults = {}, previous = {}, callback) {

	function getDefault(key) {
		return previous[key] || defaults[key];
	}

	const questions = [];
	_.forOwn(source, (value, key) => {
			if (!value) {
				questions.push({type: 'input', name: key, message: key, default: getDefault(key)});
			}
	});

	if (!enabled) { //pick default answers
		return callback(_.merge(source, _.reduce(questions, (reduced, question) => {reduced[question.name] = question.default; return reduced}, {})));
	}

	inquirer.prompt(questions).then(function (answers) {
		const packageDescription = _.merge(source, answers);
		callback(packageDescription);
	});
}

module.exports.runtime = function(defaults, callback) {

	const node = defaults.NODE_PORT ? defaults.NODE_PORT : Math.floor(Math.random() * (7500 - 6500 + 1)) + 6500;
	const docker = defaults.DOCKER_PORT ? defaults.DOCKER_PORT : node + 1;

	if (!enabled) {
		return callback({NODE_PORT: node, DOCKER_PORT: docker});
	}

	inquirer.prompt([
		{type: 'input', name: 'NODE_PORT', message: 'NODE_PORT', default: node, },
		{type: 'input', name: 'DOCKER_PORT', message: 'DOCKER_PORT', default: docker},
	]).then(function (answers) {
		callback(answers);
	});

}

module.exports.circle = function(defaults, callback) {
	const hookUrlDefault = defaults.circle ? defaults.circle.hookUrl : undefined;
	const dockerId = defaults.circle && defaults.circle.dockerId ? defaults.circle.dockerId : process.env.DOCKER_ID;
	const dockerEmail = defaults.circle && defaults.circle.dockerEmail ? defaults.circle.dockerEmail : process.env.DOCKER_EMAIL;
	const dockerPassword = defaults.circle && defaults.circle.dockerPassword ? defaults.circle.dockerPassword : process.env.DOCKER_PASSWORD;
	const k8sDevToken = defaults.circle && defaults.circle.k8sDevToken ? defaults.circle.k8sDevToken : undefined;

	if (!enabled) {
		return callback({circle: {
			hookUrl: hookUrlDefault,
			dockerId,
			dockerEmail,
			dockerPassword,
			k8sDevToken
		}});
	}

	inquirer.prompt([
		{type: 'input', name: 'hookUrl', message: 'Slack Hook URL', default: hookUrlDefault },
		{type: 'input', name: 'dockerId', message: 'Docker ID', default: dockerId },
		{type: 'input', name: 'dockerEmail', message: 'Docker Email', default: dockerEmail },
		{type: 'input', name: 'dockerPassword', message: 'Docker Password', default: dockerPassword },
		{type: 'input', name: 'k8sDevToken', message: 'Kubernetes deploy token (dev)', default: k8sDevToken }
	]).then(function (answers) {
		callback({circle: answers});
	});
};
