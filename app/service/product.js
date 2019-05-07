'use strict';

const Service = require('egg').Controller;

class ProductService extends Service {

  async insertProductType(params) {
    const {
      ctx
    } = this
    const groupId = await this.ctx.service.user.getUserGroupId(this.ctx.userinfo)
    const product = new ctx.model.Product();
    product.label = params.label
    product.value = params.value
    product.productTypeId = params.productTypeId
    product.groupId = groupId
    const result = await product.save()
    return result
  }

  async getProductTypeList(params) {
    if (params.productTypeValue) {
      const productTypeId = await this.ctx.service.productType.findOne({
        value: params.productTypeValue
      })
      delete params.productTypeValue
      params.productTypeId = productTypeId.id
    }
    const groupId = await this.ctx.service.user.getUserGroupId(this.ctx.userinfo)
    params.groupId = groupId
    const result = await this.ctx.model.Product.find(params, 'productTypeId label value')
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
