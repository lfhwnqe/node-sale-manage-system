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
          type: 'string',
          required: true
        },
        tagPrice: {
          type: 'string',
          required: true
        },
        saleTime: {
          type: 'string',
          allowEmpty: true
        }
      })
      const params = ctx.request.body
      const userId = ctx.cookies.get('userinfo', {
        signed: false,
        encrypt: true
      })
      params.userId = userId
      const result = await ctx.service.order.insertOrder(params)
      ctx.body = {
        data: result,
        success: true
      }
    } catch (err) {
      let msg;
      if (err.code === 'invalid_param') {
        msg = '请输入必填项'
      }
      ctx.logger.warn(err);
      ctx.body = {
        success: false,
        msg
      };
      return;
    }
  }

  async getOrderList() {
    const {
      ctx
    } = this
    const params = ctx.request.query
    const userId = ctx.cookies.get('userinfo', {
      signed: false,
      encrypt: true
    })
    params.userId = userId
    const result = await ctx.service.order.getOrderList(params)
    ctx.body = {
      data: result,
      success: true
    }
  }

}

module.exports = OrderController;
