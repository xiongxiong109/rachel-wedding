// 接受邀请
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
  }).get()

  // 已经存在数据
  if (hasInvited.data && hasInvited.data.length) {
    
    // 更新该数据为accepted
    await userInvite.where({
      openid: _.eq(event.openid)
    }).update({
      data: {
        isAccepted: true,
        realName: event.realName,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl || ''
      }
    })

    return {
      isInvited: true,
      isAccepted: hasInvited.data[0].isAccepted
    }
  } else {
    const rst = await userInvite.add({
      data: {
        openid: event.openid,
        nickName: event.nickName,
        realName: event.realName,
        avatarUrl: event.avatarUrl,
        // 是否接受了邀请
        isAccepted: true
      }
    })
    return {
      isInvited: true,
      isAccepted: true
    }
  }
}