/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/sale',
    options: {},
  };

  config.logger = {
    appLogName:'app-nuo-web.log'
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1555131754056_7256';

  // add your middleware config here

  // add your config here
  config.middleware = ['logger', 'errorHandler', 'formatTime'];
  // config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = { // 开发环境关闭
    csrf: {
      enable: false
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
