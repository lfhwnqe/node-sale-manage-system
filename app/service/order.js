'use strict';

const Service = require('egg').Controller;

class OrderService extends Service {

  async insertOrder(params) {
    try {
      if (!params.saleTime) {
        params.saleTime === Date.parse(Date.now())
      } else {
        params.saleTime === Date.parse(params.saleTime)
      }
      const insertOrderResult = await this.ctx.model.Order.create(params)
      return insertOrderResult;
    } catch (err) {
      throw new Error(err)
    }
  }

  async getOrderList(params) {
    try {
      const {
        pageSize = 20, pageNum = 1
      } = params
      const queryForm = {};
      ['productName', 'amount', 'totalPrice', 'tagPrice', 'saleTime', 'userId'].forEach(key => {
        if (params[key]) {
          queryForm[key] = params[key]
        }
      })

      const skip = (pageNum * 1 - 1) * pageSize
      const orderList = await this.ctx.model.Order.find(queryForm).sort({
        saleTime: -1
      }).limit(pageSize * 1).skip(skip);
      const totalPage = await this.ctx.model.Order.find({
        userId: queryForm.userId
      }).count() / pageSize
      return {
        orderList,
        pageNum,
        pageSize,
        totalPage: Math.floor(totalPage) + 1
      }
    } catch (err) {
      console.log('err:', err)
    }
  }
  // 根据传入的时间统计日期内订单总和
  async totalRevenueStatics(params) {
    try {
      const {
        userId,
        startTime,
        endTime
      } = params
      const total = await this.ctx.model.Order.aggregate([{
          $match: {
            userId,
            'saleTime': {
              // 这里需要加上new Date() mongodb才能解析日期
              '$gte': new Date(startTime),
              '$lt': new Date(endTime)
            }
          }
        },
        {
          $group: {
            '_id': null,
            'totalCount': {
              '$sum': '$totalPrice',
            },
            'totalAmount': {
              '$sum': '$amount'
            }
          }
        },
      ])

      return total[0]
    } catch (err) {
      console.log('error in mongodb:', err)
    }
  }
}

module.exports = OrderService;
