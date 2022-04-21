#! /urs/bin/env node
import { Command } from "commander"
import inquirer from  "inquirer"
import _ from "lodash"
import chalk from "chalk"
import shell from "shelljs"

// 拿到packages目录下所有的包的名称
import fs from 'fs'
const files = [
  {
    name: 'root', value: 'root'
  }, 
  ...fs.readdirSync('./packages').map(item => ({
    name: item, value: item
  }))
]
console.log(files)

const program = new Command()

program
  .command('branch')
  .alias('b')
  .description('handler commit and branch')
  .action(async () => {

    const typeQuetion = [
      {
        type: 'list',
        name: 'type',
        message: '请选择操作类型',
        choices: [
          {name: '创建分支', value: 'branch'},
          {name: '提交代码', value: 'commit'}
        ]
      }
    ]

    const branchQuestion = [
      {
        type: 'list',
        name: 'dirName',
        message: '请选择项目/文件夹名称',
        choices: files
      },
      {
        type: 'input',
        name: 'date',
        message: '请输入发版日期',
        validate: (input) =>  input ? true : '不能为空'
      }
    ]
    const commitQuestion = [
      {
        type: 'list',
        name: 'changeType',
        message: '请选择提交类型',
        choices: [
          {name: 'fix: 修改', value: 'fix'},
          {name: 'feat: 新功能', value: 'feat'}
        ]
      },
      {
        type: 'list',
        name: 'dirName',
        message: '请选择项目/文件夹名称',
        choices: files
      },
      {
        type: 'input',
        name: 'commitMessage',
        validate: (input) => input ? true : '不能为空'
      }
    ]



    console.log('')
    console.log(chalk.red('开启 git 规范 之路'))
    console.log('')

    const answer = await inquirer.prompt(typeQuetion)

    if(answer.type === 'branch'){
      const answerBranch = await inquirer.prompt(branchQuestion)
      const branchName = `${answerBranch.dirName}-${answerBranch.date}`
      shell.exec(`git checkout -b ${branchName}`)
      shell.exec(`git push origin ${branchName}`)
    }
    
    if(answer.type === 'commit') {
      const answerCommit = await inquirer.prompt(commitQuestion)
      shell.exec(`git commit -m "${answerCommit.changeType}(${answerCommit.dirName}): ${answerCommit.commitMessage}"`)
    }
    return
  })


program.parse(process.argv)