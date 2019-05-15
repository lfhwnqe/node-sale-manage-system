module.exports = {
  returnSuccess(data = {}, msg = '') {
    const form = {
      success: true,
      msg,
      data
    };
    this.logger.info('request send data is:', form);
    this.body = form;
  },
};
