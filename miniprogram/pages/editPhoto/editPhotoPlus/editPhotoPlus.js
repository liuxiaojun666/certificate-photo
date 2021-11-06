const hexRgb = require('./hex-rgb')

const { photoSizeList } = getApp().globalData;
const sizeNameList = photoSizeList.map(v => v.name)
let canOnePointMove = false
let onePoint = {
	x: 0,
	y: 0
}
let twoPoint = {
	x1: 0,
	y1: 0,
	x2: 0,
	y2: 0
}
// 在页面中定义激励视频广告
let videoAd = null
// 在页面中定义插屏广告
let interstitialAd = null
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabIndex: 0,
		videoLoaded: false,
		targetWidth: '',
		targetHeight: '',
		showScale: 1,
		count: 0, // 用户剩余次数
		vipCount: 0,
		tmpOriginImgSrc: '',
		filePath: '',
		filePath2: '',
		canvasFilePath: '',
		sourceImageData: null,
		guided: '',
		guideStep: 1,
		hideDownloadBtn: false,
		downloadSuccess: false,
		uploadSuccess: false,
		bgc: '#ffffff',
		photoBg: '#ffffff',
		showColorPicker: false,
		colorData: {
			//基础色相，即左侧色盘右上顶点的颜色，由右侧的色相条控制
			hueData: {
				colorStopRed: 255,
				colorStopGreen: 0,
				colorStopBlue: 0,
			},
			//选择点的信息（左侧色盘上的小圆点，即你选择的颜色）
			pickerData: {
				x: 0, //选择点x轴偏移量
				y: 480, //选择点y轴偏移量
				red: 0,
				green: 0,
				blue: 0,
				hex: '#000000'
			},
			//色相控制条的位置
			barY: 0
		},
		rpxRatio: 1, //此值为你的屏幕CSS像素宽度/750，单位rpx实际像素
		array: sizeNameList,
		photoSizeList: photoSizeList,
		objectArray: photoSizeList,
		index: 0,
		photoDescription: '',
		kb: '',
		person_num: 1,
		attributes: {},
		initImgWidth: 0,
		initImgHeight: 0,
		originImgWidth: 0,
		originImgHeight: 0,
		width: 0,
		height: 0,
		left: 0,
		top: 0,
		scale: 1,
		rotate: 0,
		clothes: {
			show: false,
			src: '',
			initImgWidth: 0,
			initImgHeight: 0,
			originImgWidth: 0,
			originImgHeight: 0,
			width: 0,
			height: 0,
			left: 0,
			top: 0,
			scale: 1,
			rotate: 0,
		},
		hair: {
			show: false,
			src: '',
			initImgWidth: 0,
			initImgHeight: 0,
			originImgWidth: 0,
			originImgHeight: 0,
			width: 0,
			height: 0,
			left: 0,
			top: 0,
			scale: 1,
			rotate: 0,
		}
	},

	// 切换普通抠图 、精细抠图
	changeTab (event) {
		if (!this.data.guided) return
		this.setData({
			tabIndex: +event.currentTarget.dataset.index
		})
	},

	// 尺寸改变
	bindPickerChange(e) {
		this.setData({ index: e.detail.value })
	},

	//选择改色时触发（在左侧色盘触摸或者切换右侧色相条）
	onChangeColor(e) {
		//返回的信息在e.detail.colorData中
		this.setData({
			colorData: e.detail.colorData,
			photoBg: e.detail.colorData.pickerData.hex
		})
	},

	// 切换背景
	toggleBg(e) {
		const bgc = e.currentTarget.dataset.color;
		const showColorPicker = bgc === 'custom';
		const photoBg = showColorPicker ? this.data.colorData.pickerData.hex : {
			red: '#ff0000',
			blue: '#438edb',
			blue2: '#00bff3',
			white: '#ffffff',
			transparent: 'transparent'
		}[bgc]
		this.setData({
			bgc,
			showColorPicker,
			photoBg
		})
	},

	//关闭拾色器
	closeColorPicker() {
		this.setData({ showColorPicker: false })
	},

	// 图片合成
	async composeImage () {
		wx.showLoading({ title: '制作中...', })
		const { photoBg, targetWidth, targetHeight, tabIndex, filePath, filePath2, clothes, hair } = this.data

		// 将颜色转为 rgba值
		const bgc = hexRgb(photoBg, { format: 'array' })
		// 底图
		const baseImg = { bgc, width: targetWidth, height: targetHeight }
		// 人像图片vip src
		const vipSrc = (tabIndex === 1 && filePath2)
		// 人像图
		const peopleImg = { imgId: vipSrc ? null : filePath, src: vipSrc, ...this.computedXY(baseImg, this.data) }
		// 发饰图
		const hairImg = { src: hair.src, ...this.computedXY(baseImg, hair) }
		// 衣服图
		const clothesImg = { src: clothes.src, ...this.computedXY(baseImg, clothes) }
		// 组合图片顺序
		const data = [baseImg, peopleImg, hairImg, clothesImg]
		// 合成图片 返回url
		const { result } = await wx.cloud.callFunction({
      name: 'imageCompose',
      data: { imgType: 'jpg', dataType: 'url', data }
		})

		this.downloadAndToComplate(result.value, vipSrc)

	},

	// 下载并跳转
	async downloadAndToComplate (url, isVip) {
		let msg = ''
		try {
			// 下载图片到本地
			const { tempFilePath, dataLength } = await this.downloadImg(url)
			const { targetWidth, targetHeight } = this.data
			const size = (dataLength / 1024).toFixed(2)
			msg = `图片像素${targetWidth + ' * ' + targetHeight}，图片大小${size}kb`

			// 保存图片到相册
			await this.saveImage(tempFilePath, isVip)

			wx.redirectTo({ url: '../complete/complete?msg=' + msg + '&tempFilePath=' + tempFilePath + '&url=' + url, })

		} catch (error) {
			console.log(error)
			msg = '下载失败，点击下图预览保存图片。'
			wx.redirectTo({ url: '../complete/complete?msg=' + msg + '&tempFilePath=' + url + '&url=' + url, })
		}
	},

	// 计算相对底图的 x ， y
	computedXY (baseImg, imgData) {
		const left = (imgData.left - imgData.initImgWidth / 2)
		const top = (imgData.top - imgData.initImgHeight / 2)
		const noScaleImgHeight = baseImg.width * imgData.initImgHeight / imgData.initImgWidth
		const resultImgWidth = baseImg.width * imgData.scale
		const resultImgHeight = noScaleImgHeight * imgData.scale
		const scaleChangeWidth = (resultImgWidth / 2 - baseImg.width / 2)
		const scaleChangeHeight = (resultImgHeight / 2 - noScaleImgHeight / 2)
		const x = left - scaleChangeWidth
		const y = top - scaleChangeHeight
		return { x, y, width: resultImgWidth, height: resultImgHeight }
	},

	// 将远端图片，下载到本地
	downloadImg (url) {
		return new Promise((resolve, reject) => {
			wx.downloadFile({
				url, //仅为示例，并非真实的资源
				success (res) {
					// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
					if (res.statusCode === 200) {
						console.log(res)
						resolve(res)
					} else {
						reject(res)
					}
				},
				fail (error) {
					reject(error)
				}
			})
		})
	},

	// 保存图片到相册
	saveImage(tempFilePath, isVip) {
		return new Promise((resolve, reject) => {
			wx.saveImageToPhotosAlbum({
				filePath: tempFilePath,
				success: () => {
					this.setData({ downloadSuccess: true })
					wx.showToast({ title: '下载成功' })
					if (!isVip) this.useCount()
					resolve()
				},
				fail(res) {
					wx.getSetting({
						success(res) {
							if (res.authSetting['scope.writePhotosAlbum']) {
								wx.showToast({ title: '下载失败，点击帮助', icon: 'none' })
								reject(new Error('错误'))
							} else {
								wx.openSetting({
									success() { },
									fail(res) {
										wx.showToast({ title: '失败，写入相册权限未授权', icon: 'none' })
										reject(new Error('错误'))
									}
								})
							}
						},
						fail () {
							reject(new Error('错误'))
						}
					})
				},
			})
		})
	},

	// 观看广告
	lookVideo () {
		// 用户触发广告后，显示激励视频广告
		if (videoAd) {
			videoAd.show().catch(() => {
				// 失败重试
				videoAd.load()
					.then(() => videoAd.show())
					.catch(err => {
						videoAd.load()
						.then(() => videoAd.show())
						.catch(err => {
							wx.showToast({
								title: '视频显示失败',
								icon: 'loading'
							})
						})
					})
			})
		}
	},

		// vip 精细抠图   
	async vipKoutu () {
		if (this.data.downloadSuccess) return
		if (this.data.vipCount <= 0) return
		if (this.data.usedVip) return
		wx.showLoading({ title: '处理中...', })

		const { result } = await wx.cloud.callFunction({
      name: 'vipKoutu',
      data: { imgSrc: this.data.tmpOriginImgSrc }
		}).catch(e => wx.showToast({ title: '失败，请重试或帮助', icon: 'none' }))
		
		if (result.status !== 0) return wx.showToast({ title: '请求失败，请重试。或更换图片', icon: 'none' })
		this.useCount(true, -1)
		this.setData({ usedVip: true, filePath2: result.data.result })
	},

	// 使用次数
	useCount (vip, count = -1) {
		if(vip && this.data.useVipLoading) return
		this.data.useVipLoading = true
		wx.cloud.callFunction({
			name: vip ? 'useVipCount' : 'useCount',
			data: {
				inc: count,
				isVip: this.usedVip,
				lookVideo: vip && (count === 1)
			}
		})
		.catch()
		.then(res => {
			wx.hideLoading({})
			this.getCount()
			this.data.useVipLoading = false
		})
	},

	// 显示作者二维码
	showQrcode2() {
		wx.previewImage({
			urls: ['cloud://dev-4iov0.6465-dev-4iov0-1301148496/微信图片_20200606104940.jpg'],
			current: 'cloud://dev-4iov0.6465-dev-4iov0-1301148496/微信图片_20200606104940.jpg'    
		})
	},
	

	// 点击帮助
	help () {
		wx.showModal({
			title: '帮助',
			content: '即将离开本页面，进入帮助页面。当前页面操作不做保存，确定离开吗？',
			showCancel: true,
			cancelText: '取消',
			confirmText: '确定',
			success: (res) => {
				if (res.confirm) {
					wx.reLaunch({
						url: '/pages/help/help',
					})
				}
			},
		})
	},

	// 插屏广告
	useChapingAd () {
		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-d2281bbee1a5dea2'
			})
			interstitialAd.onLoad(() => {})
			interstitialAd.onError((err) => {})
			interstitialAd.onClose(() => {})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		wx.setNavigationBarTitle({ title: '免冠照制作' })
		wx.showLoading({ title: '图片加载中', })

		this.getGuide()

		this.useChapingAd()

		this.useVideoAd()
		
		this.receivingParameters()

		this.getCount()

		this.setRpxRatio()
		
	},

	// 接收参数
	receivingParameters () {
		const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel()
		eventChannel && eventChannel.on('acceptDataFromOpenerPage', (data) => {
			const {width, height, tmpOriginImgSrc, baiduKoutuResultFileId} = data

			this.setData({
				targetWidth: width,
				targetHeight: height,
				showScale: (480 / (+width)),
				filePath: baiduKoutuResultFileId,
				tmpOriginImgSrc
			})
		})
	},

	// 引导指南是否完成
	getGuide () {
		const _this = this
		wx.getStorage({
			key: 'guided',
			success (res) {
				_this.setData({ guided: res.data })
			}
		})
	},

	// 设置屏幕宽度比例
	setRpxRatio () {
		const _this = this
		wx.getSystemInfo({
			success(res) {
				_this.setData({ rpxRatio: res.screenWidth / 750 })
			}
		})
	},

	// 使用激励视频广告
	useVideoAd () {
		// 在页面onLoad回调事件中创建激励视频广告实例
		if (wx.createRewardedVideoAd) {
			videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-dfecffadf8e28a79'
			})
			videoAd.onLoad(() => {
				this.setData({
					videoLoaded: true
				})
			})
			videoAd.onError((err) => {
				this.setData({
					videoLoaded: false
				})
			})
			videoAd.onClose((res) => {
				console.log(res)
				if (res && res.isEnded) {
					if (this.data.tabIndex === 0) {
						this.setData({ tabIndex: 1, hideDownloadBtn: false })
					}
					wx.showToast({ title: '奖励已下发'})
					this.useCount(true, 1)
				} else {
					wx.showToast({ title: '看完才有奖励哦！', icon: 'none' })
				}
			})
		}
	},

	// 指南下一步
	guideNext () {
		this.setData({
			guideStep: this.data.guideStep + 1
		})
	},

	// 完成指引
	completionGuide () {
		this.setData({ guided: true })
		wx.setStorage({ key:"guided", data: true })
	},

	// 获取用户信息， 剩余次数
	getCount() {
		const openid = getApp().globalData.openid
		if (!openid) return
		const db = wx.cloud.database()
		db.collection('user').where({ openid }).get().then(res => {
			this.setData({
				count: res.data[0].count,
				vipCount: res.data[0].vipCount
			})
		})
	},

	// 换装
	changeClothes () {
		const that = this
		wx.navigateTo({
			url: '../imageStyle/imageStyle',
			events: {
				selectClothes: function (data) {
					that.setData({
						clothes: {
							...that.data.clothes,
							src: data.imgUrl,
							show: true
						}
					})
				}
			}
		})
	},

	// 换头发
	changeHair () {
		const that = this
		wx.navigateTo({
			url: '../hair/hair',
			events: {
				selectHair: function (data) {
					that.setData({
						hair: {
							...that.data.hair,
							src: data.imgUrl,
							show: true
						}
					})
				}
			}
		})
	},

	// 显示隐藏 服装 、头发
	showImage (event) {
		const name = event.currentTarget.dataset.name
		this.setData({
			[name]: {
				...this.data[name],
				show: !this.data[name].show
			}
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function (e) {
		
		// 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}

		if (this.data.clothes.src && !this.data.clothes.width) {
			wx.showLoading({ title: '图片加载中...', })
		}
		if (this.data.hair.src && !this.data.hair.width) {
			wx.showLoading({ title: '图片加载中...', })
		}

	},
	// 关闭上拉加载
	onReachBottom: function () {
		return
	},
	bindload: function (e) {
		wx.hideLoading({})
		const that = this
		const photoSizeObj = {
			width: this.data.targetWidth,
			height: this.data.targetHeight
		}
		const { width, height } = e.detail
		const _width = photoSizeObj.width
		const _height = _width * height / width
		const imgLoadSetData = {
			originImgWidth: width,
			originImgHeight: height,
			initImgWidth: _width,
			initImgHeight: _height,
			width: _width,
			height: _height,
			left: _width / 2,
			top: _height / 2 + photoSizeObj.height - _height
		}
		const outerDataName = e.currentTarget.dataset.dataname
		if (outerDataName === 'hair') {
			imgLoadSetData.top = _height / 2 + 10
		}
		that.setData(outerDataName ? {
			[outerDataName]: {
				...that.data[outerDataName],
				...imgLoadSetData
			}
		} : imgLoadSetData)
	},
	touchstart: function (e) {
		var that = this
		if (e.touches.length < 2) {
			canOnePointMove = true
			onePoint.x = e.touches[0].pageX * 2
			onePoint.y = e.touches[0].pageY * 2
		} else {
			twoPoint.x1 = e.touches[0].pageX * 2
			twoPoint.y1 = e.touches[0].pageY * 2
			twoPoint.x2 = e.touches[1].pageX * 2
			twoPoint.y2 = e.touches[1].pageY * 2
		}
	},
	touchmove: function (e) {
		var that = this
		const outerDataName = e.currentTarget.dataset.dataname
		const thatData = outerDataName ? this.data[outerDataName] : that.data
		
		if (e.touches.length < 2 && canOnePointMove) {
			var onePointDiffX = e.touches[0].pageX * 2 - onePoint.x
			var onePointDiffY = e.touches[0].pageY * 2 - onePoint.y
			const imgSetData = {
				msg: '单点移动',
				left: thatData.left + onePointDiffX,
				top: thatData.top + onePointDiffY
			}
			that.setData(outerDataName ? {
				[outerDataName]: {
					...that.data[outerDataName],
					...imgSetData
				}
			} : imgSetData)
			onePoint.x = e.touches[0].pageX * 2
			onePoint.y = e.touches[0].pageY * 2
		} else if (e.touches.length > 1) {
			var preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
			twoPoint.x1 = e.touches[0].pageX * 2
			twoPoint.y1 = e.touches[0].pageY * 2
			twoPoint.x2 = e.touches[1].pageX * 2
			twoPoint.y2 = e.touches[1].pageY * 2
			// 计算角度，旋转(优先)
			var perAngle = Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180 / Math.PI
			var curAngle = Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 180 / Math.PI
			if (Math.abs(perAngle - curAngle) > 1) {
				// that.setData({
				// 	msg: '旋转',
				// 	rotate: thatData.rotate + (curAngle - perAngle)
				// })
			} else {
				// 计算距离，缩放
				var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
				var curDistance = Math.sqrt(Math.pow((twoPoint.x1 - twoPoint.x2), 2) + Math.pow((twoPoint.y1 - twoPoint.y2), 2))
				const imgSetData = {
					msg: '缩放',
					scale: thatData.scale + (curDistance - preDistance) * 0.005
				}
				that.setData(outerDataName ? {
					[outerDataName]: {
						...that.data[outerDataName],
						...imgSetData
					}
				} : imgSetData)
			}
		}
	},
	touchend: function (e) {
		var that = this
		canOnePointMove = false
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '证件照、免冠照、证件照换背景、一寸照片、二寸照片，免费生成、下载。',
			path: '/pages/index/index'
		}
	}
})