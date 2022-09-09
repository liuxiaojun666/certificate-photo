// 云函数入口文件
const cloud = require('wx-server-sdk')
const https = require('https')
const http = require('http')
const axios = require('axios')
const dayjs = require('dayjs')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  // 获取图片buffer
  let targetBuffer = await getHttpBuffer(event.imgSrc)
  // 需要将图片转成jpg格式
  if (event.imgType && !['png', 'jpg', 'jpeg'].includes(event.imgType)) {
    targetBuffer = await transformImageBuffer(targetBuffer, event.imgType)
  }
  const imageBase64 = encodeURI(targetBuffer.toString('base64'))

	return (await axios.post('https://aliapi.aisegment.com/segment/matting', {
		type: 'jpg',
		photo: imageBase64
	}, {
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'Authorization': 'APPCODE ' + process.env.APPCODE
		}
	})).data
}

// 用buffer转图片格式，得到转换后的buffer
async function transformImageBuffer (imgBuffer, imgType) {
  const imgName = `${Date.now()}-${Math.random()}.${imgType}`
  const fileID = await cloudUploadFile(`tmp/${dayjs().format('YYYY-MM-DD')}/${imgName}`, imgBuffer)
  db.collection('tmp-file').add({ data: { time: Date.now(), fileID: fileID } })
  const tempFileURL = await getFileUrlByFileID(fileID)
  filePath = encodeURI(`${tempFileURL}?imageMogr2/thumbnail/1500x1500|imageMogr2/format/jpg`)
  return await getHttpBuffer(filePath)
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

// 上传图片到云存储，返回图片id
async function cloudUploadFile (cloudPath, fileContent) {
	return (await cloud.uploadFile({ cloudPath, fileContent })).fileID
}

// 获取文件的临时访问url
async function getFileUrlByFileID (fileID) {
	return (await cloud.getTempFileURL({
    fileList: [fileID]
	})).fileList[0].tempFileURL
}
