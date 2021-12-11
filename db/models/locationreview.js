'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LocationReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LocationReview.belongsTo(models.Location);
      // define association here
    }
  };
  LocationReview.init({
    userId: DataTypes.INTEGER,
    star: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    image: DataTypes.STRING,
    createDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'LocationReview',
  });
  return LocationReview;
};