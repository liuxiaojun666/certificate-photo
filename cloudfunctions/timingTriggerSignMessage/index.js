// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const tmplId = 'h_P9sODh-NfeXteA5t7h6sS9BAIjtEyppGwt-biQIQ0'

// 云函数入口函数
exports.main = async (event, context) => {

  const res = await db.collection('subscrib-message').where({ tmplId }).get()

  res.data.forEach(item => getSignStatus(item.openid))

  return res
}

// 获取前端状态
async function getSignStatus (openid) {
  const { data } = await db.collection('user').where({ openid }).get()
  if (data[0].signInDate === new Date().toDateString()) return
  trigger(openid)
}

// 触发消息
function trigger (openid) {
  cloud.callFunction({
    name: 'triggerSubscrib',
    data: {
      openid,
      tmplId
    }
  })
}
