// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 数据库数据发生变化时会自动触发这个云函数

// 云函数入口函数
exports.main = async (event, context) => {

  const [m_meinv, m_fengjing, m_dongman, m_biying, pc_meinv, pc_fengjing, pc_dongman, pc_biying] = await Promise.all([
    getTotal('meinv', 'm'),
    getTotal('fengjing', 'm'),
    getTotal('dongman', 'm'),
    getTotal('biying', 'm'),
    getTotal('meinv', 'pc'),
    getTotal('fengjing', 'pc'),
    getTotal('dongman', 'pc'),
    getTotal('biying', 'pc'),
  ])

  await db.collection('global-config')
  .doc('e936e40c633acad300608f043f5b6ec8')
  .update({
    data: {
      m_meinv, m_fengjing, m_dongman, m_biying, pc_meinv, pc_fengjing, pc_dongman, pc_biying
    }
  })

  return {
    m_meinv, m_fengjing, m_dongman, m_biying, pc_meinv, pc_fengjing, pc_dongman, pc_biying
  }
}

async function getTotal (category, type) {
  const { total } = await db.collection('images').where({
    category,
    type
  }).count()
  return total
}
