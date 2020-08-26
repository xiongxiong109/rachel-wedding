// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  // 查询已有的用户信息映射表
  const db = cloud.database()
  const _ = db.command

  const nickName = event.nickName
  const userMap = db.collection('user_map')

  const userReadyInfo = await userMap.where({
    nickName: _.eq(nickName)
  })
  .get()

  return userReadyInfo.data[0]

}