const { usersRepository } = require('../../repositories');
const { errorHandler: ErrorHandler, buildResponse } = require('../../helpers');

module.exports = async (id) => {
  try {
    const user = await usersRepository.get(id);

    if (!user) {
      return buildResponse({
        body: ['user-not-found'],
        status: 404,
      });
    }

    return usersRepository.delete(id);
  } catch (error) {
    throw new ErrorHandler(error || 'an-error-occurred', 422);
  }
};
