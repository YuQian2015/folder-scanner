# @moyufed/folder-scanner

nodejs的文件扫描和文件树生成。

### 安装

```powershell
$ npm install @moyufed/folder-scanner
```

### 使用

```js
const FolderScanner = require('@moyufed/folder-scanner');

const folderScanner = new FolderScanner({
  location: 'F:/',
  rootFolder: 'test-page'
});

console.log(folderScanner.getData());
console.log(folderScanner.getTree());
```

### config [object]

| 属性       | 描述                       |
| ---------- | -------------------------- |
| location   | 指定要扫描的文件夹所在位置 |
| rootFolder | 指定要扫描的文件夹         |

### API

#### getData [Function]

返回文件结构数据

return array

#### getTree [Function]

返回文件结构树

return string