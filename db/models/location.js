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
      Location.hasMany(models.LocationReview);
      // define association here
    }
  };
  Location.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    priceMinPerPerson: DataTypes.INTEGER,
    priceMaxPerPerson: DataTypes.INTEGER,
    timeOpen: DataTypes.STRING,
    timeClose: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};