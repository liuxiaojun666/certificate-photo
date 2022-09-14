// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()

	if (event.Content.indexOf('赞赏') > -1) {
		return await cloud.callFunction({ name: 'sendAppreciateQRCode', data: { wxContext } })
	}

	// await sendText(wxContext)
	
	await sendLink(wxContext)
	
	await sendImg(wxContext)

	return {
		event
	}
}

// 发送文字消息
function sendText (wxContext) {
	return cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: { content: '您好, 点击下方查看 证件照制作教程。 如有其他问题，请扫描下方二维码添加微信交流群（领次数、帮制作、人工定制等）。', },
	})
}

// 发送视频教程连接
async function sendLink (wxContext) {
	const videoSrc = 'https://mp.weixin.qq.com/s/tUKESPrY3-LIiizw3Ho2tQ'
	await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
		msgtype: 'link',
		link: {
			title: '证件照、免冠照制作教程',
			description: '一寸、二寸证件照、免冠照，制作教程',
			url: videoSrc,
			thumbUrl: await getFileUrlByFileID('cloud://dev-4iov0.6465-dev-4iov0-1301148496/微信图片_20210109164906.jpg')
		}
	})
}

// 发送图片 作者二维码
async function sendImg (wxContext) {
	
	// 上传图片素材  我的二维码
	const { mediaId } = await cloud.openapi.customerServiceMessage.uploadTempMedia({
		type: 'image',
		media: {
			contentType: 'image/jpg',
			value: await getCloudBuffer('cloud://dev-4iov0.6465-dev-4iov0-1301148496/WechatIMG199.jpeg')
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
	
}

// 根据云存储id 获取图片buffer
async function getCloudBuffer (fileID) {
  return (await cloud.downloadFile({ fileID: fileID })).fileContent
}

// 获取文件的临时访问url
async function getFileUrlByFileID (fileID) {
	return (await cloud.getTempFileURL({
    fileList: [fileID]
	})).fileList[0].tempFileURL
}