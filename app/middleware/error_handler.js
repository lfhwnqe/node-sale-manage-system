'use strict';

module.exports = (option, app) => {
  // 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      if (err.message.indexOf('E11000 duplicate key') !== -1) {
        err = new Error('请勿添加重复的数据');
      }
      console.log('logger');
      app.logger.error(new Error(err));
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      // const msg = status === 500 && app.config.env === 'prod'
      //   ? 'Internal Server Error'
      //   : err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      if (err.message && err.message.indexOf('Error:') > -1) {
        err.message = err.message.split('Error:')[1];
      }
      const msg = err.message;
      ctx.body = {
        msg
      };
      ctx.body.success = false;
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};
