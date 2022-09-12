
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		msg: '',
		tempFilePath: '',
		url: ''
	},

  // 继续制作，返回到选择照片页面
	contineu () {
		wx.navigateBack()
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			msg: options.msg,
			tempFilePath: options.tempFilePath,
			url: options.url
    })
    
    wx.showToast({ title: '制作成功', })
	},

  // 预览制作出来的照片
	preView () {
		wx.previewImage({
			urls: [this.data.url],
			current: this.data.url
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、自定义尺寸、证件照换背景，免费生成、下载。',
			path: '/pages/index/index',
			imageUrl: this.data.tempFilePath
		}
	}
})