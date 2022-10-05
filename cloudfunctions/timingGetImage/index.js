// 云函数入口文件
const request = require('request')
const cloud = require('wx-server-sdk')
const imgApi = process.env.IMAGE_API
const meinvImgApi = process.env.MEINV_IMAGE_API

cloud.init()

const db = cloud.database()
// 共享给人像抠图小程序用
// 云函数入口函数
exports.main = async (event, context) => {

  // 获取一张美女图片，不管成功不成功，先存起来
  getMeinvImgUrl()

  // 返回一张风景图
  const imgUrl = await getImgUrl()

  return {
    imgurl: imgUrl,
  }
}

function getImgUrl () {
  return new Promise((resolve, reject) => {

    request(imgApi, async function (error, response, body) {
  
        const data = JSON.parse(body)
        if (data.code != 200) return reject(data)

        try {
          await db.collection('images').doc(data.imgurl).get()
        } catch (error) {
          db.collection('images').add({
            data: {
              _id: data.imgurl,
              imgurl: data.imgurl,
              create_time: Date.now(),
              category: 'fengjing',
              type: 'm'
            }
          })
        }

        const { total } = await db.collection('bg-images').where({ imgurl: data.imgurl }).count()

        if (total > 0) return resolve(data.imgurl)

        db.collection('bg-images').add({
            data: { imgurl: data.imgurl, create_time: Date.now() }
        })

        resolve(data.imgurl)
    })
  })
}

// 获取一张美女图片，存在库里
function getMeinvImgUrl () {
  request(meinvImgApi, async function (error, response, body) {
    const data = JSON.parse(body)
    if (data.code != 200) return reject(data)

    try {
      await db.collection('images').doc(data.imgurl).get()
    } catch (error) {
      db.collection('images').add({
        data: {
          _id: data.imgurl,
          imgurl: data.imgurl,
          create_time: Date.now(),
          category: 'meinv',
          type: 'm'
        }
      })
    }

  })
}