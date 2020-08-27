// 取消邀请
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  const userInvite = db.collection('user_invite');
  const hasInvited = await userInvite.where({
    openid: _.eq(event.openid)
  })
  .limit(1)
  .get()

  // 找到存在的数据
  if (hasInvited.data && hasInvited.data.length) {
    await userInvite.where({
          openid: _.eq(event.openid)
      }).update({
      data: {
        isAccepted: false
      }
    })
    return {
      isFound: true
    }
  } else {
    return {
      isFound: false
    }
  }
}