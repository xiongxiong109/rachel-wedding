// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  const userInvite = db.collection('user_invite');
  const hasInvited = await userInvite.where({
    openid: _.eq(event.openid)
  }).get()

  // 已经存在数据
  if (hasInvited.data && hasInvited.data.length) {
    return {
      isInvited: true
    }
  } else {
    const rst = await userInvite.add({
      data: {
        openid: event.openid,
        nickName: event.nickName,
        realName: event.realName
      }
    })
    return {
      isInvited: true,
      addStatus: true
    }
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}