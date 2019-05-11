'use strict';
const { userDict } = require('../../config/model_dict');

module.exports = app => {
  try {
    var mongoose = app.mongoose;
    mongoose.set('useCreateIndex', true);
    var Schema = mongoose.Schema;
    var UserSchema = new Schema(userDict.schema);
    return mongoose.model('User', UserSchema);
  } catch (e) {
    return mongoose.model('User');
  }
};
