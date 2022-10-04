// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const tmplId = event.tmplId
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        templateId: tmplId,
        ...getMessageData(tmplId)
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


function getMessageData (tmplId) {
  return {
    // 邀请成功
    'CNuffKDjmxEOU_hM44Cu0KoGqOjfdacpbk4LT1abcnE': {
      page: '/pages/share/share',
      data: {
        number1: { value: 3 },
        number2: { value: 1 }
      }
    },
    // 签到提醒
    'h_P9sODh-NfeXteA5t7h6sS9BAIjtEyppGwt-biQIQ0': {
      page: '/pages/mein/mein',
      data: {
        phrase6: {value: '今日未签到'},
        thing7: { value: '1次免冠照片制作' },
        thing5: { value: '点击立即签到' }
      }
    }
  }[tmplId]
}
