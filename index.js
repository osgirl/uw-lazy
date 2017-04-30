const commander = require('commander');
const fs = require('fs-extra');
const path = require('path');

const cwd = process.cwd();
const base = __dirname;

commander
    .command('editorconfig')
    .description('generates editorconfig in the current directory')
    .action(function() {
        fs.copySync(
            path.join(base, 'resources', 'editorconfig'),
            path.join(cwd, '.editorconfig')
        )
    });


commander.parse(process.argv);
