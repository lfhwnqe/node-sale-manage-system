'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller,
    middleware
  } = app;

  const auth = middleware.auth();

  router.get('/api/createAdminUser', controller.user.createAdminUser)
  // 管理员创建用户
  router.post('/api/createUser', auth, controller.user.createUser)
  router.post('/api/login', controller.user.login);
  router.post('/api/geTotalRevenueStatics', auth, controller.home.geTotalRevenueStatics);
  router.get('/api/getUserList', auth, controller.user.findUserListByGroup)
  // router.get('/api/getUserList', controller.user.showUsers)
  router.post('/api/insertOrder', auth, controller.order.insertOrder);
  router.post('/api/removeOrderById', auth, controller.order.removeOrderById)
  router.get('/api/getOrderList', auth, controller.order.getOrderList);
  router.get('/api/getPhoneNumberList', auth, controller.order.getPhoneNumberList)
  // 获取销售员列表
  router.get('/api/getSaleByList', auth, controller.user.getSaleByList)

  // 产品大类相关
  router.post('/api/insertProductType', auth, controller.productType.insert);
  router.post('/api/getProductTypeList', auth, controller.productType.getList);
  router.post('/api/removeProductType', auth, controller.productType.removeById);

  // 产品相关
  router.post('/api/insertProduct', auth, controller.product.insert);
  router.post('/api/getProductList', auth, controller.product.getList);
  router.post('/api/removeProduct', auth, controller.product.remove);

  // 用户组织相关
  router.post('/api/setUserGroup', auth, controller.group.setUserGroup);
  router.post('/api/createGroup', auth, controller.group.createGroup);
};
