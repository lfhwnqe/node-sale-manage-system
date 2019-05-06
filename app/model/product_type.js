'use strict';
const {
  productTypeDict
} = require('../../config/model_dict')

module.exports = app => {
  try {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const OrderSchema = new Schema(productTypeDict.schema)
    return mongoose.model('ProductType', OrderSchema);
  } catch (e) {
    return mongoose.model('ProductType');
  }
};
