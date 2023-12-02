// 云函数入口文件
const cloud = require('wx-server-sdk')
const http = require('http')
const https = require('https')
const images = require('images')
const dayjs = require('dayjs')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)

  const checkResult = (await cloud.callFunction({
    name: 'imgSecCheck',
    data: event
  })).result

  if (!checkResult.originImgPath) {
    return checkResult
  }
  
  const { filePath, type = 'jpg'  } = event
  const width = Number(event.width)
  const height = Number(event.height)
  const quality = Number(event.quality) || 100
  if (!filePath) return { errMsg: '图片地址不能为空' }
  if (!width && !height) return { errMsg: '图片尺寸不能为空' }
  const imgType = 'jpg' // 只考虑jpg格式
  const img = images(await getHttpBuffer(filePath))
  if (width) img.width(width)
  if (height) img.height(height)
  const imgBuffer = img.encode('jpg', { quality: quality })
  const imgName = `imagemin-${Date.now()}-${Math.random()}.${imgType}`
	const fileID = await cloudUploadFile(`tmp/${dayjs().format('YYYY-MM-DD')}/${imgName}`, imgBuffer)
	await db.collection('tmp-file').add({ data: { time: Date.now(), fileID: fileID } })
	return await getFileUrlByFileID(fileID)
}

// 根据http地址获取图片 buffer
function getHttpBuffer (src) {
	const protocol = src.split('://')[0]
	return new Promise((resolve, reject) => {
		;({ http, https }[protocol]).get(src, res => {
			if (res.statusCode !== 200) return reject(new Error('图片加载失败'))
			const rawData = []
			res.setEncoding('binary')
			res.on('data', chunk => rawData.push(chunk))
			res.on('end', () => resolve(Buffer.from(rawData.join(''), 'binary')))
		})
	})
}

// 获取文件的临时访问url
async function getFileUrlByFileID (fileID) {
	return (await cloud.getTempFileURL({
    fileList: [fileID]
	})).fileList[0].tempFileURL
}

// 上传图片到云存储，返回图片id
async function cloudUploadFile (cloudPath, fileContent) {
	return (await cloud.uploadFile({ cloudPath, fileContent })).fileID
}
