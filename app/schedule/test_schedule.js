'use strict';

const nodemailer = require('nodemailer');
const auth = require('../../user_config')
const xlsx = require('node-xlsx');
const fs = require('fs')
const moment = require('moment');





const time = 1000 * 60 * 60 * 24;
// const time = 1000 * 60
module.exports = {
  schedule: {
    interval: time, // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    // 生成前一日账单为excel文件
    const params = {
      startTime: moment().startOf('day').format()
    }
    const data = await ctx.service.order.totalRevenueStatics(params)
    // 获取所有数据
    const {
      orderList
    } = await ctx.service.order.getOrderList({
      saleTimeStart: moment().startOf('day').format(),
      pageSize: 999
    })
    const orderListExcelData = orderList.map((item, index) => {
      return [index + 1, item.productName, item.amount, item.totalPrice, item.tagPrice, item.saleTime, item.remark]
    })
    const excelData = [
      ['序号', '商品名称', '商品数量', '实际出售价格', '吊牌价格', '出售时间', '备注'],
      ...orderListExcelData,
      ['', '', '', '', '', '总量', '总价格'],
      ['', '', '', '', '', data.totalAmount, data.totalCount]
    ]
    const buffer = xlsx.build([{
      name: "mySheetName",
      data: excelData
    }])

    const fileName = `./data_files/${new Date().toLocaleDateString()}销售数据统计.xlsx`
    fs.writeFile(fileName, buffer, (err => {
      if (err) throw err
    }))

    // // 邮件发送设置
    const transporter = nodemailer.createTransport({
      // host: 'smtp.ethereal.email',
      service: '163', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
      port: 465, // SMTP 端口
      secureConnection: true, // 使用了 SSL
      auth: {
        user: auth.email,
        // 这里密码不是邮箱密码，是邮箱smtp授权码
        pass: auth.auth,
      }
    });

    const mailOptions = {
      from: auth.email, // sender address
      to: auth.sendTo[0], // list of receivers
      subject: `${new Date().toLocaleDateString()}销售数据统计`, // Subject line
      // 发送text或者html格式
      // text: 'Hello world?', // plain text body
      html: `${new Date().toLocaleDateString()}销售数据统计`, // html body
      attachments: [{
        path: fileName
      }]
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      const time = new Date()
      console.log('Message sent: %s', info.messageId, time);
      // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>

    });
  },
};
