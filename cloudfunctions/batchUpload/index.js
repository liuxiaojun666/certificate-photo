// 云函数入口文件
const cloud = require('wx-server-sdk')
const http = require('http')
const https = require('https')

// 上传相馆图片使用

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const fileIdList = []

  await [
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2sl_IaoOO.eBjSZFLXXcxmXXa_!!2456947600.jpg_430x430q90.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2FF0CagOI.eBjSszhXXbHvFXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2oGXyacaK.eBjSspjXXXL.XXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2o1YGakWM.eBjSZFhXXbdWpXa_!!2456947600.jpg_430x430q90.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2YGTJaoOO.eBjSZFLXXcxmXXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2KgaMarVkpuFjSspcXXbSMVXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2x8GLaq8lpuFjy0FpXXaGrpXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB27guKarJkpuFjy1zcXXa5FFXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB24ZOAaJXnpuFjSZFoXXXLcpXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2dMeLaB8lpuFjy0FnXXcZyXXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2JtGCaHBmpuFjSZFAXXaQ0pXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2vKuMarVkpuFjSspcXXbSMVXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2oMGzaJFopuFjSZFHXXbSlXXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2j4GCaNlmpuFjSZPfXXc9iXXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2q6WHawJkpuFjSszcXXXfsFXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB21U9CaOBnpuFjSZFzXXaSrpXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2zn9zaItnpuFjSZFvXXbcTpXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB23ZKMaC0jpuFjy0FlXXc0bpXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2urGQawxlpuFjy0FoXXa.lXXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2WNmKarJkpuFjy1zcXXa5FFXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2qfmIaxXkpuFjy0FiXXbUfFXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2n6WAaNhmpuFjSZFyXXcLdFXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2XnaKarplpuFjSspiXXcdfFXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2LMKKarJkpuFjy1zcXXa5FFXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2eq4vaceJ.eBjy0FiXXXqapXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2n4nCaiGO.eBjSZFpXXb3tFXa_!!2456947600.jpg",
	// "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2dvnHaheK.eBjSZFlXXaywXXa_!!2456947600.jpg",
    // "https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2pvTJaheK.eBjSZFuXXcT4FXa_!!2456947600.jpg",
    
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2brWQawxlpuFjy0FoXXa.lXXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB243KJaB0kpuFjy1zdXXXuUVXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2v39JaB0kpuFjy1zdXXXuUVXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2JSuyaUdnpuFjSZPhXXbChpXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2j8CIarXlpuFjSszfXXcSGXXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB24IVwamKI.eBjy1zcXXXIOpXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2KZ2FaX5N.eBjSZFKXXX_QVXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2Zzq8XLTJXuFjSspeXXapipXa_!!2456947600.jpg_430x430q90.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2qwLJalaM.eBjSZFMXXcypVXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2alPLahaK.eBjSZFAXXczFXXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2HA2Bajm2.eBjSZFtXXX56VXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2_94qab5K.eBjy0FfXXbApVXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2s8Bsam1I.eBjy0FjXXabfXXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2y8htab1K.eBjSszbXXcTHpXa_!!2456947600.jpg_430x430q90.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2BjKHawJkpuFjSszcXXXfsFXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2KzptaheJ.eBjy1zdXXXfmFXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2Y7Rsam1I.eBjy0FjXXabfXXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2FbpCal9J.eBjy0FoXXXyvpXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2OTdsaa9I.eBjy0FeXXXqwFXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2KCfHafSM.eBjSZFNXXbgYpXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2.1qPaCJjpuFjy0FdXXXmoFXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/O1CN01H3yiph260qaKwWZnv_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/O1CN01qW6wsv260qaGc4HXp_!!2456947600.jpg_430x430q90.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/O1CN015RnPdH260qaP3D2NL_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2BugOoY0kpuFjy0FjXXcBbVXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2TmaLaq8lpuFjy0FpXXaGrpXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB25xeCaSFmpuFjSZFrXXayOXXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2cwuLarRkpuFjSspmXXc.9XXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2fJWMarVkpuFjSspcXXbSMVXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2OmqxaOlnpuFjSZFgXXbi7FXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2bMiLarRkpuFjSspmXXc.9XXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/TB2BPSzaJFopuFjSZFHXXbSlXXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/O1CN015SVYFT260qaNFelFL_!!2456947600.jpg_430x430q90.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages20200621/O1CN01VVymyH260qaNNSRhR_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2edPFaXOP.eBjSZFHXXXQnpXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2IJdqab1J.eBjSszcXXbFzVXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2h8YHalyN.eBjSZFgXXXmGXXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2OHzHaduO.eBjSZFCXXXULFXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB216DHamiK.eBjSZFDXXbxZVXa_!!2456947600.jpg_430x430q90.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2lKzIalyN.eBjSZFkXXb8YFXa_!!2456947600.jpg",
	"https://6c69-liuxiaojun-d0d7d7-1259379853.tcb.qcloud.la/bgImages/TB2Inhrag1I.eBjSszeXXc2hpXa_!!2456947600.jpg"
].reduce(async (acc, cur) => {
    await acc
    const fileName = cur.split('/').pop()
    const buffer = await getHttpBuffer(cur)
    const fileId = await cloudUploadFile('xiangguan/' + fileName, buffer)
    fileIdList.push(fileId)
  }, Promise.resolve())

  return {
    fileIdList
  }
}

// 上传图片到云存储，返回图片id
async function cloudUploadFile (cloudPath, fileContent) {
	return (await cloud.uploadFile({ cloudPath, fileContent })).fileID
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