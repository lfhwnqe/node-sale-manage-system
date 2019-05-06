'use strict';
const Controller = require('egg').Controller;

class ProductController extends Controller {
  async insert() {
    const {
      ctx
    } = this;
    try {

      const params = ctx.request.body
      const form = ctx.helper.validateByModelDict(params, 'productDict')
      const data = await ctx.service.product.insertProductType(form)
      ctx.body = {
        data,
        success: true
      }
    } catch (err) {
      if (err.message.indexOf('E11000 duplicate key') !== -1) {
        err = new Error('请勿添加重复的产品名称或产品名称简写')
        throw err
      }
      throw new Error(err)
    }
  }

  async getList() {
    const {
      ctx
    } = this;
    try {
      const params = ctx.request.body
      const data = await ctx.service.product.getProductTypeList(params)
      ctx.body = {
        data,
        success: true
      }
    } catch (err) {

    }
  }

  async remove() {
    const {
      ctx
    } = this;
    try {
      const params = ctx.request.body
      const data = await ctx.service.product.removeProductTypeList(params.id)
      ctx.body = {
        data,
        success: true
      }
    } catch (err) {

    }
  }

}

module.exports = ProductController;
