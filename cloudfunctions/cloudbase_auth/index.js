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
    auth: JSON.stringify({
      // 自定义安全规则
      // 在前端访问资源方数据库、云函数等资源时，资源方可以通过
      // 安全规则的 `auth.custom` 字段获取此对象的内容做校验，
      // 像这个示例就是资源方可以在安全规则中通过 `auth.custom.x` 获取
      x: 1,
    }),
}