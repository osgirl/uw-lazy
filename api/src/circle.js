if (!process.env.CIRCLE_TOKEN) {
	throw "process.env.CIRCLE_TOKEN required";
}

const baseUrl = 'https://circleci.com/api/v1.1';
const request = require('request');

function fetch(method, path, payload, callback) {
	request({
		url: baseUrl + path,
		qs: {'circle-token': process.env.CIRCLE_TOKEN},
		method: method,
		headers: {'Content-Type': 'application/json'},
		json: payload
	}, callback);
}

function registerKeys(name, callback) {
	const payload = {
		type: 'deploy-key'
	};

	fetch('POST', `/project/github/utilitywarehouse/${name}/checkout-key`, payload, callback);
}

function follow(name, callback) {
	fetch('POST', `/project/github/utilitywarehouse/${name}/follow`, null, callback);
}

function build(name, callback) {
	fetch('POST', `/project/github/utilitywarehouse/${name}/tree/master`, null, callback);
}

module.exports.setup = (name, callback) => {
	registerKeys(name, () => {
		follow(name, () => {
			build(name, () => {
				callback();
			});
		});
	});
};