// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const hairs = {}
  hairs.nan = await getByTag('nan')
  hairs.nv = await getByTag('nv')

  return {
    event,
    hairs,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

async function getByTag (tag) {
  return (await db.collection('resource-images').where({
    type: 'hairs',
    tag,
  }).get()).data
}
