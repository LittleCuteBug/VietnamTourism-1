'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location.belongsToMany(models.Tour, {
        through: 'TourLocation'
      })
      // define association here
    }
  };
  Location.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.STRING(10000),
    image: DataTypes.STRING,
    price: DataTypes.INTEGER,
    timeOpen: DataTypes.STRING,
    timeClose: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};