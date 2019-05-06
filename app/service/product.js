'use strict';

const Service = require('egg').Controller;

class ProductService extends Service {

  async insertProductType(params) {
    const {
      ctx
    } = this
    const product = new ctx.model.Product();
    product.label = params.label
    product.value = params.value
    product.countValue = params.countValue
    const result = await product.save()
    return result
  }

  async getProductTypeList(params) {
    const {
      ctx
    } = this
    const result = await this.ctx.model.Product.find()
    return result
  }

  async removeProductTypeList(id) {
    const result = await this.ctx.model.Product.deleteOne({
      _id: id
    });
    return result
  }
}

module.exports = ProductService;
