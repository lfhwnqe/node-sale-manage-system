'use strict';

const Service = require('egg').Controller;

class GroupService extends Service {
  async createGroup(groupName, groupLabel) {
    try {
      const group = new this.ctx.model.Group();
      const isGroupExist = await this.ctx.model.Group.findOne({
        groupName,
      });
      if (isGroupExist) throw new Error('组织已存在');
      group.groupName = groupName;
      group.groupLabel = groupLabel
      return group.save();

    } catch (err) {
      if (err.message.indexOf('E11000 duplicate key') !== -1) {
        err = new Error('请勿添加重复的组织')
        throw err
      }
      throw new Error(err)
    }
  }

  /**
   * 根据id把用户加入到指定组织,一个用户同时只有一个组织
   * **/
  async setUserInGroupByUserId(groupId, userId) {
    const Group = this.ctx.model.Group;
    const selectGroup = await Group.findOne({
      _id: groupId,
    });
    if (!selectGroup) throw new Error('组织不存在');
    // 更新用户的组织
    const result = await this.ctx.model.User.userModel.findeOneAndUpdate({
      _id: userId
    }, {
      group: groupId
    });
    return result;
  }
}

module.exports = GroupService;
