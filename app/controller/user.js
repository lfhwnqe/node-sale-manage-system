'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async createUser() {
    const {
      ctx
    } = this;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    if (!username || !password) {
      throw new Error('参数缺失');
      return;
    } else {
      await ctx.service.user.createUser(username, password);
      ctx.cookies.set('userinfo', username, {
        maxAge: 1000 * 60 * 30,
        encrypt: true
      })
      ctx.body = {
        success: true
      }
    }
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
        ctx.cookies.set('userinfo', hasUser, {
          maxAge: 1000 * 60 * 30,
          encrypt: true
        })
        ctx.body = {
          data: hasUser,
          success: true,
        }

      } else {
        ctx.body = {
          success: false,
          msg: '用户名或密码错误，请从新登陆'
        }
      }
    }
  }

  async showUsers() {
    const {
      ctx
    } = this
    const user = await ctx.model.User.find({});
    ctx.body = {
      data: user,
      success: true
    }
  }
}

module.exports = UserController;
