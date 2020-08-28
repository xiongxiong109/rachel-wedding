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
    userList: [],
    curIndex: 0
  },

  attached: async function() {
    await this.queryInviteList();
    this.initDbWatcher()
  },
  detached: function() {
    // 关闭对数据库的监听
    this.dbWatcher && this.dbWatcher.close();
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
    initDbWatcher: function() {
      const _view = this;
      // 监听数据变化推送
      const db = wx.cloud.database();
      this.dbWatcher = db.collection('user_invite').where({
        isAccepted: true
      }).watch({
        onChange: function(rst) {
          _view.setData({
            userList: rst.docs,
            curIndex: 0
          })
        },
        onError: function(err) {
          console.log(err)
        }
      })
    }
  }
})
