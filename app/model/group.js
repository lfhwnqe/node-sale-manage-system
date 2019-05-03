'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  try {
    mongoose.set('useCreateIndex', true);
    const Schema = mongoose.Schema;
    /** 组织表，用于记录组织信息 **/
    const GroupSchema = new Schema({
      // 组织名称
      groupName: {
        type: String,
        require: true,
        unique: true
      },
      groupLabel: {
        type: String,
        require: true,
        unique: true
      }
    });
    return mongoose.model('Group', GroupSchema);
  } catch (e) {
    return mongoose.model('Group');
  }
};
