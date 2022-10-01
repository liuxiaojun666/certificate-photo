// 云函数入口文件
const request = require('request')
const cloud = require('wx-server-sdk')
const imgApi = process.env.IMAGE_API

cloud.init()

const db = cloud.database()
// 共享给人像抠图小程序用
// 云函数入口函数
exports.main = async (event, context) => {

    const imgUrl = await new Promise((resolve, reject) => {

        request(imgApi, async function (error, response, body) {
      
            body = JSON.parse(body)
            if (body.code != 200) return reject(body)
    
            const { total } = await db.collection('bg-images').where({ imgurl: body.imgurl }).count()
    
            if (total > 0) return resolve(body.imgurl)
    
            db.collection('bg-images').add({
                data: { imgurl: body.imgurl, create_time: Date.now() }
            })

            resolve(body.imgurl)
        })
    })


  return {
    imgurl: imgUrl,
  }
}