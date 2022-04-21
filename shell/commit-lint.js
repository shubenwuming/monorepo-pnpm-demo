#! /uer/bin/env node
import shell, { exit } from 'shelljs'
let diff = shell
            .exec('git diff --cached --name-only', {slient: true})
            .stdout
if(!diff) {
  shell.echo('没有改动的文件')
  exit(1)
}

diff = diff
        .trim()
        .split('\n')
console.log(diff)

/**
 * 1 git add
 * 2 执行脚本
 * 3 选择commit，填写信息
 * 4 触发pre-commit钩子，进行校验
 */


// 允许提交 ：
// 1.都不在packages里
// 2.都在packages下的一个package中
// 其他情况都阻止

let allNotInPackages = true
const workSpaceDir = 'packages' // 所有package所在的目录
let packageName = ''  // packages/app1 => app1
let allInSamePackage = true

// 只遍历一次进行判断
diff.forEach(pathStr => {
  if(!pathStr.startsWith(workSpaceDir)) {
    allInSamePackage = false
  } else {
    const packageNameOther = pathStr.slice(workSpaceDir.length + 1, pathStr.indexOf('/',workSpaceDir.length + 1))
    packageName = packageName || packageNameOther
    if(packageName !== packageNameOther) allInSamePackage = false
    allNotInPackages = false
  }
})

if(allInSamePackage || allNotInPackages) {
  console.log('允许')
  shell.exit(0)
} else {
  console.log('阻断')
  shell.echo(`提交失败`)
  shell.exit(1)
}


