// 查询已受邀的用户列表
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command
  const rst = await db.collection('user_invite').where({
    isAccepted: _.eq(true)
  }).get()
  return rst.data
}