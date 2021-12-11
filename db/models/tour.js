'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tour.hasMany(models.TourReview);
      Tour.belongsTo(models.User);
      Tour.belongsToMany(models.Location, {
        through: 'TourLocation'
      })
      // define association here
    }
  };
  Tour.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Tour',
  });
  return Tour;
};