const { canvasDrawImage, canvasToTempFile } = require("./utils");

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
    discription: '',
    originalImagePath: '',
    compressCanvas: {
			display: false,
			width: 0,
			height: 0
		}
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
		wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
			sizeType: ['original', 'compressed'],
			success: (res) => {
        console.log(res)
        this.setData({
          originalImagePath: res.tempFiles[0].tempFilePath
        })
        this.imgSecCheck(res.tempFiles[0].tempFilePath)
			},
			fail () {
				wx.showToast({ title: '取消选择', icon: 'none', duration: 2000 })
			}
		})
  },
  // 图片敏感信息检测   获取图片宽高信息
	imgSecCheck (tempFilePath) {
    wx.showLoading({ title: '图片安全校验', })
    // 获取图片信息
		wx.getImageInfo({ src: tempFilePath, })
    // 图片安全校验
    .then(res => {
      return wx.cloud.callFunction({
        name: 'imgSecCheck',
        data: {
          width: res.width,
          height: res.height,
          type: res.type,
          // 上传图片到临时CDN，返回图片地址
          filePath: wx.cloud.CDN({
            type: 'filePath',
            filePath: res.path,
          })
        },
      })
    })
    // 图片安全检测结果处理
    .then((res) => {
      console.log(res)
      if (res.result.errCode === 0) {
        this.baiduKoutu({
          fileID: res.result.fileId,
          filePath: res.result.filePath
        })
      } else if (res.result.errCode === 87014) {
        wx.showToast({ title: '内容可能潜在风险，请重新选择', icon: 'none' })
      } else if (res.result.errCode === -604102) {
        wx.showToast({ title: '超时，再试一下。或换个图试试', icon: 'none', duration: 3000 })
      } else {
        wx.showToast({ title: '又是啥问题呀，请重试' + res.result.errCode, icon: 'none' })
      }
    })
    // 错误处理
    .catch(console.error)
  },

	// 使用百度抠图
	baiduKoutu (data) {
    wx.showLoading({ title: '智能人像分割', })
		wx.cloud.callFunction({
      name: 'baiduKoutu',
      data: data
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