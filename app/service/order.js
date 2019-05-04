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

  async removeOrderById(orderId, userId) {
    if (!orderId) throw new Error('参数错误');
    // 确定该订单在提交删除用户的组织内
    const userData = await this.ctx.service.user.findUserById(userId);
    const orderData = await this.getOrderDetailByOrderId(orderId);
    if (!orderData) throw new Error('没有该订单');
    if (userData.role !== 'superAdmin' || userData.groupId !== orderData.groupId) throw new Error('没有权限');
    const data = await this.ctx.model.Order.remove({
      _id: orderId
    });
    return data;
  }

  async getOrderList(params) {
    try {
      const {
        pageSize = 20, pageNum = 1
      } = params;
      const queryForm = {};
      let canDeleteOrder = false;
      const userRole = await this.ctx.service.user.getUserRoleById(params.userId);
      if (userRole === 'superAdmin') {
        const userInfo = await this.ctx.service.user.findUserById(params.userId);
        queryForm.groupId = userInfo.groupId;
        canDeleteOrder = true;
      } else { // 普通用户查询只传userId
        queryForm.userId = params.userId;
      }
      ['fromTime', 'endTime'].forEach(key => {
        if (key === 'fromTime' && params[key]) {
          queryForm['saleTime'] = {
            // 这里需要加上new Date() mongodb才能解析日期
            '$gte': new Date(params[key])
          };
        } else if (key === 'endTime' && params[key]) {
          queryForm['saleTime'] = {
            // 这里需要加上new Date() mongodb才能解析日期
            '$lt': new Date(params[key])
          };
        }
      });
      if (params.saleBy) {
        queryForm.userId = params.saleBy;
      }

      if (params.phoneNumber) {
        queryForm.phone = params.phoneNumber;
      }

      if (!queryForm.groupId) {
        queryForm.userId = params.userId;
      }

      const skip = (pageNum * 1 - 1) * pageSize;
      const orderList = await this.ctx.model.Order.find(queryForm).sort({
        saleTime: -1
      }).limit(pageSize * 1).skip(skip);
      const total = await this.ctx.model.Order.find(queryForm).countDocuments();
      const totalPage = total / pageSize;
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
      ];
      const revenueStaticsResult = await this.ctx.model.Order.aggregate(revenueStaticsQuery);
      let totalPrice;
      if (revenueStaticsResult.length > 0) {
        totalPrice = revenueStaticsResult[0].totalPrice;
      } else {
        totalPrice = 0;
      }
      return {
        canDeleteOrder,
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

  async getOrderDetailByOrderId(orderId) {
    const result = await this.ctx.model.Order.findOne({ _id: orderId });
    return result;
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
