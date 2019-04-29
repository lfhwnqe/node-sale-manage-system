'use strict';
const moment = require('moment');
// moment().format();

const Controller = require('egg').Controller;

class GroupController extends Controller {
  async setUserGroup() {
    const {
      ctx
    } = this;
    const userId = ctx.userinfo;
    const { role } = await ctx.service.user.findUserById({ _id: userId });
    if (role !== 'superAdmin') throw new Error('没有权限');
    const { groupId } = ctx.request.body;
    const data = await ctx.service.group.setUserInGroupByUserId(groupId, userId);
    ctx.body = {
      success: true,
      data
    };
  }

  async createGroup() {
    const {
      ctx
    } = this;
    const userId = ctx.userinfo;
    const { role } = await ctx.service.user.findUserById({ _id: userId });
    if (role !== 'superAdmin') throw new Error('没有权限');
    const { groupName } = ctx.request.body;
    const data = await ctx.service.group.createGroup(groupName);
    ctx.body = {
      success: true,
      data
    };
  }

}

module.exports = GroupController;
