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
      const insertOrderResult = await this.ctx.model.Order.create(params)
      return insertOrderResult;
    } catch (err) {
      throw new Error(err)
    }
  }

  async getOrderList({
    pageSize = 20,
    pageNum = 1,
    userId
  }) {
    try {
      const skip = (pageNum * 1 - 1) * pageSize
      const orderList = await this.ctx.model.Order.find({
        userId
      }).sort({
        saleTime: -1
      }).limit(pageSize * 1).skip(skip);
      const totalPage = await this.ctx.model.Order.find({
        userId
      }).count() / pageSize
      return {
        orderList,
        pageNum,
        pageSize,
        totalPage: Math.round(totalPage)
      }
    } catch (err) {
      console.log('err:', err)
    }
  }
}

module.exports = OrderService;
