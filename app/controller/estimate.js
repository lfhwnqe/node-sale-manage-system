'use strict';
const moment = require('moment');
// moment().format();

const Controller = require('egg').Controller;

class EstimateController extends Controller {
  // 添加计量单位
  async insert() {
    const {
      ctx
    } = this;
    try {
      const params = ctx.request.body
      const data = await ctx.service.estimate.insert(params)
      ctx.body = {
        data,
        success: true
      }
    } catch (err) {
      if (err.message.indexOf('E11000 duplicate key') !== -1) {
        err = new Error('请勿添加重复的计量单位或计量单位简写')
        throw err
      }
      throw new Error(message)
    }
  }

  async getList() {
    const {
      ctx
    } = this;
    try {
      const params = ctx.request.body
      const data = await ctx.service.estimate.getList(params)
      ctx.body = {
        data,
        success: true
      }
    } catch (err) {

    }
  }

  async removeById() {
    const {
      ctx
    } = this;
    try {
      const params = ctx.request.body
      const data = await ctx.service.estimate.removeById(params.id)
      ctx.body = {
        data,
        success: true
      }
    } catch (err) {

    }
  }

}

module.exports = EstimateController;
