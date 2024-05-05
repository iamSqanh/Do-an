'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // Define associations
      Chat.belongsTo(models.User, { foreignKey: 'userId' });
      Chat.belongsTo(models.Group, { foreignKey: 'groupId' });
    }
  }

  Chat.init({
    message: DataTypes.STRING,
    groupId: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chat',
  });

  return Chat;
};
