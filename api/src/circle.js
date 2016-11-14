if (!process.env.CIRCLE_TOKEN) {
	throw 'process.env.CIRCLE_TOKEN required';
}

const baseUrl = 'https://circleci.com/api/v1.1';
const axios = require('axios');

const http = axios.create({
	baseURL: baseUrl,
	headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
	params: {'circle-token': process.env.CIRCLE_TOKEN},
});

function registerKeys(name) {
	return http.get(`/project/github/utilitywarehouse/${name}/checkout-key`)
		.then((response) => {
			if (response.data.length === 0) {
				return http.post(`/project/github/utilitywarehouse/${name}/checkout-key`, {type: 'deploy-key'});
			}
		});
}

function follow(name) {
	return http.post(`/project/github/utilitywarehouse/${name}/follow`);
}

function build(name) {
	return http.post(`/project/github/utilitywarehouse/${name}/tree/master`);
}

function addNotification(name, hookUrl) {
	return http.put(`/project/github/utilitywarehouse/${name}/settings`, {
		slack_webhook_url: hookUrl
	});
}

function environmentVariable(name, key, value) {
	return http.post(`/project/github/utilitywarehouse/${name}/envvar`, {
		name: key,
		value: value
	});
}

function environment(name, config) {
	return Promise.all([
		environmentVariable(name, 'DOCKER_ID', config.dockerId),
		environmentVariable(name, 'DOCKER_EMAIL', config.dockerEmail),
		environmentVariable(name, 'DOCKER_PASSWORD', config.dockerPassword),
		environmentVariable(name, 'K8S_DEV_TOKEN', config.k8sDevToken)
	]);
}

module.exports.setup = (name, config, callback) => {
	registerKeys(name)
		.then(() => {
			return addNotification(name, config.hookUrl);
		})
		.then(() => {
			return environment(name, config);
		})
		.then(() => {
			return follow(name);
		})
		.then(() => {
			return build(name)
		})
		.then(callback);
};