'use strict';

const Service = require('egg').Controller;

class UserService extends Service {
  async isUserLogin() {
    return true;
  }

  async login(username, password) {
    const user = await this.ctx.model.User.find({
      username,
      password
    });
    if (!user) throw new Error('用户不存在');
    return user.id;
  }

  async createUser(username, password) {
    const user = new this.ctx.model.User();
    const userIsExist = await this.ctx.model.User.find({
      username,
      password
    });
    if (userIsExist) throw new Error('用户名已存在')
    user.username = username;
    user.password = password;
    return user.save();
  }
}

module.exports = UserService;