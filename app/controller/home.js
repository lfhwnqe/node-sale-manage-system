'use strict';
var moment = require('moment');
// moment().format();

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const {
      ctx
    } = this;
    ctx.body = 'hi, egg';
  }

  async geTotalRevenueStatics() {
    const {
      ctx
    } = this
    const params = {
      startTime: '',
      endTime: '',
      userId: ''
    }

    params.userId = ctx.userinfo
    params.startTime = moment(new Date()).format();
    params.endTime = moment(new Date()).add(-30, 'days').format();

    const count = await ctx.service.order.totalRevenueStatics(params)
    ctx.body = {
      count
    }
  }
}

module.exports = HomeController;