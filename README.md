
# 证件照 小程序 (原生微信小程序 + 云开发)
欢迎提出改进意见

**项目仅供学习，如有雷同应用，必究。**
### 功能

用于免费快速生成证件照

- 可自定义照片尺寸、背景颜色 
- 支持换装、换发型 
- 支持手势拖拽缩放编辑图片


- 客服消息自动回复
- 定时触发器
- 云函数海报生成，图片合成

--------------------
### 项目本地运行
1. 下载开发者工具并且申请小程序账号（选择下载好的项目，appid 填写为你的小程序appid）
2. 开通云开发
3. 上传并部署云函数
4. 创建数据库集合4个  (user、tmp-file、share、photo_size)
5. 导入数据到 photo_size,  数据在 cloudfunctions\photoSizeJson\database_export-iIeoJqdDdivP.json
6. 注册百度AI开放平台人像分割   https://ai.baidu.com/tech/body/seg（记下 API_KEY、APP_ID、SECRET_KEY ）
7. 找到百度抠图云函数， 配置云函数--> 高级配置 --> 环境变量 添加环境变量（API_KEY、APP_ID、SECRET_KEY）
8. 预览
-------------------------

![小程序码](https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210411162950.jpg?sign=1cdabb92e1b2f3ffa846fc4f8007f5f8&t=1618129824)

![欢迎骚扰](https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200606104940.jpg?sign=185169727273f47f237464b4ebf90106&t=1618129640)

![赞赏支持](https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200327222252.jpg?sign=9b042f8caa5f3a4e4506cdd75b04f789&t=1618129652)


