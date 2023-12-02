Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  preView (event) {
		wx.previewImage({
			urls: [this.data.imageSrc],
			current: this.data.imageSrc
		})
	},
  // 下载
  downloadClick() {
    if (!this.data.imageSrc) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none',
        duration: 3000
      })
    } else {
      console.log(this.data.imageSrc);
      var url = this.data.imageSrc;
      wx.downloadFile({
        url: url,
        success: function (res) {
          console.log(res);
          //图片保存到本地
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 3000
              })
              setTimeout(() => {
                wx.navigateBack();
              }, 3000)
            },
            fail: function (err) {
              console.log(err);
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("当初用户拒绝，再次发起授权")
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    } else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  }
                })
              }
            },
            complete(res) {
              console.log(res);
            }
          })
        }
      })
    }

  },
  //选图片
  choosePic() {
    if (this.data.imageSrc) {
      return this.preView()
    }
    console.log('选图片')
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.uploadImg(tempFilePath)
      },
      fail() {
        wx.showToast({
          title: '取消选择',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  uploadImg(tempFilePath) {
    console.log(tempFilePath)
    wx.showLoading({
      title: '图片安全校验',
    })
    // 获取图片信息
    wx.getImageInfo({
        src: tempFilePath,
      })
      // 图片安全校验
      .then(res => {
        return wx.cloud.callFunction({
          name: 'printStyle',
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
      }).then((res) => {
        console.log('返回值', res)
        wx.hideLoading()
        if (!res.result.errMsg) {
          this.setData({
            imageSrc: res.result
          })
        } else {
          wx.showToast({
            title: res.result.errMsg,
            icon: 'none',
            duration: 3000
          })
        }

      }) // 错误处理
      .catch(console.error)
  }
})