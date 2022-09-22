// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const tmplId = 'CNuffKDjmxEOU_hM44Cu0KoGqOjfdacpbk4LT1abcnE'
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        templateId: tmplId,
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
      // 删除订阅记录
      if (result.errCode === 0) {
        await db.collection('subscrib-message').where({
          openid: event.openid,
          tmplId: tmplId
        }).remove()
      }
    return {
      ...result,
      msgid: result.msgid.toString()
    }
  } catch (err) {
    return err
  }
}