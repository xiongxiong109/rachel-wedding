// 查询已经接受邀请的用户信息
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
  const rst = hasInvited.data;
  const user = rst.length ? rst[0] : {};
  return {
    isInvited: user.isAccepted
  }
}