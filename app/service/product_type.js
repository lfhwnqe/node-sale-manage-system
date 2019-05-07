'use strict';
const Service = require('egg').Controller;

class ProductTypeService extends Service {

  async insert(params) {
    const {
      ctx
    } = this
    const groupId = await ctx.service.user.getUserGroupId(ctx.userinfo)
    const product = new ctx.model.ProductType();
    product.label = params.label
    product.value = params.value
    product.countLabel = params.countLabel
    product.countValue = params.countValue
    product.groupId = groupId
    const result = await product.save()
    return result
  }

  async getList(params) {
    const groupId = await this.ctx.service.user.getUserGroupId(this.ctx.userinfo)
    params.groupId = groupId
    const result = await this.ctx.model.ProductType.find(params, 'value label countLabel countValue')
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

  async findOne(params) {
    const result = await this.ctx.model.ProductType.findOne(params)
    return result
  }
}

module.exports = ProductTypeService;
