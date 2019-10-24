const { usersRepository } = require('../../repositories');

module.exports = user => usersRepository.create(user);
