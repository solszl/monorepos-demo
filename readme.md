### 基础
1. ``` lerna bootstrap ``` // 启动
2. ``` lerna link ``` // 连接
3. ``` lerna clean ``` // 清理node_modules

### 修改包内容后进行更新
1. 修改PackageA内容，需要增加PackageA下package.json version
2. 修改对其引用的PackageB项目的dependencies 内版本
3. ``` lerna bootstrap ``` 启动
4. ``` lerna link ``` 重新连接
5. ``` git push ``` 的时候需要进行double check.