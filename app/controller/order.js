'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async insertOrder() {
    const {
      ctx
    } = this;
    const params = ctx.request.body;
    const result = await ctx.service.order.insertOrder(params);
    ctx.body = {
      data: result.id,
      success: true
    };
  }

  async getOrderList() {
    const {
      ctx
    } = this;
    const params = ctx.request.query;
    const result = await ctx.service.order.getOrderList(params);
    ctx.body = {
      data: result,
      success: true
    };
  }

  async getOrderDetail() {
    const {
      ctx
    } = this
    const params = ctx.request.query;
    const result = await ctx.service.littleOrder.getList(params);
    ctx.body = {
      data: result,
      success: true
    };
  }

  async getPhoneNumberList() {
    const {
      phoneNumber
    } = this.ctx.request.query;
    const data = await this.ctx.service.order.getPhoneNumberList(phoneNumber);
    this.ctx.body = {
      data,
      success: true
    };
  }

  async removeOrderById() {
    const {
      orderId
    } = this.ctx.request.body;
    const userId = this.ctx.userinfo;
    const data = await this.ctx.service.order.removeOrderById(orderId, userId);
    this.ctx.body = {
      data,
      success: true
    };
  }

}

module.exports = OrderController;
