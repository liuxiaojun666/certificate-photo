const fsm = wx.getFileSystemManager();

const base64src = function(base64data) {
  const FILE_BASE_NAME = 'tmp_base64src' + Date.now();
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
    const buffer = wx.base64ToArrayBuffer(bodyData);
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
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

export default base64src;