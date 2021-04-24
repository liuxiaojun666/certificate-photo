// 云函数入口文件
const cloud = require('wx-server-sdk')
const http = require('http')
const https = require('https')
const dayjs = require('dayjs')
const AipBodyAnalysisClient = require("baidu-aip-sdk").bodyanalysis;

// 设置APPID/AK/SK
const APP_ID = process.env.APP_ID;
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipBodyAnalysisClient(APP_ID, API_KEY, SECRET_KEY);

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	db.collection('tmp-file').add({ data: { time: Date.now(), fileID: event.fileID } })

	// 获取图片url地址
	const tempFileURL = await getFileUrlByFileID(event.fileID)
	// 云存储图片处理地址  返回这个地址，   精细抠图可能还会用
	const tmpOriginImgSrc = encodeURI(`${tempFileURL}?imageMogr2/thumbnail/1500x1500|imageMogr2/format/jpg`)
	// 获取图片buffer
	const imgBuffer = await getHttpBuffer(tmpOriginImgSrc)
	// 图片的base64
	const imageBase64 = encodeURI(imgBuffer.toString('base64'))
	// 百度抠图结果
	const { foreground, error_code, error_msg } = (await client.bodySeg(imageBase64, { type: 'foreground' }))
	if (error_code) return { msg: error_msg }
	if (!foreground) return { foreground, error_code, error_msg }

	const resultFileId = await uploadBase64(foreground)
	db.collection('tmp-file').add({ data: { time: Date.now(), fileID: resultFileId } })


	return {
		tmpOriginImgSrc,
		baiduKoutuResultFileId: resultFileId
	}
}

// 获取文件的临时访问url
async function getFileUrlByFileID (fileID) {
	return (await cloud.getTempFileURL({
    fileList: [fileID]
	})).fileList[0].tempFileURL
}

// 根据http地址获取图片 buffer
function getHttpBuffer (src) {
	const protocol = src.split('://')[0]
	return new Promise((resolve, reject) => {
		;({ http, https }[protocol]).get(src, res => {
			if (res.statusCode !== 200) return reject(new Error('图片加载失败'))
			let rawData = ''
			res.setEncoding('binary')
			res.on('data', chunk => (rawData += chunk))
			res.on('end', () => resolve(Buffer.from(rawData, 'binary')))
		})
	})
}

// base64 转为图片，存入云存储， 返回文件id
async function uploadBase64 (base64) {
	// base64 转为buffer
	const buffer = Buffer.from(base64, 'base64')
	// 临时文件名
	const temFileName = `${Date.now()}-${Math.random()}.png`
	// 将图片上传到云存储，并拿到文件id
	return  await cloudUploadFile(`tmp/${dayjs().format('YYYY-MM-DD')}/${temFileName}`, buffer)

}

// 上传图片到云存储，返回图片id
async function cloudUploadFile (cloudPath, fileContent) {
	return (await cloud.uploadFile({ cloudPath, fileContent })).fileID
}