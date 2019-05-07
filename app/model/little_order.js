'use strict';
const {
  littleOrderDict
} = require('../../config/model_dict')

module.exports = app => {
  try {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var OrderSchema = new Schema(littleOrderDict.schema);
    return mongoose.model('LittleOrder', OrderSchema);
  } catch (e) {
    return mongoose.model('LittleOrder');
  }
};
