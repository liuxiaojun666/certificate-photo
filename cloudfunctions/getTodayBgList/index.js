// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 人像抠图共享小程序用

// 云函数入口函数
exports.main = async (event, context) => {

    const bgDataInfo = await db
        .collection('global-config')
        .doc('803723f46336f9d70058cdda67e1a3d8')
        .get()

    const { data } = await db.collection('bg-images')
        .orderBy('create_time', 'asc')
        .skip(bgDataInfo.data.bgListIndex)
        .limit(4)
        .get()

    return {
        bgList: data,
    }
}