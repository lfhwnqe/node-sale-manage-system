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
        let ordersTotalPrice = 0;
        params.ordersList.forEach(item => {
          ordersTotalPrice += item.price;
        });
        params.ordersTotalPrice = ordersTotalPrice;
      }

      const order = new ctx.model.Order();
      order.phone = params.phone;
      order.ordersTotalPrice = params.ordersTotalPrice;
      order.saleTime = params.saleTime;
      order.remark = params.remark;
      order.userId = params.userId;
      order.saleBy = params.saleBy;
      order.groupId = params.groupId;
      // console.log('order order order order:', order);

      // const insertOrderResult = await ctx.model.Order.create(params);
      // const orderId = insertOrderResult.id;

      if (params.ordersList) {
        // 依次生成子订单
        await Promise.all(params.ordersList.map(item => {
          const littleOrder = new ctx.model.LittleOrder();
          littleOrder.productType = item.productType;
          littleOrder.product = item.product;
          littleOrder.number = item.number;
          littleOrder.price = item.price;
          littleOrder.orderId = order._id;
          littleOrder.userId = ctx.userinfo;
          littleOrder.saleTime = params.saleTime;
          littleOrder.groupId = groupId;
          return littleOrder.save();
        }));
      }
      order.save()

      return order;
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
    // 删除子订单
    await this.ctx.model.LittleOrder.remove({ orderId });
    const data = await this.ctx.model.Order.remove({
      _id: orderId
    });
    return data;
  }

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

      // 处理起始时间
      if (params['fromTime']) {
        queryForm['saleTime'] = {
          // 这里需要加上new Date() mongodb才能解析日期
          // '$gte': params['fromTime']
          '$gte': new Date(params['fromTime'])
          // '$gte': moment(params[key]).add(8, 'hours')
        };
      }

      if (params['endTime']) {
        if (!queryForm['saleTime']) {
          queryForm['saleTime'] = {
            // 这里需要加上new Date() mongodb才能解析日期
            // '$lt': params['endTime']
            '$lt': new Date(params['endTime'])
            // '$lt': moment(params[key]).add(8, 'hours')
          };
        } else {
          queryForm['saleTime']['$lt'] = new Date(params['endTime']);
          // queryForm['saleTime']['$lt'] = params['endTime']
        }
      }

      if (params.saleBy) {
        queryForm.userId = params.saleBy;
      }
      if (params.phoneNumber) {
        queryForm.phone = params.phoneNumber;
      }
      if (!queryForm.groupId) {
        queryForm.userId = userId;
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
    const {
      ctx
    } = this;
    const time = moment().utc().format();
    const monthStartDate = moment(time).startOf('month').format();
    const date = moment().date();
    let days = new Array(date).fill({});
    days = days.map((item, index) => {
      const date = moment(monthStartDate).add(index, 'days').format();
      const fromTime = moment(date).startOf('day').format();
      const endTime = moment(date).endOf('day').format();
      return {
        date,
        fromTime,
        endTime
      };
    });

    const result = await Promise.all(days.map(async day => {
      const fn = async () => {

        let order = await this.getOrderList({
          fromTime: day.fromTime,
          endTime: day.endTime
        }) || {};

        order = {
          total: order.total || 0,
          totalPrice: order.totalPrice || 0,
          date: day.date
        };
        return order;
      };
      return fn();
    }));

    return result;
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
