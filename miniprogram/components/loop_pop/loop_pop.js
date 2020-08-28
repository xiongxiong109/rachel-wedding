// components/loop_pop/loop_pop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isupdate: {
      type: Boolean,
      default: false,
      observer: function(newVal, oldVal) {
        if (newVal != oldVal) {
          this.queryInviteList()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userList: []
  },

  attached: function() {
    this.queryInviteList();
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
    }
  }
})
