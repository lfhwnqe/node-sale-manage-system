'use strict';
module.exports = app => {
  try {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var OrderSchema = new Schema({
      productName: {
        type: String,
        require: true,
        max: 64,
        min: [0, '必须输入商品名称'],
      },
      // 商品数量
      amount: {
        type: Number,
        require: true,
      },
      // 实际出售价格
      totalPrice: {
        type: Number,
        require: true,
      },
      // 吊牌价格
      tagPrice: {
        type: Number,
        require: true,
      },
      saleTime: {
        type: Date,
        // default: Date.now,
      },
      // 备注
      remark: {
        type: String,
        max: 320,
      },
      createTime: {
        type: Date,
        default: Date.now,
      },
    });
    return mongoose.model('Order', OrderSchema);
  } catch (e) {
    return mongoose.model('Order');
  }
};