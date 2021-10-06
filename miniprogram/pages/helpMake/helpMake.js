const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		groupQrcodeUrl: app.globalData.groupQrcodeUrl
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
			urls: [app.globalData.groupQrcodeUrl],
			current: app.globalData.groupQrcodeUrl // 当前显示图片的http链接      
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
		return {
			title: '点这个帮我做张免冠照片吧。谢谢！',
			path: '/pages/index/index',
			imageUrl: '/images/shareShow.jpg'
		}
	},
	
  onShareTimeline: function () {
		return {
			title: '谁帮我制作个免冠照？点这个，谢谢。',
			// path: '/pages/index/index',
			imageUrl: '/images/shareShow.jpg'
		}
	},
})