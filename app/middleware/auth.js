'use strict';

module.exports = (option) => {
  // 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
  return async function(ctx, next) {
    const userinfo = ctx.cookies.get('userinfo', {
      signed: false,
      encrypt: true
    });
    ctx.cookies.set('userinfo', userinfo, {
      maxAge: 1000 * 60 * 30,
      encrypt: true
    });
    if (!userinfo) {
      ctx.body = {
        success: true,
        msg: '请先登陆',
        code: -2
      };
      return;
    }
    ctx.userinfo = userinfo;
    const userIsExist = await ctx.model.User.findOne({
      _id: userinfo
    });
    if (!userIsExist) {
      throw new Error('请先登录');
    }
    await next();
  };
};
