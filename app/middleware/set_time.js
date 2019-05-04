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
      if (keyStr.indexOf('date') > -1 || keyStr.indexOf('time') > -1) {
        if (queries[key]) {
          queries[key] = moment(queries[key]).add(8, 'hours')
        } else {
          params[key] = moment(params[key]).add(8, 'hours')
        }
      }
    })
    await next();
  };
};
