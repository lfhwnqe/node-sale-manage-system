'use strict';

const Controller = require('egg').Controller;

class LittleOrderController extends Controller {

  async getStatics() {
    const {
      ctx
    } = this;
    const params = ctx.request.query;
    const data = await ctx.service.littleOrder.getStatics(params);
    ctx.returnSuccess(data);
  }
}

module.exports = LittleOrderController;
