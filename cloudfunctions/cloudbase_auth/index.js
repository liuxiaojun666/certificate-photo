// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  console.log(event)
  console.log(wxContext)
  // 跨账号调用时，由此拿到来源方小程序/公众号 AppID
  console.log(wxContext.FROM_APPID)
  // 跨账号调用时，由此拿到来源方小程序/公众号的用户 OpenID
  console.log(wxContext.FROM_OPENID)
  // 跨账号调用、且满足 unionid 获取条件时，由此拿到同主体下的用户 UnionID
  console.log(wxContext.FROM_UNIONID)

  return {
    errCode: 0,
    errMsg: '',
    auth: JSON.stringify({})
  }
}