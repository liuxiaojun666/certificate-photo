// miniprogram/pages/album/album.js
// const openid = getApp().globalData.openid
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		photoList: [],
		openid: getApp().globalData.openid,
		showModule: false,
		fileid: '',
		id: ''
	},

	previewImage(event) {
		wx.previewImage({
			urls: this.data.photoList.map(v => v.fileID),
			current: event.currentTarget.dataset.url // 当前显示图片的http链接      
		})
	},

	// 删除照片
	deletePhotoConfrim (event) {
		const {fileid, id} = event.target.dataset
		this.setData({
			showModule: true,
			fileid,
			id
		})
		// const db = wx.cloud.database()
		// wx.showLoading({title: '正在删除...'})
		// db.collection('user_photo').doc(id).remove()
		// .then(res => {
		// 	this.getList()
		// 	wx.cloud.deleteFile({ fileList: [fileid] })
		// })
	},

	hideModal (event) {
		this.setData({ showModule: false })
		if (!event.target.dataset.confirm) return
		const {id, fileid} = this.data
		const db = wx.cloud.database()
		wx.showLoading({title: '正在删除...'})
		db.collection('user_photo').doc(id).remove()
		.then(res => {
			this.getList()
			wx.cloud.deleteFile({ fileList: [fileid] })
		}).catch(() => {
			wx.showToast({ title: '删除失败', icon: 'none' })
		})
	},

	getList () {
		const db = wx.cloud.database()
		wx.showLoading({
			title: '加载中...',
		})
		// 查询当前用户所有的 counters
		db.collection('user_photo').where({
			_openid: this.data.openid
		})
		.orderBy('create_time', 'desc')
		.orderBy('fileID', 'desc')
		.get({
			success: res => {
				this.setData({
					photoList: res.data
					.map(v => ({
						...v, create_time: v.create_time ? new Date(v.create_time).Format('yyyy-MM-dd') : ''
					}))
				})
				wx.hideLoading()
				// console.log('[数据库] [查询记录] 成功: ', res)
			},
			fail: err => {
				wx.showToast({
					icon: 'none',
					title: '查询失败'
				})
				// console.error('[数据库] [查询记录] 失败：', err)
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options, a, b, c) {
		wx.setNavigationBarTitle({ title: '免冠照相册' })
		this.getList()
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
		this.getList()
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