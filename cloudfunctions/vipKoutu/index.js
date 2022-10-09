// 云函数入口文件
const cloud = require('wx-server-sdk')
const https = require('https')
const http = require('http')
const axios = require('axios')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let type = event.imgType
  // 获取图片buffer
  let targetBuffer = await getHttpBuffer(event.imgSrc)
  // buffer转成base64
  let imageBase64 = encodeURI(targetBuffer.toString('base64'))
  // 抠图接口调用
  const result = await koutu(type, imageBase64)
  // 抠图成功
  if (result.status === 0) return result

  // 没有压缩图
  if (!event.compressSrc) return result

  // 使用压缩图抠图
  targetBuffer = await getHttpBuffer(event.compressSrc)
  imageBase64 = encodeURI(targetBuffer.toString('base64'))
	return await koutu('jpg', imageBase64)
}

async function koutu (type, imageBase64) {
  return (await axios.post('https://aliapi.aisegment.com/segment/matting', {
		type: type,
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

