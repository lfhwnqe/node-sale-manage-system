'use strict';
const Service = require('egg').Controller;

class ProductTypeService extends Service {

  async insert(params) {
    const {
      ctx
    } = this
    const product = new ctx.model.ProductType();
    product.label = params.label
    product.value = params.value
    product.countLabel = params.countLabel
    product.countValue = params.countValue
    const result = await product.save()
    return result
  }

  async getList(params) {
    const result = await this.ctx.model.ProductType.find(params,'value label')
    return result
  }

  async removeById(id) {
    await this.ctx.model.ProductType.deleteOne({
      _id: id
    });
    const result = await this.ctx.model.Product.deleteMany({
      productTypeId: id
    })
    return result
  }
}

module.exports = ProductTypeService;
