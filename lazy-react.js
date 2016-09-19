#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var ucfirst = require('ucfirst');
var chalk = require('chalk');
var fs = require('fs-extra')
var mkdir = require('mkdir-recursive').mkdirSync;

var root = process.cwd()

var config = fs.readJsonSync(path.join(root, 'package.json'));

var componentSources = {

  component: {
    'index.js': path.join(__dirname, 'files/component/index.js'),
    'spec.js': path.join(__dirname, 'files/component/spec.js'),
    'story.js': path.join(__dirname, 'files/component/story.js'),
    'styles.js': path.join(__dirname, 'files/component/styles.js'),
  },

  page: {
    'index.js': path.join(__dirname, 'files/page/index.js'),
    'spec.js': path.join(__dirname, 'files/page/spec.js'),
    'styles.js': path.join(__dirname, 'files/page/styles.js'),
  },

  redux: {
    'actions.js': path.join(__dirname, 'files/redux/actions.js'),
    'constants.js': path.join(__dirname, 'files/redux/constants.js'),
    'container.js': path.join(__dirname, 'files/redux/container.js'),
    // 'container.spec.js': path.join(root, 'bin/files/redux/container.spec.js'),
    'reducer.js': path.join(__dirname, 'files/redux/reducer.js'),
    // 'reducer.spec.js': path.join(root, 'bin/files/page/reducer.spec.js'),
  }

};

var targetPaths = {
  components: path.join(root, 'app/components/modules'),
  pages: path.join(root, 'app/components/pages'),
  redux: path.join(root, 'app/redux/modules'),
}

if (config.lazy && config.lazy.react) {
  targetPaths = {
    components: path.join(root, config.lazy.react.components || 'app/components/modules'),
    pages: path.join(root, config.lazy.react.pages || 'app/components/pages'),
    redux: path.join(root, config.lazy.react.redux || 'app/components/redux'),
  }
}

/**
 *  program execution
 */
program
  .version('0.0.2')
  .arguments('<name>')
  .option('-c, --component', 'create a component')
  .option('-p, --page', 'create a page')
  .option('-r, --redux', 'create a redux module')
  // .option('-l, --layout', 'create layout component')
  .option('--path [path]', 'specify path suffix')
  .option('--name [name]', 'class name, if ommited will be derived from last bit of component path')
  .option('--dry', 'dry run')
  .option('-f, --force', 'force override')
  .action(function(name) {

    console.log(program.name)
    console.log(program.path)

    var targetPath = null;

    // retrieve module name
    var Name = ucfirst(name);
    var ClassName = name.split('/');
        ClassName = ClassName[ClassName.length-1]
        ClassName = ucfirst(ClassName);

    if (program.name) {
      ClassName = program.name
    }

    if (program.component) {
      var sources = componentSources.component;
      targetPath = path.resolve(targetPaths.components, program.path ? program.path : '', Name)
    }

    if (program.page) {
      var sources = componentSources.page;
      targetPath = path.resolve(targetPaths.pages, program.path ? program.path : '', Name)
    }

    if (program.redux) {
      var sources = componentSources.redux;
      targetPath = path.resolve(targetPaths.redux, program.path ? program.path : '', Name)
    }
    var displayPath = targetPath.replace(root+'/', '').replace('/'+Name, '');

    console.log()

    console.log(chalk.green('Generating: '), displayPath, '/', chalk.blue(Name));

    if (!program.dry) mkdir(targetPath)

    // console.log (Object.keys(sources));

    for (var file in sources) {
      var _target = `${targetPath}/${file}`;
      console.log(chalk.blue(file));
      try {
        var stat = fs.lstatSync(_target);
        if (program.force) throw 'force';
        if (!stat.size) throw 'empty';
          console.log(' - target:     ', chalk.green(_target));
          console.log(' - result:   ', chalk.yellow('skipping, already exists'));

        } catch(e) {
          console.log(' - source:   ', chalk.green(`${sources[file]}`));
          console.log(' - target:   ', chalk.green(_target));
          var componentSource = fs.readFileSync(sources[file]).toString().replace(/:Component:/g, ClassName)

          if (!program.dry) fs.outputFileSync(_target, componentSource);
      }

    }

    console.log()

    console.log(chalk.green('Cool.'));

    console.log()

  })
  .parse(process.argv);
