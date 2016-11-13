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
		headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
		json: payload
	}, callback);
}

function registerKeys(name, callback) {
	const payload = {
		type: 'deploy-key'
	};

	fetch('GET', `/project/github/utilitywarehouse/${name}/checkout-key`, null, function(err, res, body) {
		const keys = JSON.parse(body)
		if (keys && keys[0] && keys[0].type === 'deploy-key') {
			return callback();
		}
		fetch('POST', `/project/github/utilitywarehouse/${name}/checkout-key`, payload, callback);
	})
}

function follow(name, callback) {
	fetch('POST', `/project/github/utilitywarehouse/${name}/follow`, null, callback);
}

function build(name, callback) {
	fetch('POST', `/project/github/utilitywarehouse/${name}/tree/master`, null, callback);
}

function addNotification(name, hookUrl, callback) {
	const payload = {
		slack_webhook_url: hookUrl
	};
	fetch('PUT', `/project/github/utilitywarehouse/${name}/settings`, payload, callback);
}

function environment(name, config, callback) {
	const payload = {
		name: 'DOCKER_ID',
		value: config.dockerId
	};
	fetch('POST', `/project/github/utilitywarehouse/${name}/envvar`, payload, (a,b,c) => {
		const payload = {
			name: 'DOCKER_EMAIL',
			value: config.dockerEmail
		};
		fetch('POST', `/project/github/utilitywarehouse/${name}/envvar`, payload, () => {
			const payload = {
				name: 'DOCKER_PASSWORD',
				value: config.dockerPassword
			};
			fetch('POST', `/project/github/utilitywarehouse/${name}/envvar`, payload, () => {
				const payload = {
					name: 'K8S_DEV_TOKEN',
					value: config.k8sDevToken
				};
				fetch('POST', `/project/github/utilitywarehouse/${name}/envvar`, payload, callback);
			});
		});
	});
}

module.exports.setup = (name, config, callback) => {
	registerKeys(name, () => {
		addNotification(name, config.hookUrl, () => {
			environment(name, config, () => {
				follow(name, () => {
					build(name, () => {
						callback();
					});
				});
			});
		});
	});
};

//curl -X POST --header "Content-Type: application/json" -d '{"slack_webhook_url":"hook url"}' https://circleci.com/api/v1.1/project/github/utilitywarehouse/uw-service-partner-network/settings?circle-token=:token

//curl -X POST --header "Content-Type: application/json" -d '{"name":"foo", "value":"bar"}' https://circleci.com/api/v1.1/project/:vcs-type/:username/:project/envvar?circle-token=:token
