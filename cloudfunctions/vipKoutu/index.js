// 云函数入口文件
const cloud = require('wx-server-sdk')
const https = require('https')
const http = require('http')
const axios = require('axios')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

	// 获取图片buffer
	const imgBuffer = await getHttpBuffer(event.imgSrc)
	// 图片的base64
	const imageBase64 = encodeURI(imgBuffer.toString('base64'))

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