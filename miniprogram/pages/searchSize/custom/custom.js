Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		width: '',
		height: '',
	},

  // 跳转到下一页
	goNextPage (e) {
		const {width, height} = this.data
		wx.navigateTo({
			url: '/pages/preEdit/preEdit?width=' +width+ '&height=' + height+ '&discription='
		})
	},

  // 宽度改变
	widthChange (e) {
		this.setData({
			width: +e.detail.value
		})
	},

  // 高度改变
	heightChange (e) {
		this.setData({
			height: +e.detail.value
		})
	},

  // 点击确定，校验用户输入
	selectPhoto () {
		const {width, height} = this.data
		let msg = ''
		if (width < 100 || height < 100) {
			msg = '最小边不能小于100像素'
		}
		if (width > 2000 || height > 2000) {
			msg = '最大边不能大于2000像素'
		}
		if (msg) {
			return wx.showToast({
				title: msg,
				icon: 'none'
			})
		} else {
			this.goNextPage()
		}
	},

	onShareAppMessage () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、自定义尺寸、证件照换背景，免费生成、下载。',
			path: '/pages/index/index',
			imageUrl: '/shareShow.jpg'
		}
	},
	
  onShareTimeline: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			imageUrl: '/shareShow.jpg'
		}
	},

})