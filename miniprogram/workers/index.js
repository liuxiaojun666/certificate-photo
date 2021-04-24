// 想着用 workers 处理图片颜色，在前端抠图。  根本不行，一下就卡死了

worker.onMessage(function (data) {
  data.data.length = data.length
  const imgData = Array.from(data.data)
  const resultImgDataList = [...imgData]
  for (let i = 3; i < data.length; i += 4) {
    const transparent = imgData[i] === 0
    if (transparent) {
      resultImgDataList[i - 3] = 255
      resultImgDataList[i] = 255
    }
  }
  worker.postMessage({data: resultImgDataList})
})