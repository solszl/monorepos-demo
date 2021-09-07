### 说明
  该脚本用于获取html内提供的tag标签。用来当做dump的原始数据
1. 启动静态资源服务器，端口如脚本
2. 执行 ``` node scripts/tags/fetch-all-tags.js ```
3. 将生成的dictionary.json放入 packages/dicom/image/

### 也可以自行编写爬虫脚本
1. 修改爬取URL
2. 编写脚本