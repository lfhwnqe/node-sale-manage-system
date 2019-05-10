'use strict';
const moment = require('moment');
// moment().format();

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const {
      ctx
    } = this;
    ctx.body = 'hi, egg';
  }

  /* 
   * 主页获取销量统计
   * 获取近30天，近7天的销售总额，销售数量的统计
   */
  async geTotalRevenueStatics() {
    const {
      ctx
    } = this
    // const baseParams = {
    //   userId: ctx.userinfo,
    //   endTime: moment(new Date()).format(),
    // }
    // const near30DaysParams = {
    //   ...baseParams,
    //   startTime: moment(new Date()).add(-30, 'days').format()
    // }

    // const near7DaysParams = {
    //   ...baseParams,
    //   startTime: moment(new Date()).add(-7, 'days').format()
    // }

    // const todayParams = {
    //   ...baseParams,
    //   startTime: moment().startOf('day').format()
    // }

    // const near30DaysStatics = await ctx.service.order.totalRevenueStatics(near30DaysParams)
    // const near7DaysStatics = await ctx.service.order.totalRevenueStatics(near7DaysParams)
    const data = await ctx.service.order.totalRevenueStatics()

    ctx.body = {
      success: true,
      data
    }
  }
}

module.exports = HomeController;
