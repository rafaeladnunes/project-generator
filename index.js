#!/usr/bin/env node
// const inquirer = require('inquirer');
// const fs = require('fs');
// const shell = require('shelljs');

// const questions = [
//   {
//     name: 'name',
//     message: 'What is project name?',
//   },
//   {
//     name: 'description',
//     message: 'Type a description:'
//   },
//   {
//     name: 'author',
//     message: 'Who is the author?'
//   },
//   {
//     name: 'entryPoint',
//     message: 'entry point:',
//   },
//   {
//     type: 'list',
//     name: 'databaseTechnology',
//     message: 'Choose which database package',
//     choices: ['Sequelize', 'Mongoose'],
//   },
// ];

// inquirer.prompt(questions).then(responses => {
//   if (!shell.which('npm')) {
//     shell.echo('Sorry, this script requires npm installed');
//     shell.exit(1);
//   }
  
//   if (!shell.which('git')) {
//     shell.echo('Sorry, this script requires git installed');
//     shell.exit(1);
//   }

//   let packageJSON = {
//     name: responses.name,
//     description: responses.description,
//     author: responses.author,
//     version: '1.0.0',
//     main: responses.entryPoint,
//     license: 'MIT'
//   };

//   switch(responses.databaseTechnology) {
//     case 'Sequelize':
//       packageJSON = Object.assign(packageJSON, {
//         dependencies: {
//           sequelize: '^5.8.5',
//         },
//         devDependencies: {
//           'sequelize-cli': '^5.4.0'
//         },
//       });
//       break;
//     case 'Mongoose':
//       packageJSON.dependencies = {
//         mongoose: '^5.5.6'
//       };
//       break;
//     default:
//       break;
//   }

//   fs.mkdirSync(`./${responses.name}`);
//   fs.writeFileSync(`./${responses.name}/package.json`, JSON.stringify(packageJSON));
//   shell.cd(`./${responses.name}`);
//   shell.exec('npm install');
//   shell.exec('git init');
// }).catch(console.error);

(async () => {
  const Generator = require('./src/generator');
  const generator = new Generator();

  await generator.menu();
  generator._generatePackageJSON();
  console.log(generator._packageJSON);
})();