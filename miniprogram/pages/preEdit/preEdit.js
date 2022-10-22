const app = getApp()

// 非响应式数据
const pageData = {
  photoSizeList: app.globalData.photoSizeList,
  width: '',
  height: '',
  originTempFilePath: '',
  originImgPath: '',
  originImgType: '',
  compressImagePath: ''
}

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		px: '',
		size: '自定义',
		photoName: '自定义尺寸',
    discription: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const {index,width,height,data} = options
		if (width && height) {
      this.setData({px: width + ' * ' + height + '像素'});
      Object.assign(pageData, { width: +width, height: +height })
		}else if(data){
			let newData = JSON.parse(data);
			this.setData({ 
				px:newData.width_px+" * "+newData.height_px + " 像素", 
				size:newData.width_mm+" × "+newData.height_mm + " mm", 
				photoName: "基本信息", 
				discription: newData.name 
      });
      Object.assign(pageData, { width:+newData.width_px, height:+newData.height_px,  })
		}else{
			const {width, height, px, size, name, discription} = pageData.photoSizeList[index];
      this.setData({ px, size, photoName: name, discription: discription });
      Object.assign(pageData, { width, height })
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
			sizeType: ['compressed'],
			success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        Object.assign(pageData, {originTempFilePath: tempFilePath})
        this.imgSecCheck(tempFilePath)
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
      if (res.result.errCode === 0) {
        Object.assign(pageData, {
          originImgPath: res.result.originImgPath,
          originImgType: res.result.originImgType,
          compressImagePath: res.result.filePath
        })
        this.baiduKoutu({
          fileID: res.result.fileId,
          filePath: res.result.filePath
        })
      } else if (res.result.errCode === 87014) {
        wx.showToast({ title: '内容可能潜在风险，请重新选择', icon: 'none' })
      } else if (res.result.errCode === -604102) {
        wx.showToast({ title: '超时，再试一下。或换个图试试', icon: 'none', duration: 3000 })
      } else {
        wx.showToast({ title: '又是啥问题呀，请换图重试', icon: 'none', duration: 3000 })
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
		const { width, height, originImgPath, originImgType, originTempFilePath, compressImagePath } = pageData
		wx.navigateTo({
			url: '/pages/editPhoto/editPhotoPlus/editPhotoPlus',
			success: function (res) {
				res.eventChannel.emit('acceptDataFromOpenerPage', {
          ...data,
          originTempFilePath,
          originImgPath,
          originImgType,
          compressImagePath,
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
			imageUrl: '/shareShow.jpg'
		}
	}
})