// 云函数入口文件
const cloud = require('wx-server-sdk')
const http = require('http')
const https = require('https')
const dayjs = require('dayjs')
const images = require('images')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

	const imgType = event.imgType || 'png' || 'jpg' || 'jpeg' || 'gif' || 'bmp' || 'raw' || 'webp'
	const dataType = event.dataType || 'fileID' || 'base64' || 'url'
	const VImage = event.data || []
	const img = await renderImg(VImage)
	const resContent = await getContentByDataType(img, dataType, imgType)

	return {
		imgType,
		dataType,
		value: resContent
	}
	
}

// 渲染图片
function renderImg (VImage) {
	return VImage.reduce(async (preRomise, curData) => {

		const preResult = await preRomise
		let { width, height, x = 0, y = 0 } = curData
		width = +((+width).toFixed())
		height = +((+height).toFixed())
		x = +((+x).toFixed())
		y = +((+y).toFixed())

		let image = await createImage(curData)
		image = imageResize(image, width, height)

		if (preResult) return drawImg(preResult, image, x, y, width, height)
		else return image

	}, Promise.resolve())
}

// 获取文件内容 base64 或 文件id 或 url
async function getContentByDataType (img, dataType, imgType) {
	const imgName = `${Date.now()}-${Math.random()}.${imgType}`

	const imgBuffer = img.toBuffer(imgType)
	if (dataType === 'base64') return imgBuffer.toString('base64')
	const fileID = await cloudUploadFile(`tmp/${dayjs().format('YYYY-MM-DD')}/${imgName}`, imgBuffer)
	db.collection('tmp-file').add({ data: { time: Date.now(), fileID: fileID } })
	if (dataType === 'fileID') return fileID
	if (dataType === 'url') return await getFileUrlByFileID(fileID)
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

// 根据云存储id 获取图片buffer
async function getCloudBuffer (fileID) {
  return (await cloud.downloadFile({ fileID: fileID })).fileContent
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

// 创建图片
async function createImage (data) {
	if (data.bgc && data.bgc.length) return images(+data.width, +data.height).fill(...data.bgc)
	else if (data.imgId) return images(await getCloudBuffer(data.imgId))
	else if (data.src) return images(await getHttpBuffer(data.src))
	else return  images(+data.width, +data.height)
}

// 图片设置宽高
function imageResize (image, width, height) {
	if (!width && !height) return image
	const size = image.size()
	if (width === size.width && height === size.height) return image
	if (width && height) return image.resize(width, height)
	if (width) return image.width(width)
	if (height) return image.height(height)
}

// 将图片画在  一张图上
function drawImg (baseImg, img, x, y, width, height) {
	if (x >= 0 && y >= 0) return baseImg.draw(img, x, y)
	img = images(img, x < 0 ? Math.abs(x) : 0, y < 0 ? Math.abs(y) : 0, width, height)
	return baseImg.draw(img, x > 0 ? x : 0, y > 0 ? y : 0)
}

