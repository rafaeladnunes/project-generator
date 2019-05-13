const inquirer = require('inquirer');
const shell = require('shelljs');

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
    this._generatePackageJSON = this._generatePackageJSON.bind(this);
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
    ];

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
    } catch (error) {
      console.error(error);
    }
  }

  _generatePackageJSON() {
    const obj = {
      name: this._responses.name,
      description: this._responses.description,
      author: this._responses.author,
      main: this._responses.entryPoint,
      dependencies: {},
      devDependencies: {
        jest: '^24.8.0',
      },
    };

    switch (this._responses.databaseTechnology) {
      case 'Sequelize':
        obj.dependencies = Object.assign(obj.dependencies, {
          sequelize: '^5.8.5',
        });

        obj.devDependencies = Object.assign(obj.devDependencies, {
          'sequelize-cli': '^5.4.0',
        });
        break;
      case 'Mongoose':
        obj.dependencies = Object.assign(obj.dependencies, {
          mongoose: '^5.5.6',
        });
        break;
      default:
        break;
    }

    switch (this._responses.database) {
      case 'MySQL':
        obj.dependencies = Object.assign(obj.dependencies, {
          mysql2: '^1.6.5',
        });
        break;
      case 'PostgreSQL':
        obj.dependencies = Object.assign(obj.dependencies, {
          pg: '^7.10.0',
          'pg-hstore': '^2.3.2',
        });
        break;
      case 'MSSQL':
        obj.dependencies = Object.assign(obj.dependencies, {
          tedious: '^6.1.1',
        });
        break;
      case 'MariaDB':
        obj.dependencies = Object.assign(obj.dependencies, {
          mariadb: '^2.0.4',
        });
        break;
      case 'SQLite':
        obj.dependencies = Object.assign(obj.dependencies, {
          sqlite3: '^4.0.7',
        });
        break;
      default:
        break;
    }

    if (this._responses.cloud === 'AWS') {
      obj.devDependencies = Object.assign(obj.devDependencies, {
        'serverless-domain-manager': '^2.6.13',
        'serverless-iam-roles-per-function': '^1.0.1',
        'serverless-offline': '^4.9.4',
        gulp: '^4.0.1',
      });

      obj.dependencies = Object.assign(obj.dependencies, {
        'aws-sdk': '^2.441.0',
        serverless: '^0.0.2',
      });
    }

    if (this._responses.technology === 'Monolithic') {
      obj.dependencies = Object.assign(obj.dependencies, {
        'swagger-express': '^1.0.5',
        'swagger-express-middleware': '^2.0.1',
        'body-parser': '^1.18.3',
        'bcrypt-nodejs': '0.0.3',
        express: '^4.16.4',
        nodemailer: '^5.1.1',
      });
    }

    this._packageJSON = obj;
  }
}

module.exports = Generator;
