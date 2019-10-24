const Sequelize = require('sequelize');
const models = require('../models');

module.exports = (attributes = {}, model) => {
  const include = Object.keys(model.associations).map(key => ({
    model: models[model.associations[key].as],
  }));

  if (Object.keys(attributes).length === 0) {
    return { include };
  }

  const where = Object.keys(attributes).reduce((previous, current) => {
    const obj = Object.assign({}, previous);

    if (new RegExp('\\w+\\.\\w+').test(current)) {
      const [modelName, field] = current.split('.');
      const association = model.associations[
        Object.keys(model.associations).find(key => new RegExp(modelName, 'i').test(model.associations[key].target))
      ];

      if (association) {
        if (
          JSON.stringify(association.target.rawAttributes[field].type)
          === JSON.stringify(Sequelize.DataTypes.STRING())
        ) {
          obj[`$${association.as}.${field}$`] = {
            [Sequelize.Op.like]: `%${attributes[current]}%`,
          };
        } else {
          obj[`$${association.as}.${field}$`] = attributes[current];
        }
      }
    } else {
      const attribute = model.rawAttributes[current];

      if (JSON.stringify(Sequelize.DataTypes.STRING()) === JSON.stringify(attribute.type)) {
        obj[current] = {
          [Sequelize.Op.like]: `%${attributes[current]}%`,
        };
      } else {
        obj[current] = attributes[current];
      }
    }

    return obj;
  }, {});

  return {
    include,
    where,
  };
};
