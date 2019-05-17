const models = require('../models');
const Sequelize = require('sequelize');

module.exports = (attributes = {}, model) => {
  const include = Object.keys(model.associations).map(key => {
    return { model: models[model.associations[key].as] };
  });

  if (Object.keys(attributes).length === 0) {
    return { include };
  }

  const where = Object.keys(attributes).reduce((previous, current) => {
    if (new RegExp('\\w+\\.\\w+').test(current)) {
      const [modelName, field] = current.split('.');
      const association =
        model.associations[
          Object.keys(model.associations).find(key =>
            new RegExp(modelName, 'i').test(model.associations[key].target),
          )
        ];

      if (association) {
        if (
          JSON.stringify(association.target.rawAttributes[field].type) ===
          JSON.stringify(Sequelize.DataTypes.STRING())
        ) {
          previous[`$${association.as}.${field}$`] = {
            [Sequelize.Op.like]: `%${attributes[current]}%`,
          };
        } else {
          previous[`$${association.as}.${field}$`] = attributes[current];
        }
      }
    } else {
      const attribute = model.rawAttributes[current];

      if (
        JSON.stringify(Sequelize.DataTypes.STRING()) ===
        JSON.stringify(attribute.type)
      ) {
        previous[current] = {
          [Sequelize.Op.like]: `%${attributes[current]}%`,
        };
      } else {
        previous[current] = attributes[current];
      }
    }

    return previous;
  }, {});

  return {
    include,
    where,
  };
};
