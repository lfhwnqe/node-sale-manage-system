'use strict';

module.exports = (option) => {
  // 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
  return async function(ctx, next) {
    console.log('askdjhasjkd')
    let params;
    const requestUrl = ctx.request.url;
    const method = requestUrl.method;
    if (method === 'get') {
      params = ctx.request.query;
    } else {
      params = ctx.request.body;
    }
    ctx.logger.info('request params is :', params);
    ctx.logger.info('request url is:', requestUrl);
    await next();
  };
};

