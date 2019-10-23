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
    this.copyTemplate = this.copyTemplate.bind(this);
  }

  async menu() {
    const questions = [
      {
        name: 'name',
        message: 'What is project name?',
        default: 'saila',
      },
      {
        name: 'description',
        message: 'Type a description:',
      },
      {
        name: 'author',
        message: 'Who is the author?',
        default: 'Nelson Sinis <nelsonsinis0@gmail.com>',
      },
      {
        name: 'entryPoint',
        message: 'entry point:',
        default: 'index.js',
      },
      {
        type: 'list',
        name: 'databaseTechnology',
        message: 'Choose a database package',
        choices: ['Sequelize', 'Mongoose'],
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

      this._packageJSON = {
        name: this._responses.name,
        description: this._responses.description,
        author: this._responses.author,
        main: this._responses.entryPoint,
        repository: this._responses.gitRepository,
      };
    } catch (error) {
      throw error;
    }
  }

  copyTemplate() {
    const projectPath = `./${this._packageJSON.name}`;
    const path = '/templates/';
    const files = fs
      .readdirSync(path)
      .filter((item) => !['sequelize', 'mongoose'].includes(item));

    files.forEach((file) => {
      fs.copyFileSync(`${path}/${file}`, `${projectPath}/${file}`);
    });
    shell.cp('-r', `${path}/src`, projectPath);
  }

  generateProject() {
    const projectPath = `./${this._packageJSON.name}`;

    if (this._responses.technology === 'Monolithic') {
      this._packageJSON = Object.assign(this._packageJSON, {
        scripts: {
          'start:dev': `NODE_ENV=development node ${this._responses.entryPoint}`,
          start: `NODE_ENV=production node ${this._responses.entryPoint}`,
        },
      });
    }

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
        packages.push('tedious');
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
    } else {
      shell.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
      shell.exec(`npm install --save ${packages.join(' ')}`);
    }

    shell.exec('git init');

    if (this._packageJSON.gitRepository !== '') {
      shell.exec(`git remote add origin ${this._packageJSON.gitRepository}`);
    }

    this.copyTemplate();
    shell.exec('git add .');
    shell.exec("git commit -m 'Initial commit'");
  }
}

module.exports = Generator;
