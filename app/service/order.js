'use strict';

const Service = require('egg').Controller;

class OrderService extends Service {

  async insertOrder(params) {
    try {
      if (!params.saleTime) {
        params.saleTime === Date.parse(Date.now())
      } else {
        params.saleTime === Date.parse(params.saleTime)
      }
      console.log('params:',params)
      const insertOrderResult = await this.ctx.model.Order.create(params)
      return insertOrderResult;
    } catch (err) {
      throw new Error(err)
    }
  }

  async getOrderList(params) {
    const orderList = await this.ctx.model.Order.find();
    return orderList
  }

}

module.exports = OrderService;