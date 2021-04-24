// miniprogram/pages/editPhoto/editPhoto.js
import base64src from './base64toFile'
// import opacity1px from './opacity1px'
const { photoSizeList } = getApp().globalData;
const sizeNameList = photoSizeList.map(v => v.name)
var canOnePointMove = false
var onePoint = {
	x: 0,
	y: 0
}
var twoPoint = {
	x1: 0,
	y1: 0,
	x2: 0,
	y2: 0
}
let g_ext = '';
let g_base64 = ''
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
		filePath: '',
		filePath2: '',
		canvasFilePath: '',
		sourceImageData: null,
		guided: '',
		guideStep: 1,
		hideDownloadBtn: false,
		downloadSuccess: false,
		uploadSuccess: false,
		bgc: 'white',
		photoBg: 'white',
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
		// msg: '',
		// src: 'http://img01.taopic.com/150508/318763-15050PU9398.jpg',
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

	/**
	 * 切换背景
	 */
	toggleBg(e) {
		const bgc = e.currentTarget.dataset.color;
		const showColorPicker = bgc === 'custom';
		const photoBg = showColorPicker ? this.data.colorData.pickerData.hex : {
			red: '#ff0000',
			blue: 'rgb(67,142,219)',
			blue2: 'rgb(0,191,243)',
			white: '#ffffff',
			transparent: 'transparent'
		}[bgc]
		this.setData({
			bgc,
			showColorPicker,
			photoBg
		})
	},

	/**
	 * 关闭拾色器
	 */
	closeColorPicker() {
		this.setData({ showColorPicker: false })
	},

	imageToCanvas() {
		this.setData({ hideDownloadBtn: true })
		wx.showLoading()
		const query = wx.createSelectorQuery()
		query.select('#myCanvas').fields({ node: true, size: true }).exec(async (res) => {
			const canvas = res[0].node
			const ctx = canvas.getContext('2d')

			const dpr = wx.getSystemInfoSync().pixelRatio
			canvas.width = res[0].width * dpr
			canvas.height = res[0].height * dpr
			// ctx.scale(dpr * this.data.scale, dpr * this.data.scale)
			console.log(ctx, dpr)
			ctx.scale(dpr, dpr)
			console.log(ctx, dpr)
			if (this.data.photoBg !== 'transparent') {
				ctx.fillStyle = this.data.photoBg
				ctx.fillRect(0, 0, canvas.width, canvas.height)
			}
			await this.canvasDrawImage(res[0], canvas, ctx, {
				...this.data,
				src: this.data.tabIndex === 0 ? this.data.filePath : (this.data.filePath2 || this.data.this.data.filePath)
			})
			if (this.data.clothes.show) {
				await this.canvasDrawImage(res[0], canvas, ctx, this.data.clothes)
			}
			if (this.data.hair.show) {
				await this.canvasDrawImage(res[0], canvas, ctx, this.data.hair)
			}
			this.download(canvas)
		})
	},

		// 图片画到canvas中
	canvasDrawImage (ele, canvas, ctx, _imgData) {
		return new Promise((resove, reject) => {
			const imgData = _imgData || this.data
			const img = canvas.createImage()
			img.onload = () => {
				const left = (imgData.left - imgData.initImgWidth / 2)
				const top = (imgData.top - imgData.initImgHeight / 2)
				const noScaleImgHeight = ele.width * img.height / img.width
				const resultImgWidth = ele.width * imgData.scale
				const resultImgHeight = noScaleImgHeight * imgData.scale
				const scaleChangeWidth = (resultImgWidth / 2 - ele.width / 2)
				const scaleChangeHeight = (resultImgHeight / 2 - noScaleImgHeight / 2)
				// ctx.translate(left - scaleChangeWidth + resultImgWidth / 2, top - scaleChangeHeight + resultImgHeight / 2)
				// ctx.rotate((imgData.rotate % 360) * Math.PI / 180)
				ctx.drawImage(img, 0, 0, img.width, img.height, left - scaleChangeWidth, top - scaleChangeHeight, resultImgWidth, resultImgHeight)
				resove(true)
			}
			img.src = imgData.src
		})
	},

	download(canvas, quality = 1) {
		const dpr = wx.getSystemInfoSync().pixelRatio
		const destWidth = canvas.width / dpr
		const destHeight = canvas.height / dpr
		const _this = this
		wx.canvasToTempFilePath({
			canvas: canvas,
			fileType: 'jpg',
			quality,
			destWidth,
			destHeight,
			success(tempFile) {
				wx.getFileInfo({
					filePath: tempFile.tempFilePath,
					success(res) {
						const photoSize = (res.size / 1024).toFixed(2)
						_this.setData({
							canvasShow: false,
							kb: photoSize,
							canvasFilePath: tempFile.tempFilePath,
							photoDescription: `生成并下载成功：图片像素${destWidth}×${destHeight}, 图片大小${photoSize}kB`
						})
						_this.uploadPhoto(tempFile.tempFilePath)
						_this.writePhotosAlbum(tempFile)
						// _this.saveUserPhotoId()
					}
				})
			}
		})
	},

	// 判断写入相册权限
	writePhotosAlbum (tempFile) {
		const _this = this
		_this.saveImage(tempFile.tempFilePath)
	},

	uploadPhoto(tempFilePath) {
		wx.cloud.uploadFile({
			cloudPath: new Date().Format('yyyy-MM-dd').split('-').join('/') + '/' + Date.now() + '-' + Math.random() + '.' + tempFilePath.slice(-3), // 上传至云端的路径
			filePath: tempFilePath, // 小程序临时文件路径
			success: res => {
				this.saveUserPhotoId(res.fileID)
			},
			fail() {

			}
		})
	},

	saveUserPhotoId(fileID) {
		const db = wx.cloud.database();
		db.collection("finish_product").add({
			data: {
				fileID: fileID,
				create_time: Date.now(),
				// photoType: photoSizeList[this.data.index].name,
				size: this.data.targetWidth + '×' + this.data.targetHeight,
				kb: this.data.kb + 'kB',
				bgc: this.data.photoBg,
				// ...this.data.attributes
			}
		})
		return
		
	},

	saveImage(tempFilePath) {
		const that = this
		wx.saveImageToPhotosAlbum({
			filePath: tempFilePath,
			success: () => {
				this.setData({ downloadSuccess: true })
				wx.showToast({ title: '下载成功' })
				this.useCount()

				wx.redirectTo({
					url: './complete/complete?msg=' + this.data.photoDescription + '&tempFilePath=' + tempFilePath,
				})
			},
			fail(res) {
				wx.getSetting({
					success(res) {
						if (res.authSetting['scope.writePhotosAlbum']) {
							wx.showToast({ title: '下载失败，点击帮助', icon: 'none' })
						} else {
							wx.openSetting({
								success() { },
								fail(res) {
									wx.showToast({ title: '失败，写入相册权限未授权', icon: 'none' })
								}
							})
						}
					},
				})
			},
			// complete () {
			// 	that.setData({
			// 		hideDownloadBtn: false
			// 	})
			// }
		})
	},

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

	useVipCount () {
		if (this.data.downloadSuccess) return
		if (this.data.vipCount <= 0) return
		if (this.data.usedVip) return
		const APPCODE = getApp().globalData.appcode
		if (!APPCODE) return
		wx.showLoading({
			title: '处理中...',
		})
		
		wx.request({
			url: 'https://aliapi.aisegment.com/segment/matting',
			data: {
				type: g_ext,
				photo: g_base64
			},
			header: {
				'Content-Type': 'application/json; charset=UTF-8',
				'Authorization': 'APPCODE ' + APPCODE
			},
			method: 'POST',
			dataType: 'json',
			responseType: 'text',
			success: (res) => {
				console.log(res)
				console.log(res.data.data.result)
				if (res.data.status !== 0) {
					wx.showToast({ title: '失败，请重试或帮助', icon: 'none' })
					return
				}
				this.useCount(true, -1)
				this.setData({ 
					usedVip: true,
					filePath2: res.data.data.result
				})
			},
			fail: function(res) {
				console.log(res)
				return wx.showToast({ title: '请求失败，请重试。或更换图片', icon: 'none' })
			},
			complete: function(res) {},
		})
		
	},

	// 使用次数
	useCount (vip, count = -1) {
		wx.cloud.callFunction({
			name: vip ? 'useVipCount' : 'useCount',
			data: {
				inc: count,
				isVip: this.usedVip,
				lookVideo: vip && (count === 1)
			}
		}).then(res => {
			wx.hideLoading({})
			this.getCount()
		})
	},

	
	showQrcode2() {
		wx.previewImage({
			urls: ['https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200606104940.jpg'],
			current: 'https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200606104940.jpg' // 当前显示图片的http链接      
		})
	},
	


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

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({ title: '免冠照制作' })
		wx.showLoading({ title: '图片加载中', })
		this.setData({
			index: options.sizeIndex,
			canvasShow: true
			// showScale: 480 / this.data.objectArray[options.sizeIndex].width
		})
		
		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-d2281bbee1a5dea2'
			})
			interstitialAd.onLoad(() => {})
			interstitialAd.onError((err) => {})
			interstitialAd.onClose(() => {})
		}
		
		const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel()
		if (!eventChannel) {
			wx.hideLoading()
			wx.showModal({
				title: '微信版本太低',
				showCancel: false,
				content: '微信版本太低，无法使用，请手动升级微信版本后再来。'
			})
		}
		eventChannel && eventChannel.on('acceptDataFromOpenerPage', (data) => {
			console.log(data)
			this.removeTempFile()
			const {targetWidth, targetHeight, sourceExt, sourceBase64} = data
			g_ext = sourceExt
			g_base64 = sourceBase64
			this.setData({
				targetWidth,
				targetHeight,
				showScale: (480 / (+targetWidth))
			})
			const base64Str = 'data:image/png;base64,' + data.data.foreground
			base64src(base64Str).then(res => {
				this.setData({ filePath: res })
			}).catch(err => {
				console.log(err)
				this.setData({filePath: base64Str})
			})
		})

		this.getCount()

		const _this = this
		wx.getSystemInfo({
			success(res) {
				_this.setData({ rpxRatio: res.screenWidth / 750 })
			}
		})

		wx.getStorage({
			key: 'guided',
			success (res) {
				_this.setData({ guided: res.data })
			}
		})

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
					wx.showToast({
						title: '看完才有奖励哦！',
						icon: 'none'
					})
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

	getCount() {
		const openid = getApp().globalData.openid
		if (!openid) return
		const db = wx.cloud.database()
		db.collection('user').where({ openid }).get().then(res => {
			console.log(res)
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
			url: 'imageStyle/imageStyle',
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
			url: 'hair/hair',
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

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		this.removeTempFile()
	},

	// 清除临时文件
	removeTempFile () {
		let xx2 = wx.getFileSystemManager()
		const basepath = `${wx.env.USER_DATA_PATH}`
		xx2.readdir({
			dirPath: basepath,/// 获取文件列表
			success(res) {
				console.log(res)
				res.files.forEach((val) => { // 遍历文件列表里的数据
					console.log(val)
					xx2.unlink({
						filePath: basepath + '/' + val
					});
				})
			}, fail(err) {
				console.log(err)
			}, complete() {
				console.log('complete')
			}
		})
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