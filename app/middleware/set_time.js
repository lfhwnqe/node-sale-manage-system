'use strict';
const moment = require('moment');

module.exports = (option) => {
  // 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
  return async function (ctx, next) {
    const queries = ctx.request.query
    const params = ctx.request.body
    const keys = []
    Object.keys(queries).forEach(key => {
      keys.push(key)
    })
    Object.keys(params).forEach(key => {
      keys.push(key)
    })
    keys.forEach(key => {
      const keyStr = key.toLowerCase()
      // 特有时间查询字段进行格式处理 fromTime去当天0点，endTime取当天23:59分
      if (keyStr.indexOf('fromtime') > -1) {
        if (queries[key]) {
          // const startDate = moment(queries[key]).utc().format()
          const startDate = moment(queries[key]).format()
          const timer = moment(startDate).startOf('day').format()
          queries[key] = timer
        }
      } else if (keyStr.indexOf('endtime') > -1) {
        if (queries[key]) {
          const endDate = moment(queries[key]).format()
          // const endDate = moment(queries[key]).utc().format()
          const timer = moment(endDate).endOf('day').format()
          queries[key] = timer
        }
      }
    })
    await next();
  };
};
