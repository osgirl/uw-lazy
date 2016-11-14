const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const dot = require('dot');

dot.templateSettings.strip = false;

let root;

module.exports.root = function(projectPath) {
	root = projectPath;
	fs.mkdirsSync(projectPath);
}

module.exports.structure = function structure(root, directories) {
	if (!directories) {
		return fs.ensureFileSync(root);
	}

	fs.mkdirsSync(root);

	_.forOwn(directories, (struct, value) => {
		structure(path.join(root, value), struct);
	})
};

module.exports.package = function(contents) {
	fs.writeJsonSync(path.join(root, 'package.json'), contents);
}

module.exports.circle = function(source) {
	fs.copySync(source, path.join(root, 'circle.yml'));
}


module.exports.makefile = function(source, variables) {

	const template = dot.template(fs.readFileSync(source));
	fs.writeFileSync(path.join(root, 'Makefile'), template(variables));
}

module.exports.gitignore = function(source) {
	fs.copySync(source, path.join(root, '.gitignore'));
}

module.exports.dockerignore = function(source) {
	fs.copySync(source, path.join(root, '.dockerignore'));
}

module.exports.dockerfile = function(source) {
	fs.copySync(source, path.join(root, 'Dockerfile'));
}

module.exports.cache = function(values) {
	fs.writeJsonSync(path.join(root, 'node_modules/.lazy.json'), values)
}

module.exports.restoreValues = function() {
	if (fs.existsSync(path.join(root, 'node_modules/.lazy.json'))) {
		return require(path.join(root, 'node_modules/.lazy.json'));
	}
	return {};
}
