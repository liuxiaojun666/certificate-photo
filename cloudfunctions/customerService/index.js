// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()

	await sendText(wxContext)
	
	await sendLink(wxContext)

	await sendGithubLink(wxContext)

	await sendImg(wxContext)

	return 'success'
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
	const videoSrc = 'https://mp.weixin.qq.com/s?t=pages/video_detail_new&scene=1&vid=wxv_1528494884356210689&__biz=Mzk0MjEyMjgxNg==&mid=2247483667&idx=1&sn=d3215c5ca2cbf22b4edc910d9b106fdc&vidsn=#wechat_redirect'
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

// 发送github仓库地址
async function sendGithubLink (wxContext) {
	await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
		msgtype: 'link',
		link: {
			title: '免冠照片项目开源',
			description: '免冠照片Github仓库地址，欢迎Star。',
			url: 'https://github.com/liuxiaojun666/ID-Photo-miniapp-wechart',
			thumbUrl: 'https://camo.githubusercontent.com/7d41c5288122573f7d79b2349af63cc320c1a0a196fc7971a3499da9e5c9e54b/68747470733a2f2f302e67726176617461722e636f6d2f6176617461722f31393338306465666364326534356337353061373433373333626339653438663f643d68747470732533412532462532466769746875622e6769746875626173736574732e636f6d253246696d6167657325324667726176617461727325324667726176617461722d757365722d3432302e706e6726723d6726733d313430'
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
			value: await getCloudBuffer('cloud://dev-4iov0.6465-dev-4iov0-1301148496/mein-wechart-qrcode.png') // 我的二维码
			// value: await getCloudBuffer('cloud://dev-4iov0.6465-dev-4iov0-1301148496/huoma.jpg') // 群活码
			// value: await getCloudBuffer('cloud://dev-4iov0.6465-dev-4iov0-1301148496/huoma.png') // 群活码
			// value: await getCloudBuffer('cloud://dev-4iov0.6465-dev-4iov0-1301148496/微信图片_20200606104940.jpg') // 作者二维码
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