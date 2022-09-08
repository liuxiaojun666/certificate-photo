

const fsm = wx.getFileSystemManager();


// 清除本地文件
function deleteTempFile () {
  let xx2 = wx.getFileSystemManager()
  const basepath = `${wx.env.USER_DATA_PATH}`
  return new Promise((resolve, reject) => {
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
        resolve(true)
      }
    })
  })
}

const base64src = function(base64data) {
  deleteTempFile()
  const FILE_BASE_NAME = 'tmp_base64src' + Date.now();
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
    fsm.writeFile({
      filePath,
      data: bodyData,
      encoding: 'base64',
      success(res) {
        console.log(res)
        resolve(filePath);
      },
      fail(err) {
        console.log(err)
        reject(new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  });
};

exports.canvasDrawImage = function canvasDrawImage (ele, canvas, ctx, _imgData) {
  // const dpr = wx.getSystemInfoSync().pixelRatio
  const dpr = 1
  return new Promise((resove, reject) => {
    const imgData = _imgData || this.data
    const img = canvas.createImage()
    img.onload = () => {
      const left = (imgData.left - imgData.initImgWidth / 2) / dpr
      const top = (imgData.top - imgData.initImgHeight / 2) / dpr
      const noScaleImgHeight = ele.width * img.height / img.width
      const resultImgWidth = ele.width * imgData.scale
      const resultImgHeight = noScaleImgHeight * imgData.scale
      const scaleChangeWidth = (resultImgWidth / 2 - ele.width / 2)
      const scaleChangeHeight = (resultImgHeight / 2 - noScaleImgHeight / 2)
      ctx.drawImage(img, 0, 0, img.width, img.height, left - scaleChangeWidth, top - scaleChangeHeight, resultImgWidth, resultImgHeight)
      resove(true)
    }
    img.src = imgData.src
  })
}

// canvas 转为临时文件
exports.canvasToTempFile = function canvasToTempFile(canvas, quality = 1) {
  const tempFile = canvas.toDataURL && canvas.toDataURL({type: 'image/jpeg', encoderOptions: quality})
  return new Promise((resolve, reject) => {
    base64src(tempFile || '').then(res => {
      logInfo(res)
      resolve(res)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

function logInfo (tempFilePath) {
  fsm.getFileInfo({
    filePath: tempFilePath,
    success: res => {
      console.log(res)
    }
  })
}


