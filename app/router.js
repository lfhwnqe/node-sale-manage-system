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

  router.get('/', auth, controller.home.index);
  router.post('/createUser', controller.user.createUser)
  router.get('/login', controller.user.login)
};