'use strict';
module.exports = app => {
  try {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var OrderSchema = new Schema({
      // 单个订单全部信息
      label: {
        require: true,
        type: String,
        unique: true
      },
      value: {
        require: true,
        type: String,
        unique: true
      }
    });
    return mongoose.model('Product', OrderSchema);
  } catch (e) {
    return mongoose.model('Product');
  }
};
