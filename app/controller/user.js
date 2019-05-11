'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async createUser() {
    const {
      ctx
    } = this;
    const params = ctx.request.body;
    params.adminId = ctx.userinfo;
    // 防止用户生成admin账号
    params.role = '';

    const data = await ctx.service.user.createUser(params);

    const username = data.username;

    ctx.body = {
      data: username,
      success: true
    };
  }

  async findUserListByGroup() {
    const userId = this.ctx.userinfo;
    const data = await this.ctx.service.user.findUserListByGroup(userId);
    this.ctx.body = {
      data,
      success: true
    };
  }

  async createAdminUser() {
    const {
      ctx
    } = this;
    const username = ctx.request.query.username || 'admin';
    const password = ctx.request.query.password || '111111';
    const userLabel = ctx.request.query.userLabel || '管理员';
    const groupName = ctx.request.query.groupName || 'xcjc';
    const groupLabel = ctx.request.query.groupLabel || '小村酒厂';
    const role = 'superAdmin';
    const group = await ctx.service.group.createGroup(groupName, groupLabel);
    const groupId = group._id;
    const data = await ctx.service.user.createUser({
      username,
      password,
      userLabel,
      role,
      groupId
    });
    ctx.body = {
      data,
      success: true
    };
  }

  async login() {
    const {
      ctx,
    } = this;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    if (!username || !password) {
      throw new Error('参数缺失');
      return;
    } else {
      const hasUser = await ctx.service.user.login(username, password);
      if (hasUser) {
        const data = await ctx.service.user.findUserById(hasUser, 'userLabel role groupId');
        ctx.cookies.set('userinfo', hasUser, {
          maxAge: 1000 * 60 * 30,
          encrypt: true
        });
        ctx.body = {
          data,
          success: true,
        };

      } else {
        ctx.body = {
          success: false,
          msg: '用户名或密码错误，请从新登陆'
        };
      }
    }
  }

  async showUsers() {
    const {
      ctx
    } = this;
    const user = await ctx.model.User.find({});
    ctx.body = {
      data: user,
      success: true
    };
  }

  async getSaleByList() {
    const userId = this.ctx.userinfo;
    const data = await this.ctx.service.user.getSaleByList(userId);
    this.ctx.body = {
      data,
      success: true
    };
  }
}

module.exports = UserController;
