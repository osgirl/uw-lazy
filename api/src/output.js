const boxen = require('boxen');
const chalk = require('chalk');
const figures = require('figures');

module.exports.header = function(program) {
	console.log(boxen(`UW Lazy API v${program.version()}`, {padding: 1, margin: 1, borderStyle: 'double'}));
}

module.exports.break = function() {
	console.log();
}

module.exports.line = function() {
	console.log('-'.repeat(20));
}

module.exports.write = function(...args) {
	console.log(...args);
}

module.exports.arg = function(str) {
	return chalk.green(str)
}

module.exports.em = function(str) {
	return chalk.blue(str)
}

module.exports.ok = function(str) {
	console.log('    ', chalk.green(figures.tick), '    ', str);
}

module.exports.die = function(str) {
	console.error(str);
	process.exit(1);
}
