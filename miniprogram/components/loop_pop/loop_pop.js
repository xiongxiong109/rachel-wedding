// components/loop_pop/loop_pop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // isupdate: {
    //   type: Boolean,
    //   default: false,
    //   observer: function(newVal, oldVal) {
    //     if (newVal != oldVal) {
    //       this.queryInviteList()
    //     }
    //   }
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userList: []
  },

  attached: async function() {
    await this.queryInviteList();
    this.initDbWatcher()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    queryInviteList: async function() {
      const rst = await wx.cloud.callFunction({
        name: 'query_invite_list',
        data: {}
      })
      let data = (rst && rst.result) || []
      this.setData({
        userList: data
      })
    },
    initDbWatcher: async function() {
 
      // 监听数据变化推送
      const db = wx.cloud.database({
        env: 'dev-615384'
      });

      const _ = db.command
      const rst = await db.collection('user_invite').where({
        isAccepted: _.eq(true)
      }).get()
      console.log(rst)
      // db.collection('user_invite').where({}).watch({
      //   onChange: function(rst) {
      //     console.log(rst)
      //   },
      //   onError: function(err) {
      //     console.log(err)
      //   }
      // })
    }
  }
})
