'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async insertOrder() {
    const {
      ctx
    } = this;

    try {
      const params = ctx.request.body;
      const userId = ctx.userinfo;
      const {
        groupId,
        userLabel
      } = await ctx.service.user.findUserById(userId);
      const form = {
        userId,
        groupId,
        saleBy: userLabel
      };
      const paramKeys = ['ordersList', 'remark', 'saleTime', 'phone',];
      paramKeys.forEach(item => {
        form[item] = params[item];
      });

      const result = await ctx.service.order.insertOrder(form);
      ctx.body = {
        data: result.id,
        success: true
      };
    } catch (err) {
      let msg;
      if (err.code === 'invalid_param') {
        msg = '请输入必填项';
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
    } = this;
    const params = ctx.request.query;
    const userId = ctx.userinfo;
    params.userId = userId;
    const result = await ctx.service.order.getOrderList(params);
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
    const { orderId } = this.ctx.request.body;
    const userId = this.ctx.userinfo;
    const data = await this.ctx.service.order.removeOrderById(orderId, userId);
    this.ctx.body = {
      data,
      success: true
    };
  }

}

module.exports = OrderController;
