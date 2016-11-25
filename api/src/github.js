if (!process.env.GITHUB_TOKEN) {
	throw 'process.env.GITHUB_TOKEN required';
}

const output = require('./output');

const GitHubApi = require('github');
const SimpleGit = require('simple-git');

const github = new GitHubApi({
	debug: false,
	protocol: 'https',
	host: 'api.github.com', // should be api.github.com for GitHub
	pathPrefix: null, // for some GHEs; none for GitHub
	headers: {
		'user-agent': 'UW Lazy API' // GitHub is happy with a unique user agent
	},
	followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
	timeout: 5000
});

// user token
github.authenticate({
	type: 'token',
	token: process.env.GITHUB_TOKEN
});

module.exports.create = function(name, description, callback) {

github.repos.get({owner: 'utilitywarehouse', repo: name})
.then((repo) => {
	callback(repo.ssh_url);
}).catch((err) => {
	if (err.code !== 404) {
		throw err;
	}
	return github.repos.createForOrg({
		org: 'utilitywarehouse',
		name: name,
		private: true,
		description: description
	}).then((repo)=>{
		callback(repo.ssh_url);
	}).catch((err) => {
		throw err;
	})
})
}

module.exports.push = function(path, origin, callback) {

	SimpleGit(path)
		.silent(true)
		.init()
		.add('./*')
		.commit('Initial commit')
		.addRemote('origin', origin, (err) => {
			return callback(false);
		})
		.push('origin', 'master', {}, (err) => {
			if (err) {
				throw err;
			}
			callback(true);
		});
}
