const dockerHubAPI = require('docker-hub-api');

module.exports.createRepository = function(name, callback) {
	dockerHubAPI.login(process.env.DOCKER_ID, process.env.DOCKER_PASSWORD).then(function(info) {
			return dockerHubAPI.createRepository('utilitywarehouse', name, {is_private: true}).then((res)=>{
				if (!res.__all__ || !res.__all__[0] || res.__all__[0].indexOf('already exists') === -1) {
					throw new Error(res.__all__ && res.__all__[0] ? res.__all__[0] : 'failed to create repository');
				}
				return dockerHubAPI.addGroup('utilitywarehouse', name, {name: 'prodk8s', id: '61540'}, 'read')
			}).then(() => {
				return dockerHubAPI.addGroup('utilitywarehouse', name, {name: 'devk8s', id: '52102'}, 'read')
			}).then(() => {
				return dockerHubAPI.addGroup('utilitywarehouse', name, {name: 'deploy', id: '44064'}, 'write')
			}).then(() => callback()).catch((err) => callback(err))
	});
}
