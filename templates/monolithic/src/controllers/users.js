const { usersService } = require('../services');

module.exports = {
  async get(req, res) {
    try {
      const { id } = req.params;
      const user = await usersService.get(id);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(error.status).json(error.message);
    }
  },
};
