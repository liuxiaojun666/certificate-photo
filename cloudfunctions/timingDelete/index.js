// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const time = Date.now() - 1000 * 60 * 60

  const _ = db.command
  const tmpFiles = db.collection('tmp-file')
  const { data: list } = await tmpFiles.where({ time: _.lt(time) }).limit(50).get()

  if (!list.length) return { delete: false, list }
  
  const fileList = list.map(v => v.fileID)

  const { fileList: resultList } = await cloud.deleteFile({ fileList })

  await tmpFiles.where({
    fileID: _.in(resultList.filter(file => file.status === 0).map(file => file.fileID))
  }).remove()

  return { delete: true, list: resultList }
}