// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数，获取换装的图片地址
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const clothes = {}
  clothes.nan = await getByTag('nan')
  clothes.nv = await getByTag('nv')
  clothes.other = await getByTag('other')

  return {
    event,
    clothes,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

// 查询图片地址
async function getByTag (tag) {
  return (await db.collection('resource-images').where({
    type: 'clothes',
    tag,
  }).get()).data
}
