module.exports = {
  returnSuccess(data = {}, msg = '') {
    this.body = {
      success: true,
      msg,
      data
    };
  },
};
