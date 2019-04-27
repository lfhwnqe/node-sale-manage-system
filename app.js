module.exports = app => {

  app.beforeStart(async () => {
    // 保证应用启动监听端口前数据已经准备好了
    // 后续数据的更新由定时任务自动触发
    console.log('in app.js test_schedule.js is run ')
    // await app.runSchedule('test_schedule.js');
  });
}