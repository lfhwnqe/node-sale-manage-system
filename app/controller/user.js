'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async createUser() {
    const { ctx } = this;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    if (!username || !password) {
      throw new Error('参数缺失');
      return;
    } else {
       await ctx.service.user.createUser(username, password);
       console.log('alskjd')
    }
  }

  async login(){
    const { ctx } = this;
    const username = ctx.request.query.username;
    const password = ctx.request.query.password;
    if (!username || !password) {
      throw new Error('参数缺失');
      return;
    } else {
       await ctx.service.user.login(username, password);
       ctx.body={
         success:true
       }
    }
  }
}

module.exports = UserController;
