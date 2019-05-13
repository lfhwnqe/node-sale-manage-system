'use strict';
const modelDict = {
  userDict: {
    schema: {
      username: {
        type: String,
        require: true,
        max: 32,
        min: [0, '必须输入账号名'],
        unique: true
      },
      password: {
        type: String,
        require: true,
        min: [0, '必须输入密码'],
        max: 32
      },
      userLabel: {
        type: String,
        require: true,
        min: [0, '必须输入用户名'],
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
    }
  },
  orderDict: {
    schema: {
      // ordersList: [{
      //   productType: String,
      //   product: String,
      //   number: Number,
      //   price: Number
      // }],
      // 买家电话
      phone: {
        type: String
      },
      ordersTotalPrice: {
        type: Number,
        require: true
      },
      // 出售时间
      saleTime: {
        require: true,
        type: Date,
        // default: Date.now,
      },
      // 备注
      remark: {
        type: String,
        max: 320,
      },
      createTime: {
        type: Date,
        default: Date.now,
      },
      userId: {
        type: String,
        require: true
      },
      saleBy: {
        type: String,
        require: true
      },
      // 订单所属组织Id
      groupId: {
        type: String,
        require: true
      }
    }
  },
  littleOrderDict: {
    schema: {
      // 这个id关联到大订单
      orderId: {
        label: '所属订单ID',
        type: String,
        ref: 'Order'
      },
      productType: {
        label: '产品名称',
        type: String,
        require: true
      },
      product: {
        label: '产品',
        type: String,
        require: true
      },
      number: {
        label: '数量',
        type: Number,
        require: true
      },
      price: {
        label: '价格',
        type: Number,
        require: true
      },
      // 出售时间
      saleTime: {
        require: true,
        type: Date,
        // default: Date.now,
      },
      // 订单所属组织Id
      groupId: {
        type: String,
        require: true
      },
      userId: {
        type: String,
        require: true,
        label: '创建订单的用户id'
      }
    }
  },
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
};

Object.keys(modelDict).forEach(key => {
  const currentModel = modelDict[key];
  const params = Object.keys(currentModel.schema).map(item => {
    const currentItem = currentModel.schema[item];
    const ret = {
      label: currentItem.label,
      value: item,
      require: currentItem.require
    };
    return ret;
  });
  currentModel.params = params;
});

module.exports = modelDict;
