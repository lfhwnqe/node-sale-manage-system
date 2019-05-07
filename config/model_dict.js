'use strict';
const modelDict = {
  // 产品大类
  productTypeDict: {
    schema: {
      label: {
        require: true,
        type: String,
        label: '产品品类'
      },
      value: {
        require: true,
        type: String,
        label: '产品品类值'
      },
      countLabel: {
        require: true,
        type: String,
        label: '品类单位'
      },
      countValue: {
        require: true,
        type: String,
        label: '品类单位值'
      },
      groupId: {
        type: String,
        label: '所属组织'
      },
    }
  },
  // 产品小类，属于产品大类型
  productDict: {
    schema: {
      label: {
        require: true,
        type: String,
        unique: true,
        label: '产品名称'
      },
      value: {
        require: true,
        type: String,
        unique: true,
        label: '产品名称值'
      },
      // 这里是产品大类的id
      productTypeId: {
        require: true,
        type: String,
        label: '产品所属大类'
      },
      groupId: {
        type: String,
        label: '所属组织'
      },
    }
  },
}

Object.keys(modelDict).forEach(key => {
  const currentModel = modelDict[key]
  const params = Object.keys(currentModel.schema).map(item => {
    const currentItem = currentModel.schema[item]
    const ret = {
      label: currentItem.label,
      value: item,
      require: currentItem.require
    }
    return ret
  })
  currentModel.params = params
})

module.exports = modelDict
