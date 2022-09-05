const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		photoSizeList: app.globalData.photoSizeList,
		width: '',
		height: '',
		px: '',
		size: '自定义',
		photoName: '自定义尺寸',
		discription: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const {index,width,height,discription,data} = options
		if (width && height) {
			this.setData({px: width + ' * ' + height + '像素', width: +width, height: +height});
		}else if(data){
			let newData = JSON.parse(data);
			console.log("数据------"+newData.width_px);
			this.setData({ 
				width:+newData.width_px, 
				height:+newData.height_px, 
				px:newData.width_px+" * "+newData.height_px + " 像素", 
				size:newData.width_mm+" × "+newData.height_mm + " mm", 
				photoName: "基本信息", 
				discription: newData.name 
			});
		}else{
			const {width, height, px, size, name, discription} = this.data.photoSizeList[index];
			this.setData({ width, height, px, size, photoName: name, discription: discription });
		}
	},

		/**
	 * 选择照片
	 */
	chooseImage (event) {
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
	// 上传原图， 后使用百度抠图
	imgUpload (filePath) {
		console.log(filePath)
		wx.showLoading({ title: '智能人像抠图', })

		wx.cloud.uploadFile({
			cloudPath: `tmp/${new Date().Format('yyyy-MM-dd')}/${filePath.split('://')[1]}`,
			filePath
		})
		.then(res => {
			this.baiduKoutu(res.fileID)
		})
		.catch(error => {
			console.log(error)
			wx.showToast({ title: '失败,请重试', icon: 'loading' })
		})
	},

	// 使用百度抠图
	baiduKoutu (fileID) {
		wx.cloud.callFunction({
      name: 'baiduKoutu',
      data: { fileID }
		})
		.then(({ result }) => {
			this.goEditPage(result)
		}).catch((error) => {
			console.log(error)
			wx.showToast({ 	title: '失败，请重试' })
		})
	},

		/**
	 * 去编辑页面
	 */
	goEditPage (data) {
		wx.hideLoading()
		const { width, height } = this.data
		console.log(width,"---",height)
		let msg = width + "--" + height
		wx.showToast({
			title: msg,
		})
		wx.navigateTo({
			url: '/pages/editPhoto/editPhotoPlus/editPhotoPlus',
			success: function (res) {
				res.eventChannel.emit('acceptDataFromOpenerPage', {
					...data,
					width,
					height
				})
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、自定义尺寸、证件照换背景，免费生成、下载。',
			imageUrl: '/images/shareShow.jpg'
		}
	}
})