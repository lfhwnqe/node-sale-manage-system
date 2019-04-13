'use strict';
module.exports = app => {
  try {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var UserSchema = new Schema({
      username: {
        type: String,
        require: true,
        max: 64,
        min: [0, '必须输入用户名'],
        unique: true
      },
      password: {
        type: String,
        require: true,
        min: [0, '必须输入密码'],
        max: 32
      }
    });
    return mongoose.model('User', UserSchema);
  } catch (e) {
    return mongoose.model('User');
  }
};