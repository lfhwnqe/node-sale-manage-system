'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async insertOrder() {
    const {
      ctx
    } = this;
    const params = ctx.request.body;
    const result = await ctx.service.order.insertOrder(params);
    const data = result.id;
    ctx.returnSuccess(data);
  }

  async getOrderList() {
    const {
      ctx
    } = this;
    const params = ctx.request.query;
    const data = await ctx.service.order.getOrderList(params);
    ctx.returnSuccess(data);
  }

  async getOrderDetail() {
    const {
      ctx
    } = this;
    const params = ctx.request.query;
    const data = await ctx.service.littleOrder.getList(params);
    ctx.returnSuccess(data);
  }

  async getPhoneNumberList() {
    const {
      phoneNumber
    } = this.ctx.request.query;
    const data = await this.ctx.service.order.getPhoneNumberList(phoneNumber);
    this.ctx.returnSuccess(data);
  }

  async removeOrderById() {
    const {
      orderId
    } = this.ctx.request.body;
    const userId = this.ctx.userinfo;
    const data = await this.ctx.service.order.removeOrderById(orderId, userId);
    this.ctx.returnSuccess(data);
  }

}

module.exports = OrderController;
