// miniprogram/pages/help/help.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	
		// 预览群二维码
		viewGroupQRcode () {
			wx.previewImage({
				urls: ['https://6465-dev-4iov0-1301148496.tcb.qcloud.la/huoma.png?sign=b5b1c9974e9f1b15c37dda226b9585e5&t=1611383826'],
				current: 'https://6465-dev-4iov0-1301148496.tcb.qcloud.la/huoma.png?sign=b5b1c9974e9f1b15c37dda226b9585e5&t=1611383826' // 当前显示图片的http链接      
			})
		},
	
	getNewVersion () {
		const updateManager = wx.getUpdateManager()

		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			if (!res.hasUpdate) {
				wx.showToast({
					title: '已是最新版本',
				})
			} else {
				wx.showLoading({
					title: '正在下载新版本',
				})
			}
		})

		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
	},

	showQrcode2() {
		wx.previewImage({
			urls: ['https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200606104940.jpg?sign=e3dac636b9d352831ef70e77c4ee0621&t=1591411804'],
			current: 'https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200606104940.jpg?sign=e3dac636b9d352831ef70e77c4ee0621&t=1591411804' // 当前显示图片的http链接      
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

	},
	
  onShareTimeline: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			// path: '/pages/index/index',
			imageUrl: '/images/shareShow.jpg'
		}
	},
})