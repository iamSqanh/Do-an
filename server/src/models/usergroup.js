'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // UserGroup.hasOne(models.User);
      // UserGroup.hasOne(models.User, { through: 'UserGroup',  as: "users", foreignKey: 'groupId' });
      UserGroup.belongsTo(models.Group, { foreignKey: 'groupId', targetKey: 'id', as: 'groupData' })
      UserGroup.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' })
    }
  }
  UserGroup.init({
    userId: DataTypes.STRING,
    groupId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserGroup',
  });
  return UserGroup;
};