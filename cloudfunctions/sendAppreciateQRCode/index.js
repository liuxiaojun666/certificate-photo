// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 上传图片素材
	const { mediaId } = await cloud.openapi.customerServiceMessage.uploadTempMedia({
		type: 'image',
		media: {
			contentType: 'image/jpg',
			value: await getCloudBuffer('cloud://dev-4iov0.6465-dev-4iov0-1301148496/微信图片_20200327222252.jpg') // 赞赏码
		}
	})

	// 发送图片消息
	await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
		msgtype: 'image',
		image: {
			mediaId: mediaId
		}
	})

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

// 根据云存储id 获取图片buffer
async function getCloudBuffer (fileID) {
  return (await cloud.downloadFile({ fileID: fileID })).fileContent
}
