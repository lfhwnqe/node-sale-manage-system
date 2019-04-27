'use strict';
module.exports = app => {
  try {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var OrderSchema = new Schema({
      // 单个订单全部信息
      ordersList: [{
        number: Number,
        price: Number,
        productType: String
      }],
      // 该订单总金额
      ordersTotalPrice: {
        require: true,
        type: Number
      },
      // 出售时间
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
      userId: {
        type: String,
        require: true
      },
      saleBy: {
        type: String,
        require: true
      }
    });
    return mongoose.model('Order', OrderSchema);
  } catch (e) {
    return mongoose.model('Order');
  }
};
