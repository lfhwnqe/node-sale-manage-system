'use strict';
const moment = require('moment');

const Service = require('egg').Controller;

class LittleOrderService extends Service {

  async getStatics(params) {
    const {
      ctx
    } = this;
    let groupId;

    const queries = [{
      $match: {}
    },
      {
        $group: {
          '_id': null,
          'totalPrice': {
            '$sum': '$price'
          },
          'totalNum': {
            $sum: '$number'
          }
        }
      }
    ];
    const role = await ctx.service.user.getUserRoleById(ctx.userinfo);
    if (role === 'superAdmin') {
      groupId = await ctx.service.user.getUserGroupId(ctx.userinfo);
      queries[0].$match.groupId = groupId;
    } else {
      queries[0].$match.userId = ctx.userinfo;
    }
    if (params.productType) {
      queries[0].$match.productType = params.productType;
    }
    if (params.product) {
      queries[0].$match.product = params.product;
    }


    // 处理起始时间
    if (params['fromTime']) {
      queries[0].$match['saleTime'] = {
        // 这里需要加上new Date() mongodb才能解析日期
        '$gte': new Date(params['fromTime'])
        // '$gte': moment(params[key]).add(8, 'hours')
      };
    }

    if (params['endTime']) {
      if (!queries[0].$match['saleTime']) {
        queries[0].$match['saleTime'] = {
          // 这里需要加上new Date() mongodb才能解析日期
          '$lt': new Date(params['endTime'])
          // '$lt': moment(params[key]).add(8, 'hours')
        };
      } else {
        queries[0].$match['saleTime']['$lt'] = new Date(params['endTime']);
      }
    }
    const result = await ctx.model.LittleOrder.aggregate(queries);
    return result[0] || {
      totalPrice: 0,
      totalNum: 0
    };
  }

  async getList(params) {
    const {
      ctx
    } = this;
    const result = await ctx.model.LittleOrder.find(params);
    return result;
  }
}

module.exports = LittleOrderService;
