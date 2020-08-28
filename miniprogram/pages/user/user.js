// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowInvite: false, // 是否展示邀请按钮
    isReady: false,
    isShowAccept: false, // 是否展示接受按钮
    isInvited: false,
    userInfo: {},
    isImgLoad: false, // 图片是否加载完成
    poinm: '贵枝花园酒店',
    poiaddr: '宜昌市枝江市迎宾大道91号'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.setOpenId()
    this.initUserInfo()
    this.initAnimation()
  },

  setOpenId: async function() {

    wx.showToast({
      title: '熊仔正在初始化',
      icon: 'loading'
    })

    // 获取openid
    const loginInfo = await wx.cloud.callFunction({
      name: 'login',
      data: {}
    })
    wx.hideToast()

    this.setData({
      loginInfo
    })

  },

  initUserInfo: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: this.queryUserMap,
            fail: function() {
              this.showInviteBtn()
            }
          })
        } else {
          this.showInviteBtn()
        }
      },
      fail: function() {
        this.setData({
          isShowInvite: true
        })
      }
    })
  },

  initAnimation: function() {
    this.fadeInAnimation = wx.createAnimation({
      delay: 0,
      duration: 400,
      timingFunction: 'ease-in-out'
    })

    this.indexAnimation = wx.createAnimation({
      delay: 0,
      duration: 1e3,
      timingFunction: 'ease-out'
    })

    this.signAnimation = wx.createAnimation({
      delay: 0,
      duration: 500,
      timingFunction: 'ease-out'
    })

  },

  showInviteBtn: function() {

    this.setData({
      isShowInvite: true
    })

    setTimeout(() => {
      this.fadeInAnimation.opacity(1).step();
      this.setData({
        fadeIn: this.fadeInAnimation.export()
      })
    }, 200)

  },

  queryUserMap: function(res) {
    this.setData({
      // isShowInvite: false,
      avatarUrl: res.userInfo.avatarUrl,
      userInfo: res.userInfo
    })
    // 查询用户信息
    wx.cloud.callFunction({
        name: 'query_user_map',
        data: {
          nickName: res.userInfo.nickName
          // nickName: '嗨过天'
        },
        success: rst => {
          const result = rst.result || {};
          this.setData({
            isReady: true,
            realName: result.realName || '',
            signImg: result.signImg || ''
          })
          // 查询是否已经接受邀请
          this.checkIsInvited()
        },
        fail: function(err) {
          console.log(err)
        }
      })
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getUserInfo: function(res) {
    if (res.detail && res.detail.userInfo) {
      this.animateOutIndex();
      this.queryUserMap(res.detail)
    }
  },

  // 封面消失动画
  animateOutIndex: function() {
    this.indexAnimation.scale(6).opacity(0).step();
    this.fadeInAnimation.opacity(0).step({
      duration: 0
    }).step()

    this.setData({
      indexAni: this.indexAnimation.export(),
      fadeIn: this.fadeInAnimation.export()
    })
  },

  // 图片加载完成
  onSignImgLoad: function() {
    this.signAnimation.scale(1).rotate(10).opacity(1).step()
    this.setData({
      isImgLoad: true,
      signAni: this.signAnimation.export()
    })
  },

  onLayoutEnd: function() {
    this.setData({
      isShowInvite: false
    })
  },

  checkIsInvited: async function() {
    const rst = await wx.cloud.callFunction({
      name: 'query_invite_user',
      data: {
        openid: this.data.loginInfo.result.openid
      }
    })
    this.setData({
      isShowAccept: true,
      isInvited: rst.result.isInvited
    })
  },
  // 在邀请栏中插入数据
  onAccept: async function() {
    this.setData({
      isShowAccept: false
    })
    // 查询是否已经接受过邀请
    await wx.cloud.callFunction({
      name: 'add_invite_user',
      data: {
        openid: this.data.loginInfo.result.openid,
        nickName: this.data.userInfo.nickName,
        realName: this.data.realName,
        avatarUrl: this.data.avatarUrl
      }
    })

    this.setData({
      isInvited: true
    })
  },

  onCancel: async function() {
    wx.showToast({
      title: '正在取消',
      icon: 'loading'
    })
    await wx.cloud.callFunction({
      name: 'cancel_invite_user',
      data: {
        openid: this.data.loginInfo.result.openid
      }
    })
    wx.hideToast()

    this.setData({
      isInvited: false,
      isShowAccept: true
    })
  },

  showMap: function() {
    wx.openLocation({
      type: 'wgs84',
      latitude: 30.42832782422223,
      longitude: 111.74156261295316,
      name: this.data.poinm,
      address: this.data.poiaddr
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '剑桥与巧媛的婚礼邀请',
      imageUrl: '../../images/share.png'
    }
  },
  openWebview: function() {
    wx.navigateTo({
      url: '../web/web'
    })
  }
})