module.exports = function imgSecCheck (tempFilePath) {
  wx.showLoading({ title: '图片安全校验', })
  // 获取图片信息
  return wx.getImageInfo({ src: tempFilePath, })
  // 图片安全校验
  .then(res => {
    return wx.cloud.callFunction({
      name: 'imgSecCheck',
      data: {
        width: res.width,
        height: res.height,
        type: res.type,
        // 上传图片到临时CDN，返回图片地址
        filePath: wx.cloud.CDN({
          type: 'filePath',
          filePath: res.path,
        })
      },
    })
  })
  // 图片安全检测结果处理
  .then((res) => {
    if (res.result.errCode === 0) {
      // Object.assign(pageData, {
      //   originImgPath: res.result.originImgPath,
      //   originImgType: res.result.originImgType,
      // })
      // this.baiduKoutu({
      //   fileID: res.result.fileId,
      //   filePath: res.result.filePath
      // })
      return Promise.resolve(res.result)
    } else if (res.result.errCode === 87014) {
      wx.showToast({ title: '内容可能潜在风险，请重新选择', icon: 'none' })
    } else if (res.result.errCode === -604102) {
      wx.showToast({ title: '超时，再试一下。或换个图试试', icon: 'none', duration: 3000 })
    } else {
      wx.showToast({ title: '又是啥问题呀，请重试' + res.result.errCode, icon: 'none' })
    }
  })
  // 错误处理
  .catch(console.error)
}
