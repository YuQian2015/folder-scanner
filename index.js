const fs = require('fs');
const path = require('path')

const ROOT_FOLDER = 'demoo'
const ROOT = 'F:/project/';

/**
 * 获取忽略文件里面的忽略目录
 *
 * @param {*} ignoreFile
 * @returns {array} 被忽略的文件目录
 */
function getIgnoreFolder(ignoreFile) {
  const folderStr = fs.readFileSync(ignoreFile, 'utf8').split('\n')
  return folderStr.map(item => item.replace('\r', ''))
}


function isDir(dir) {
  return fs.statSync(dir).isDirectory()
}

let dirTree = [];
function scan(root, folder, dt) {

  const dir = path.resolve(root, folder)
  console.log(`开始扫描${dir}`);

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
    ignoreFolder = getIgnoreFolder(gitIgnoreFile)
  }
  ignoreFolder.push('.git/', '.idea/');
  const files = fs.readdirSync(dir);
  console.log('--------------------------------------->扫描出来的文件 V');
  console.log(files);

  files.forEach(file => {
    // console.log(file);
    if (isDir(path.resolve(dir, file))) {
      if (ignoreFolder.indexOf(`${file}/`) < 0) {
        // console.log(file);
        scan(dir, file, current.children);
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

let str = ''
function generateTree(allTree, tree, child = 0) {
  let childDeep = child
  tree.forEach((item, index) => {
    if(child) {
      if(child > 1) {
        for( let i = 0; i < child - 1; i++ ) {
          str += '│   '
        }
      }
      if(tree.length - 1 === index) {
        str += '└── ';
      }
      if(tree.length - 1 > index) {
        str += '├── ';
      }
    }
    str += item.name
    if(item.isDir && item.children.length === 0) {
      str += '/\n';
    } else if(item.isDir && item.children.length) {
      str += '\n';
      generateTree(allTree, item.children, ++childDeep)
    } else {
      str += '\n';
    }
  });
}


scan(ROOT, ROOT_FOLDER, dirTree);

fs.writeFileSync(path.resolve(__dirname, 'scanResult.json'), JSON.stringify(dirTree))

generateTree(dirTree, dirTree);

console.log(str);
