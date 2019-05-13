const { User } = require('../models');

module.exports = {
  get(id) {
    return User.getByPk(id);
  },
  update(id, obj) {
    return User.update(obj, {
      where: { id },
    });
  },
  create(obj) {
    return User.create(obj);
  },
  delete(id) {
    return User.destroy({
      where: { id },
    });
  },
};
