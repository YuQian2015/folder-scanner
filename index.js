const fs = require('fs');
const path = require('path');

class FolderScanner {
  constructor({ location, rootFolder }) {
    this.ROOT_FOLDER = rootFolder;
    this.ROOT = location;
    this.dirTree = []
  }

  getData() {
    this.dirTree.length = 0;
    this._scan(this.ROOT, this.ROOT_FOLDER, this.dirTree);
    return this.dirTree
  }

  getTree() {
    this.dirTree.length = 0;
    this._scan(this.ROOT, this.ROOT_FOLDER, this.dirTree);
    let str = ''
    function generateTree(allTree, tree, depth = 0, inLastFolder = []) {
      // console.log(depth, inLastFolder); // true表示父级是最后一个目录
      let childDeep = depth
      ++childDeep
      tree.forEach((item, index) => {
        if (depth) {
          if (depth > 1) {
            for (let i = 0; i < depth - 1; i++) {
              if (inLastFolder[i + 1]) {
                str += '    '
              } else {
                str += '│   '
              }
            }
          }
          if (tree.length - 1 === index) {
            str += '└── ';
          }
          if (tree.length - 1 > index) {
            str += '├── ';
          }
        }
        // 根目录和文件生成
        str += item.name
        if (item.isDir && item.children.length === 0) {
          str += '/\n';
        } else if (item.isDir && item.children.length) {
          str += '\n';
          generateTree(allTree, item.children, childDeep, inLastFolder.concat([tree.length - 1 === index]))
        } else {
          str += '\n';
        }
      });
    }

    generateTree(this.dirTree, this.dirTree);
    return str
  }

  _getIgnoreFolder(ignoreFile) {
    const folderStr = fs.readFileSync(ignoreFile, 'utf8').split('\n')
    return folderStr.map(item => item.replace('\r', ''))
  }

  _isDir(dir) {
    return fs.statSync(dir).isDirectory()
  }
  _scan(root, folder, dt) {

    const dir = path.resolve(root, folder)
    // console.log(`开始扫描${dir}`);

    const current = {
      name: folder,
      isDir: true,
      children: []
    };

    dt.push(current)

    let ignoreFolder = [];
    const gitIgnoreFile = path.resolve(dir, '.gitignore');
    if (fs.existsSync(gitIgnoreFile)) {
      console.log('存在忽略文件');
      ignoreFolder = this._getIgnoreFolder(gitIgnoreFile)
    }
    ignoreFolder.push('.git/', '.idea/');
    const files = fs.readdirSync(dir);
    // console.log('--------------------------------------->扫描出来的文件 V');
    // console.log(files);

    files.forEach(file => {
      // console.log(file);
      if (this._isDir(path.resolve(dir, file))) {
        if (ignoreFolder.indexOf(`${file}/`) < 0) {
          // console.log(file);
          this._scan(dir, file, current.children);
        }
      } else {
        if (ignoreFolder.indexOf(`${file}`) < 0) {
          // console.log(file);
          current.children.push({
            name: file,
            isDir: false,
            children: []
          })
        }
      }
    })
  }
}

module.exports = FolderScanner;
