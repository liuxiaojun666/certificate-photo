// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        templateId: 'CNuffKDjmxEOU_hM44Cu0KoGqOjfdacpbk4LT1abcnE',
        page: '/pages/share/share',
        data: {
          number1: {
            value: 3
          },
          number2: {
            value: 1
          }
        }
      })
    return {
      ...result,
      msgid: result.msgid.toString()
    }
  } catch (err) {
    return err
  }
}