### 获取某个标签的需求等级
  通常为1的是必须要进行添加的
  2为产品经理或者医生主动要求增加
  3为能不增加就不增加，显示Unknown

1. 使用方式为 修改node scripts/tag-level/index.js 里面tag 标签9位连续字符。如：0008,3010
2. 查看控制台输出

调用 https://dicom.innolitics.com/ 的接口，可能查询较慢或者出现查询超时

### 实现流程为
1. step1, 处理输入数据
2. step2, search结果集
3. step3, 根据结果集 搜索ct-image字段。跳转搜索
4. step4, cheerio 爬取对应字段进行显示