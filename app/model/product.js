'use strict';
const {
  productDict
} = require('../../config/model_dict')

module.exports = app => {
  try {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const OrderSchema = new Schema(productDict.schema)
    return mongoose.model('Product', OrderSchema);
  } catch (e) {
    return mongoose.model('Product');
  }
};
