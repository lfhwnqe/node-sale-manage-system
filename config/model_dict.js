'use strict';
const modelDict = {
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
      countValue: {
        require: true,
        type: String,
        label: '计量单位'
      }
    }
  },


  estimateDict: {
    schema: {
      label: {
        require: true,
        type: String,
        unique: true,
        label: '计量单位'
      },
      value: {
        require: true,
        type: String,
        unique: true,
        label: '计量单位值'
      },
    },
  }
}

Object.keys(modelDict).forEach(key => {
  const currentModel = modelDict[key]
  const params = Object.keys(currentModel.schema).map(item => {
    const currentItem = currentModel.schema[item]
    const ret = {
      label: currentItem.label,
      value: item
    }
    return ret
  })
  currentModel.params = params
})

module.exports = modelDict
