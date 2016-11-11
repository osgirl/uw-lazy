if (!process.env.GITHUB_TOKEN) {
	throw "process.env.GITHUB_TOKEN required";
}

const GitHubApi = require("github");

const github = new GitHubApi({
    debug: false,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    pathPrefix: null, // for some GHEs; none for GitHub
    headers: {
        "user-agent": "UW Lazy API" // GitHub is happy with a unique user agent
    },
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});

// user token
github.authenticate({
    type: "token",
    token: process.env.GITHUB_TOKEN
});

module.exports.create = function(name, callback) {

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
		private: true
	}).then((repo)=>{
		callback(repo.ssh_url);
	}).catch((err) => {
		throw err;
	})
})
}

var Git = require("nodegit");

module.exports.init = function(path, origin, callback) {
	Git.Repository.init(path, 0).then((repository) => {

		Git.Remote.setUrl(repository, 'origin', origin);

		return callback();
	}).catch((err) => {
		return callback(err)
	});
}

module.exports.commit = function(root) {

	Git.Index.open(index_path).then(function(index) {

		index.addByPath(root).then((res) => {
			console.log(res)
		}).catch((err) => {
			console.error(res);
		})

	});

}
