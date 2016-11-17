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

module.exports.die = function(...str) {
	console.error(chalk.red('Fatal error: '), ...str);
	process.exit(1);
}

module.exports.warn = function(str) {
	console.log('    ', chalk.yellow(figures.warning), '    ', str);
}

module.exports.error = function(...str) {
	console.log('    ', chalk.red(figures.cross), '    ', ...str);
}

module.exports.caveats = function(projectPath) {
	console.log(boxen(`          CAVEATS          `, {padding: 1, margin: 1, borderStyle: 'double'}));
	console.log('Some secrets have been saved in \n\n\r\t%s\n\n\rMake sure to deal with it!', chalk.green(projectPath + '/node_modules/.lazy.json'));
}

module.exports.bye = function() {
	console.log('Utility Warehouse Web Systems Team thanks you for being lazy, so long!')
}
