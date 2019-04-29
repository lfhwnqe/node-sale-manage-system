'use strict';
module.exports = app => {
  try {
    var mongoose = app.mongoose;
    mongoose.set('useCreateIndex', true);
    var Schema = mongoose.Schema;
    var UserSchema = new Schema({
      username: {
        type: String,
        require: true,
        max: 32,
        min: [0, '必须输入用户名'],
        unique: true
      },
      password: {
        type: String,
        require: true,
        min: [0, '必须输入密码'],
        max: 32
      },
      // 用户的角色
      role: {
        type: String,
        require: true,
        default: 'baseUser'
      },
      // 用户所在组织
      groupId: {
        type: String,
        require: true
      }
    });
    return mongoose.model('User', UserSchema);
  } catch (e) {
    return mongoose.model('User');
  }
};
