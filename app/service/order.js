'use strict';

const Service = require('egg').Controller;

class OrderService extends Service {

  async insertOrder(params) {
    try {
      if (!params.saleTime) {
        params.saleTime = Date.parse(Date.now());
      } else {
        params.saleTime = Date.parse(new Date(params.saleTime));
      }
      let ordersTotalPrice = 0;
      params.ordersList.forEach(order => {
        ordersTotalPrice += order.price;
      });
      params.ordersTotalPrice = ordersTotalPrice;
      const insertOrderResult = await this.ctx.model.Order.create(params);
      return insertOrderResult;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getOrderList(params) {
    try {
      const {
        pageSize = 20, pageNum = 1
      } = params;
      const queryForm = {};
      let groupId;
      const userRole = await this.ctx.service.user.getUserRoleById(params.userId);
      if (userRole === 'superAdmin') {
        const userInfo = await this.ctx.service.user.findUserById(params.userId);
        groupId = userInfo.groupId;
      }
      ['saleTimeStart', 'groupId'].forEach(key => {
        if (params['saleTimeStart']) {
          queryForm['saleTime'] = {
            // 这里需要加上new Date() mongodb才能解析日期
            '$gte': new Date(params['saleTimeStart'])
          };
        }
        /** userId进行筛选处理 **/
        else if (key === 'groupId') {
          if (userRole === 'superAdmin') {
            queryForm[key] = groupId;
          }
        }
      });

      if (!queryForm.groupId) {
        queryForm.userId = params.userId;
      }

      const skip = (pageNum * 1 - 1) * pageSize;
      const orderList = await this.ctx.model.Order.find(queryForm).sort({
        saleTime: -1
      }).limit(pageSize * 1).skip(skip);
      /** 获取当前查询条件下订单数量，总收入统计 **/
      const revenueStaticsQuery = [{
          $match: queryForm
        },
        {
          $group: {
            '_id': null,
            'totalPrice': {
              '$sum': '$ordersTotalPrice'
            },
          }
        }
      ]
      const revenueStaticsResult = await this.ctx.model.Order.aggregate(revenueStaticsQuery)
      const totalPrice = revenueStaticsResult[0].totalPrice
      let totalQuery = {};
      if (groupId) {
        totalQuery = {
          groupId
        };
      } else {
        totalQuery = {
          userId: queryForm.userId
        };
      }
      const total = await this.ctx.model.Order.find(totalQuery).countDocuments()
      const totalPage = total / pageSize;
      return {
        orderList,
        pageNum,
        pageSize,
        totalPrice,
        total,
        totalPage: Math.floor(totalPage) + 1
      };
    } catch (err) {
      console.log('err:', err);
    }
  }

  // 根据传入的时间统计日期内订单总和
  async totalRevenueStatics(params) {
    try {
      const {
        userId,
        startTime,
        endTime
      } = params;
      const userRole = await this.ctx.service.user.getUserRoleById(params.userId);
      let groupId;
      if (userRole === 'superAdmin') {
        const userInfo = await this.ctx.service.user.findUserById(userId);
        groupId = userInfo.groupId;
      }
      const queries = [{
          $match: {
            userId: userId ? userId : {
              '$exists': true
            },
            'saleTime': {
              // 这里需要加上new Date() mongodb才能解析日期
              '$gte': new Date(startTime),
              '$lt': endTime ? new Date(endTime) : new Date()
            }
          }
        },
        {
          $group: {
            '_id': null,
            'totalPrice': {
              '$sum': '$ordersTotalPrice'
            },
            'saleNumber': {
              $sum: 1
            }
          }
        },
      ];
      if (groupId) {
        queries[0]['$match'].groupId = groupId;
        delete queries[0]['$match'].userId;
      }
      const total = await this.ctx.model.Order.aggregate(queries);

      return total[0] || {
        _id: null,
        totalCount: 0,
        totalAmount: 0,
        saleNumber: 0
      };
    } catch (err) {
      console.log('error in mongodb:', err);
    }
  }

  async getPhoneNumberList(phoneNumber) {
    let query;
    if (phoneNumber) {
      const regex = new RegExp(`${phoneNumber}`);
      query = {
        $or: [{
          phone: {
            $regex: regex,
            $options: 'i'
          }
        }]
      };
    }
    const projection = {
      phone: 1
    };
    // 模糊查询返回10条数据
    const phones = await this.ctx.model.Order.find(query).limit(10).distinct('phone');
    return phones;
  }
}

module.exports = OrderService;
