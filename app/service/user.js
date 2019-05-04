'use strict';

const Service = require('egg').Controller;

class UserService extends Service {
  async login(username, password) {
    const user = await this.ctx.model.User.findOne({
      username,
      password
    });
    if (!user) throw new Error('用户不存在');
    return user.id;
  }

  async createUser({
                     username,
                     password,
                     userLabel,
                     role = 'baseUser',
                     groupId,
                     adminId
                   }) {
    const user = new this.ctx.model.User();
    const userIsExist = await this.ctx.model.User.findOne({
      username,
    });
    if (userIsExist) throw new Error('用户名已存在');
    if (adminId) {
      const user = await this.findUserById(adminId);
      groupId = user.groupId;
    }
    user.username = username;
    user.password = password;
    user.userLabel = userLabel;
    user.role = role;
    user.groupId = groupId;
    console.log('user:', user);
    return user.save();
  }

  async findUserNameByUserId(userId) {
    try {
      const user = await this.ctx.model.User.findOne({
        _id: userId
      });
      return user.username;
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUserById(userId) {
    const user = await this.ctx.model.User.findOne({
      _id: userId
    });
    return user;
  }

  async findUserListByGroup(userId) {
    const thisUser = await this.ctx.model.User.findOne({
      _id: userId
    });
    if (thisUser.role !== 'superAdmin') {
      return [thisUser];
    }
    const groupId = thisUser.groupId;
    const data = await this.ctx.model.User.find({
      groupId
    }, {
      userLabel: 1,
      username: 1
    });
    return data;
  }

  async getUserRoleById(userId) {
    const thisUser = await this.ctx.model.User.findOne({
      _id: userId
    });
    return thisUser.role;
  }

  async getSaleByList(userId) {
    const userList = await this.ctx.service.user.findUserListByGroup(userId);
    return userList;
  }
}

module.exports = UserService;
