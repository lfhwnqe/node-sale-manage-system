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

  const auth = middleware.auth()

  router.get('/api/createUser', controller.user.createUser)
  router.post('/api/login', controller.user.login)
  router.post('/api/geTotalRevenueStatics',auth,controller.home.geTotalRevenueStatics)
  // router.get('/api/getUserList', controller.user.showUsers)
  router.post('/api/insertOrder', auth, controller.order.insertOrder)
  router.get('/api/getOrderList', auth, controller.order.getOrderList)
};
