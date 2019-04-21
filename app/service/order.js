'use strict';

const Service = require('egg').Controller;

class OrderService extends Service {

  async insertOrder(params) {
    const order = new this.ctx.model.Order();
    const insertOrderResult = await order.save(params)
    return insertOrderResult.id;
  }

  async getOrderList(params) {
    const orderList = await this.ctx.model.Order.find();
    return orderList
  }

}

module.exports = OrderService;
