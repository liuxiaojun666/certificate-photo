// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 共享给人像抠图小程序用

// 云函数入口函数
exports.main = async (event, context) => {

  const { total } = await db.collection('bg-images').where({}).count()

  const { data } = await db
    .collection('global-config')
    .doc('803723f46336f9d70058cdda67e1a3d8')
    .get()

    let index = data.bgListIndex + 4
    if (index >= total) {
        index = 0
    }

    await db
    .collection('global-config')
    .doc('803723f46336f9d70058cdda67e1a3d8')
    .update({
        data: {
            bgListIndex: index
        }
    })

  return {
    event,
  }
}