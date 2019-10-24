const { usersRepository } = require('../../repositories');
const { errorHandler: ErrorHandler, buildResponse } = require('../../helpers');

module.exports = async (id, obj) => {
  try {
    const user = await usersRepository.get(id);

    if (!user) {
      return buildResponse({
        body: ['user-not-found'],
        status: 404,
      });
    }

    return usersRepository.update(id, obj);
  } catch (error) {
    throw new ErrorHandler(error || 'an-error-occurred', 422);
  }
};
