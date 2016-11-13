const _ = require('lodash');
const inquirer = require('inquirer');

let enabled = true;

module.exports.enable = function(enable) {
	enabled = enable;
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

	const node = defaults.runtime && defaults.runtime.NODE_PORT ? defaults.runtime.NODE_PORT : Math.floor(Math.random() * (7500 - 6500 + 1)) + 6500;
	const docker = defaults.runtime && defaults.runtime.DOCKER_PORT ? defaults.runtime.DOCKER_PORT : node + 1;

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

module.exports.circleNotification = function(defaults, callback) {
	const hookUrlDefault = defaults.circle ? defaults.circle.hookUrl : undefined;

	if (!enabled) {
		return callback({circle: {hookUrl: hookUrlDefault}});
	}

	inquirer.prompt([
		{type: 'input', name: 'hookUrl', message: 'Slack Hook URL', default: hookUrlDefault }
	]).then(function (answers) {
    callback({circle: answers});
	});
};
