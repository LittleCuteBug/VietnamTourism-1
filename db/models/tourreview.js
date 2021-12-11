'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TourReview.belongsTo(models.Tour);
    }
  };
  TourReview.init({
    userId: DataTypes.INTEGER,
    star: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    image: DataTypes.STRING,
    create_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TourReview',
  });
  return TourReview;
};