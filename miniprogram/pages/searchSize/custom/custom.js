Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		width: '',
		height: '',
		remak: ''
	},

	goNextPage (e) {
		const {width, height, remak} = this.data
		wx.navigateTo({
			url: '/pages/preEdit/preEdit?width=' +width+ '&height=' + height+ '&discription=' + remak,
		})
	},

	widthChange (e) {
		this.setData({
			width: +e.detail.value
		})
	},

	heightChange (e) {
		this.setData({
			height: +e.detail.value
		})
	},

	remakChange (e) {
		this.setData({
			remak: e.detail.value
		})
	},

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
			imageUrl: '/images/shareShow.jpg'
		}
	},
	
  onShareTimeline: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			imageUrl: '/images/shareShow.jpg'
		}
	},

})