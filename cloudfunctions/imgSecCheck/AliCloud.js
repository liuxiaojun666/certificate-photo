/* eslint-env node */
const $imageaudit20191230 = require("@alicloud/imageaudit20191230");
const imageaudit20191230 = $imageaudit20191230.default
const $OpenApi = require("@alicloud/openapi-client");
const $Util = require("@alicloud/tea-util");
const Util = $Util.default
const accessKeyId = process.env.accessKeyId;
const accessKeySecret = process.env.accessKeySecret;

module.exports = class Client {
  /**
   * 使用AK&SK初始化账号Client
   * @param accessKeyId
   * @param accessKeySecret
   * @return Client
   * @throws Exception
   */
  static createClient() {
    const config = new $OpenApi.Config({
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
    });
    // 访问的域名
    config.endpoint = `imageaudit.cn-shanghai.aliyuncs.com`;
    return new imageaudit20191230(config);
  }

  static async main(imageURL) {
    const client = Client.createClient();
    const task0 = new $imageaudit20191230.ScanImageRequestTask({
      imageURL: imageURL,
    });
    const scanImageRequest = new $imageaudit20191230.ScanImageRequest({
      task: [task0],
      scene: ["porn", "terrorism", "live"],
    });
    const runtime = new $Util.RuntimeOptions({});
    try {
      // 复制代码运行请自行打印 API 的返回值
      const aliResult = await client.scanImageWithOptions(scanImageRequest, runtime);
      return { status: aliResult.body.data.results[0].subResults.every(item => item.suggestion === 'pass') }
    } catch (error) {
      // 如有需要，请打印 error
      Util.assertAsString(error.message);
      return { error }
    }
  }
}

