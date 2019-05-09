'use strict';
const moment = require('moment');

const Service = require('egg').Controller;

class LittleOrderService extends Service {
  async insert(params) {
    const {
      ctx
    } = this
  }

  async getList(params) {
    const {
      ctx
    } = this
    const result = await ctx.model.LittleOrder.find(params)
    return result
  }

  async removeById(id) {
    const {
      ctx
    } = this

  }

  async findOne(params) {
    const {
      ctx
    } = this
  }
}

module.exports = LittleOrderService;