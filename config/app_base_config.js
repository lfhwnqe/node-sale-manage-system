/** 应用基础配置 **/

/**
 * 角色类型
 * admin：系统管理员
 * manager：普通管理员
 * baseUser：普通用户
 * **/
const roleTypesDict = ['superAdmin', 'baseUser'];

/**
 * 角色权限
 * all: 可查所在组织所有用户数据
 * own: 只可查询自己的数据
 * **/
const permissions = {
  superAdmin: 'all',
  admin: 'all',
  baseUser: 'own'
};

module.exports = {
  roleTypesDict,
  permissions
};
