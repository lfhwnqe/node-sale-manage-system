'use strict';
const moment = require('moment');

const Service = require('egg').Controller;

class OrderService extends Service {

  async insertOrder(params) {
    const {
      ctx
    } = this;
    try {
      if (!params.saleTime) {
        params.saleTime = Date.parse(Date.now());
      } else {
        params.saleTime = Date.parse(new Date(params.saleTime));
      }
      const userId = ctx.userinfo;
      const {
        groupId,
        userLabel
      } = await ctx.service.user.findUserById(userId);
      const saleBy = userLabel;
      params.userId = userId;
      params.groupId = groupId;
      params.saleBy = saleBy;
      if (params.ordersList) {
        let ordersTotalPrice = 0
        params.ordersList.forEach(item => {
          ordersTotalPrice += item.price
        })
        params.ordersTotalPrice = ordersTotalPrice
      }

      const insertOrderResult = await ctx.model.Order.create(params);
      const orderId = insertOrderResult.id;

      if (params.ordersList) {
        // 依次生成子订单
        await Promise.all(params.ordersList.map(item => {
          const littleOrder = new ctx.model.LittleOrder();
          littleOrder.productType = item.productType;
          littleOrder.product = item.product;
          littleOrder.number = item.number;
          littleOrder.price = item.price;
          littleOrder.orderId = orderId;
          return littleOrder.save();
        }));
      }

      return orderId;
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

  // async getOrderList(params) {
  //   const { ctx } = this;
  //   const result = await ctx.model.LittleOrder.find({}).populate('orderId');
  //   // console.log()
  //   return result;
  // }

  async getOrderList(params) {
    const {
      ctx
    } = this;
    try {
      const userId = ctx.userinfo;
      const {
        pageSize = 20, pageNum = 1
      } = params;
      const queryForm = {};
      let canDeleteOrder = false;
      const userRole = await this.ctx.service.user.getUserRoleById(userId);
      if (userRole === 'superAdmin') {
        const userInfo = await this.ctx.service.user.findUserById(userId);
        queryForm.groupId = userInfo.groupId;
        canDeleteOrder = true;
      } else { // 普通用户查询只传userId
        queryForm.userId = userId;
      }
      ['fromTime', 'endTime'].forEach(key => {
        if (key === 'fromTime' && params[key]) {
          queryForm['saleTime'] = {
            // 这里需要加上new Date() mongodb才能解析日期
            '$gte': moment(params[key]).add(8, 'hours')
          };
        } else if (key === 'endTime' && params[key]) {
          queryForm['saleTime'] = {
            // 这里需要加上new Date() mongodb才能解析日期
            '$lt': moment(params[key]).add(8, 'hours')
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
        queryForm.userId = userId;
      }

      // if (params.productType) {
      //   queryForm['ordersList.productType'] = params.productType
      // }


      const skip = (pageNum * 1 - 1) * pageSize;
      const orderList = await this.ctx.model.Order.find(queryForm).sort({
        saleTime: -1
      }).limit(pageSize * 1).skip(skip)

      // const orderList = await Promise.all(orders.map(async order => {
      //   const fn = async () => {
      //     const list = await ctx.service.littleOrder.getList({
      //       orderId: order.id
      //     }, 'productType product number price')
      //     order.ordersList = list
      //     return order
      //   }
      //   return fn()
      // }))

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
              // '$lt': endTime ? new Date(endTime) : new Date()
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
    const result = await this.ctx.model.Order.findOne({
      _id: orderId
    });
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
