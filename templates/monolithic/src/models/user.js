'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    age: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};