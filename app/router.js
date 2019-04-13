'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller
  } = app;
  router.get('/', app.jwt, controller.home.index);
  router.post('/createUser', controller.user.createUser)
  router.get('/login', controller.user.login)
};