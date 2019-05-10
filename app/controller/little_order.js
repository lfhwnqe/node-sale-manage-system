'use strict';

const Controller = require('egg').Controller;

class LittleOrderController extends Controller {

  async getStatics() {
    const {
      ctx
    } = this;
    const params = ctx.request.query;
    const result = await ctx.service.littleOrder.getStatics(params);
    ctx.body = {
      data: result,
      success: true
    };
  }
}

module.exports = LittleOrderController;
