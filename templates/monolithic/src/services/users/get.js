const { usersRepository } = require('../../repositories');
const { buildResponse, errorHandler: ErrorHandler } = require('../../helpers');

module.exports = async (id) => {
  try {
    const user = await usersRepository.get(id);

    if (!user) {
      throw new ErrorHandler('user-not-found', 404);
    }

    return buildResponse({ body: user });
  } catch (error) {
    throw new ErrorHandler(error || 'an-error-occurred', 422);
  }
};
