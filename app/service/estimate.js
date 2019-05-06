'use strict';
const {
  estimate
} = require('../../config/model_dict')

const Service = require('egg').Controller;

class EstimateService extends Service {

  async insert(params) {
    const {
      ctx
    } = this
    // try {
    const product = new ctx.model.Product();
    const paramArray = estimate.params

    product.label = params.label
    product.value = params.value
    product.countValue = params.countValue
    const result = await product.save()
    return result
  }

  async getList(params) {
    const {
      ctx
    } = this
    const result = await this.ctx.model.Product.find()
    return result
  }

  async removeById(id) {
    const result = await this.ctx.model.Product.deleteOne({
      _id: id
    });
    return result
  }
}

module.exports = EstimateService;
