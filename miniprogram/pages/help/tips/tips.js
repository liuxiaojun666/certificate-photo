// miniprogram/pages/help/tips/tips.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	copy () {
		wx.setClipboardData({
			data: '1297768249',
			success (res) {
				
			}
		})
	},

	
		// 预览群二维码
		viewGroupQRcode () {
			wx.previewImage({
				urls: ['https://6465-dev-4iov0-1301148496.tcb.qcloud.la/huoma.png?sign=b5b1c9974e9f1b15c37dda226b9585e5&t=1611383826'],
				current: 'https://6465-dev-4iov0-1301148496.tcb.qcloud.la/huoma.png?sign=b5b1c9974e9f1b15c37dda226b9585e5&t=1611383826' // 当前显示图片的http链接      
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