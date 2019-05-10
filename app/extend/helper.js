const moment = require('moment')
const modelDict = require('../../config/model_dict')

module.exports = {
  validateByModelDict(params, dictType) {
    const errorObj = {
      errMsg: '缺少参数：',
      isError: false
    }
    const ret = {}
    const currentDict = modelDict[dictType]
    currentDict.params.forEach((dict) => {
      if (!params[dict.value] && dict.require) {
        errorObj.isError = true
        errorObj.errMsg += dict.label + ' '
      } else {
        ret[dict.value] = params[dict.value]
      }
    })
    if (errorObj.isError) throw new Error(errorObj.errMsg)
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
    return ret
  },
  // 把mongo时间加8小时
  setLocalTimeToUtc(value) {
    return moment(value).add(8, 'hours')
  }
};
