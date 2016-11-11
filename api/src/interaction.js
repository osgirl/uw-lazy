const _ = require('lodash');
const inquirer = require('inquirer');

module.exports.package = function(source, defaults = {}, callback) {
	const questions = [];
	_.forOwn(source, (value, key) => {
			if (!value) {
				questions.push({type: 'input', name: key, message: key, default: defaults[key]});
			}
	});

	inquirer.prompt(questions).then(function (answers) {
		const packageDescription = _.merge(source, answers);
    callback(packageDescription);
	});
}
