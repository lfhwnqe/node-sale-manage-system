'use strict';
const Controller = require('egg').Controller;

class ProductTypeController extends Controller {
  // 添加产品类型
  async insert() {
    const {
      ctx
    } = this;
    try {
      const params = ctx.request.body
      const form = ctx.helper.validateByModelDict(params, 'productTypeDict')
      const data = await ctx.service.productType.insert(form)
      ctx.returnSuccess(data);
    } catch (err) {
      if (err.message.indexOf('E11000 duplicate key') !== -1) {
        err = new Error('请勿添加重复的产品类型或产品类型简写')
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
      const data = await ctx.service.productType.getList(params)
      ctx.returnSuccess(data);
    } catch (err) {

    }
  }

  async removeById() {
    const {
      ctx
    } = this;
    try {
      const params = ctx.request.body
      const data = await ctx.service.productType.removeById(params.id)
      ctx.returnSuccess(data);
    } catch (err) {

    }
  }

}

module.exports = ProductTypeController;
