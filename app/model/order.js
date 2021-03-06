'use strict';
const {
  orderDict
} = require('../../config/model_dict')

module.exports = app => {
  try {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var OrderSchema = new Schema(orderDict.schema);
    return mongoose.model('Order', OrderSchema);
  } catch (e) {
    return mongoose.model('Order');
  }
};
