const { usersService } = require('../services');

module.exports = {
  async get(req, res) {
    try {
      const { id } = req.params;
      const response = await usersService.get(id);

      Object.keys(response.headers).forEach((key) => {
        res.setHeader(key, response.headers[key]);
      });

      res.json(response.body);
    } catch (error) {
      console.error(error);
      res.status(error.status).json(error.message);
    }
  },
  async create(req, res) {
    try {
      const user = req.body;
      await usersService.create(user);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(error.status).json(error.message);
    }
  },
  async update(req, res) {
    try {
      const user = req.body;
      const { id } = req.params;
      await usersService.update(id, user);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(error.status).json(error.message);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      await usersService.delete(id);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(error.status).json(error.message);
    }
  },
};
