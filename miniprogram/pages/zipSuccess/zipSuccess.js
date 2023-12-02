// pages/zipSuccess/zipSuccess.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options)  {
    const {imgurl} = options
    this.setData({ imageSrc:imgurl })
    const { tempFilePath, dataLength } = await this.downloadImg(imgurl)
    const size = (dataLength / 1024).toFixed(2)
    this.setData({ size: size })
  },

    // 将远端图片，下载到本地
    downloadImg(url) {
      return new Promise((resolve, reject) => {
          wx.downloadFile({
              url,
              success(res) {
                  if (res.statusCode === 200) {
                      resolve(res)
                  } else {
                      reject(res)
                  }
              },
              fail(error) {
                  reject(error)
              }
          })
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  preView (event) {
		wx.previewImage({
			urls: [this.data.imageSrc],
			current: this.data.imageSrc
		})
	},
  // 下载
downloadClick(){
  if (!this.data.imageSrc) {
    wx.showToast({
      title: '请上传图片',
      icon: 'none',
      duration: 3000
    })
  }else{
    console.log(this.data.imageSrc);
    var url = this.data.imageSrc;
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 3000
            })
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }, 3000)
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res){
            console.log(res);
          }
        })
      }
    })
  }
  
}
})