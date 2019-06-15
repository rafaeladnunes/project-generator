const inquirer = require('inquirer');
const shell = require('shelljs');
const fs = require('fs');

class Generator {
  contructor() {
    this._packageJSON = {
      version: '1.0.0',
      license: 'MIT',
    };

    this._responses = {};

    if (!shell.which('git')) {
      shell.echo('Sorry, this script requires git installed');
      shell.exit(1);
    }

    if (!shell.which('npm')) {
      shell.echo('Sorry, this script requires npm installed');
      shell.exit(1);
    }

    this.menu = this.menu.bind(this);
    this.generatePackageJSON = this.generatePackageJSON.bind(this);
    this.generateProject = this.generateProject.bind(this);
  }

  async menu() {
    const questions = [
      {
        name: 'name',
        message: 'What is project name?',
      },
      {
        name: 'description',
        message: 'Type a description:',
      },
      {
        name: 'author',
        message: 'Who is the author?',
      },
      {
        name: 'entryPoint',
        message: 'entry point:',
      },
      {
        type: 'list',
        name: 'databaseTechnology',
        message: 'Choose a database package',
        choices: ['Sequelize', 'Mongoose'],
      },
      {
        type: 'list',
        name: 'technology',
        message: 'Choose a technology',
        choices: ['Serverless', 'Monolithic'],
      },
      {
        name: 'gitRepository',
        message: 'git repository url:',
      },
    ];

    if (process.platform === 'win32') {
      shell.exec('cls');
    } else {
      shell.exec('clear');
    }

    try {
      this._responses = await inquirer.prompt(questions);

      if (this._responses.technology === 'Serverless') {
        const responses = await inquirer.prompt([
          {
            type: 'list',
            name: 'cloud',
            message: 'Choose a cloud',
            choices: ['AWS', 'Azure'],
          },
          {
            type: 'list',
            name: 'database',
            message: 'Choose a database',
            choices: ['MySQL', 'PostgreSQL', 'MSSQL', 'MariaDB', 'SQLite'],
          },
        ]);

        this._responses = Object.assign(this._responses, responses);
      }

      this._packageJSON = {
        name: this._responses.name,
        description: this._responses.description,
        author: this._responses.author,
        main: this._responses.entryPoint,
      };
    } catch (error) {
      throw error;
    }
  }

  generateProject() {
    const projectPath = `./${this._packageJSON.name}`;
    fs.mkdirSync(projectPath);
    fs.writeFileSync(
      `${projectPath}/package.json`,
      JSON.stringify(this._packageJSON, null, 2),
    );
    shell.cd(projectPath);
    shell.exec('npm install');

    const packages = [];
    const devDependencies = ['jest', 'pre-commit'];

    switch (this._responses.databaseTechnology) {
      case 'Sequelize':
        packages.push('sequelize');
        packages.push('sequelize-cli');
        break;
      case 'Mongoose':
        packages.push('mongoose');
        break;
      default:
        break;
    }

    switch (this._responses.database) {
      case 'MySQL':
        packages.push('mysql2');
        break;
      case 'PostgreSQL':
        packages.push('pg');
        packages.push('pg-hstore');
        break;
      case 'MSSQL':
        packages.push(tedious);
        break;
      case 'MariaDB':
        packages.push('mariadb');
        break;
      case 'SQLite':
        packages.push('sqlite3');
        break;
      default:
        break;
    }

    if (this._responses.cloud === 'AWS') {
      packages.push('serverless-domain-manager');
      packages.push('serverless-iam-roles-per-function');
      packages.push('serverless-offline');
      packages.push('aws-sdk');
      packages.push('serverless');
      devDependencies.push('gulp');
    }

    if (this._responses.technology === 'Monolithic') {
      packages.push('swagger-express');
      packages.push('swagger-express-middleware');
      packages.push('body-parser');
      packages.push('bcrypt-nodejs');
      packages.push('express');
      packages.push('nodemailer');
      devDependencies.push('nodemon');
    }

    if (shell.which('yarn')) {
      shell.exec(`yarn add -D ${devDependencies.join(' ')}`);
      shell.exec(`yarn add ${packages.join(' ')}`);
      shell.exec('yarn global add gitflow');
    } else {
      shell.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
      shell.exec(`npm install --save ${packages.join(' ')}`);
      shell.exec('npm install -g gitflow');
    }

    shell.exec('git init');

    if (this._packageJSON.gitRepository !== '') {
      console.log('GIT');
      shell.exec(`git remote add origin ${this._packageJSON.gitRepository}`);
    }

    shell.exec('git flow init');
  }
}

module.exports = Generator;
