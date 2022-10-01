// 云函数入口文件
const cloud = require('wx-server-sdk')

const photoList = require('./imgList')

// 共享给人像抠图小程序用

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()

    const photoIndex = event.index || Math.floor(Math.random() * photoList.length)
    
    const imgSrc = await getFileUrlByFileID(photoList[photoIndex])

	return {
		event,
		result: {
			length: photoList.length,
			photoId: imgSrc,
			photoIndex,
		},
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	}
}


// 获取文件的临时访问url
async function getFileUrlByFileID (fileID) {
	return (await cloud.getTempFileURL({ fileList: [fileID] })).fileList[0].tempFileURL
}