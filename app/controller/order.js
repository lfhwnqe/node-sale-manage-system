'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async insertOrder() {
    const {
      ctx
    } = this;

    try {
      ctx.validate({
        productName: {
          type: 'string',
          required: true
        },
        amount: {
          type: 'string',
          required: true
        },
        totalPrice: {
          type: 'number',
          required: true
        },
        tagPrice: {
          type: 'number',
          required: true
        },
        saleTime: {
          type: 'string',
          required: true,
          allowEmpty: true
        }
      })

      const result = await ctx.service.order.insertOrder(ctx.request.body)
      ctx.body = {
        data: result,
        success: true
      }
    } catch (err) {
      let errorMsg;
      if (err.code === 'invalid_param') {
        errorMsg = '请输入必填项'
      }
      ctx.logger.warn(errorMsg);
      ctx.body = {
        success: false,
        msg: errorMsg
      };
      return;
    }
    // const {
    //   // 商品品类
    //   productName,
    //   // 商品数量
    //   amount,
    //   // 实际总价
    //   totalPrice,
    //   // 吊牌总价
    //   tagPrice,
    //   // 出售时间
    //   saleTime
    // } = ctx.request.body;

  }

  async getOrderList() {
    const {
      ctx
    } = this
    const result = await ctx.service.order.getOrderList(ctx.request.body)
    ctx.body = {
      data: result,
      success: true
    }
  }

}

module.exports = OrderController;
