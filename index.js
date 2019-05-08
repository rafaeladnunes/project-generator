#!/usr/bin/env node

const inquirer = require('inquirer');

const questions = [
  {
    type: 'list',
    name: 'technology',
    message: 'Select a technology',
    choices: ['API', 'Serverless'],
  },
  {
    type: 'list',
    name: 'cloud',
    message: 'Select a cloud platform',
    choices: ['AWS', 'Azure'],
  },
  {
    type: 'list',
    name: 'database',
    message: 'Select the ODM/ORM',
    choices: ['Sequelize', 'Mongoose'],
  },
];

let responses = {};

inquirer.prompt(questions).then(response => {
  responses = {...response};
  return inquirer.prompt([{
    type: 'list',
    name: 'test',
    message: 'Select the ODM/ORM',
    choices: [ "Choice A", new inquirer.Separator(), "choice B" ],
  }]);
}).then(response => {
  responses = Object.assign(responses, response);
  console.log(responses);
}).catch(console.error);