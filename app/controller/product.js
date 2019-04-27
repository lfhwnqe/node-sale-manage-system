'use strict';
const Controller = require('egg').Controller;

class ProductController extends Controller {
  async insertProductType() {
    const {
      ctx
    } = this;
    try {
      const params = ctx.request.body
      const data = await ctx.service.product.insertProductType(params)
      ctx.body = {
        data,
        success: true
      }
    } catch (err) {
      if (err.message.indexOf('E11000 duplicate key') !== -1) {
        err = new Error('请勿添加重复的产品名称或产品名称简写')
        throw err
      }
      throw new Error(message)
    }
  }

  async getProductTypeList() {
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

  async removeProductTypeList() {
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
