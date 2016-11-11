const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

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

module.exports.makefile = function(source) {
	fs.copySync(source, path.join(root, 'Makefile'));
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
