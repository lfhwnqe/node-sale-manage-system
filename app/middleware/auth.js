'use strict';

module.exports = (option) => {
  // 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
  return async function (ctx, next) {
    try {
      const userinfo = ctx.cookies.get('userinfo', {
        signed: false,
        encrypt: true
      })
      if (!userinfo) {
        ctx.body = {
          success: true,
          msg: '请先登陆',
          code: -2
        }
        return
      }
      const userIsExist = await ctx.model.User.findOne({
        _id: userinfo
      });
      if (!userIsExist) {
        throw new Error('请先登录')
        return
      }

      await next();
    } catch (err) {
      const {
        app
      } = ctx
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this);
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        error_msg,
        code: -1
      };
      ctx.body.success = false;
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};
