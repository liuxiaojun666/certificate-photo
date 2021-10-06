const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupQrcodeUrl: app.globalData.groupQrcodeUrl
  },

  chooseImage (event) {
    if (wx.getAccountInfoSync().miniProgram.envVersion === 'release') return
		// wx.showLoading({title: '选择照片'})
		wx.chooseImage({
			count: 1,
			sizeType: 'original',
			success: (res) => {
				this.imgUpload(res.tempFilePaths[0])
			},
			fail () {
				wx.showToast({ title: '取消选择', icon: 'none', duration: 2000 })
			}
		})
	},

  imgUpload (filePath) {
		console.log(filePath)
		wx.showLoading({ title: '上传中', })

		wx.cloud.uploadFile({
			cloudPath: `group-qrcode/qrcode.jpg`,
			filePath
		})
		.then(res => {
			wx.showToast({
        title: '成功',
      })
		})
		.catch(error => {
			console.log(error)
			wx.showToast({ title: '失败,请重试', icon: 'loading' })
		})
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})