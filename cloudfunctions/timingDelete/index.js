// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数， 定时删除云存储的用户生成的图片
exports.main = async (event, context) => {

  // 一小时前的毫秒数
  const time = Date.now() - 1000 * 60 * 60

  const _ = db.command
  // 连接数据库
  const tmpFiles = db.collection('tmp-file')
  // 查询一小时前上传的图片
  const { data: list } = await tmpFiles.where({ time: _.lt(time) }).limit(50).get()

  // 没查到
  if (!list.length) return { delete: false, list }
  // 找出图片的 fileID
  const fileList = list.map(v => v.fileID)
  // 从云存储中删除图片
  const { fileList: resultList } = await cloud.deleteFile({ fileList })
  // 删除成功的和文件不存在的
  const removedFiles = resultList.filter(file => file.status === 0 || file.status === -503003).map(file => file.fileID)
  // 从数据库中删除记录
  await tmpFiles.where({
    fileID: _.in(removedFiles)
  }).remove()

  return { delete: true, list: resultList }
}