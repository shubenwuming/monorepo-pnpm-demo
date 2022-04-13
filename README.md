# monorepo-pnpm-demo
从0到1搭建一个包含 vue2 app、vue3 app、react app、通用工具函数的monorepo

### 1：安装 pnpm 

命令行中输入

```shell
npm install pnpm -g
```

查看是否安装成功

```shell
pnpm -v
```

### 2：基本目录结构初始化

#### 2.1根目录下输入`pnpm init -y ` 

此条命令会生成package.json文件，修改此文件，只保留一些必要字段，大致内容如下

```json
{
  "name": "monorepo-pnpm-demo",
  "version": "1.0.0",
  "description": "从0到1搭建一个包含 vue2 app、vue3 app、react app、通用工具函数的monorepo",
  "private": true
}
```



#### 2.2 根目录下创建packages目录

#### 2.3 根目录下创建pnpm-workspace.yaml文件

此文件 定义了 [工作空间](https://pnpm.io/zh/workspaces) 的根目录，并能够使您从工作空间中包含 / 排除目录 

```yaml
packages:
  # all packages in subdirs of packages/ and components/
  - 'packages/**'
  # exclude packages that are inside test directories
  # - '!**/test/**'
```

### 3：packages目录下引入app（vue2 、vue3、react）

因为是demo，此处我就自己新建vue2、vue3、react的项目

将目录切换到packages目录下，用脚手架快速搭建这三种框架的项目

```shell
vue create app-vue2
pnpm create vite app-vue3
npx create-react-app app-react
```

### 4：仓库的根目录下启动项目

package.json中 scripts字段处理，这里就以本地启开发服务器为例子，使用pnpm中的`--filter`，

当然你不嫌弃麻烦也可以切换到相应项目的目录中，按照原来的方式启动项目，构建项目类似就不说了

```json
"scripts": {
    "app-vue2:dev": "pnpm start --filter \"app-vue2\"",
    "app-vue3:dev": "pnpm serve --filter \"app-vue2\"",
    "app-react:dev": "pnpm dev --filter \"app-vue2\""
  }
```

### 5：对原有项目的lock文件处理

当从npm 或者yarn转成pnpm时，需要在原项目目录下运行`pnpm import`来生成pnpm自己的lock文件，pnpm只能识别自己的锁文件

### 6：约束团队只用pnpm

当你想约束团队只用pnpm安装依赖时，可以在package.json中配置`preinstall`

```json
{
    "scripts": {
        "preinstall": "npx only-allow pnpm"
    }
}
```

### 7：引入跨项目的通用utils工具文件

#### 7.1 手动的根据路径去引入

这种方式就不过多介绍了，多个项目引入的话，路径一直变，很麻烦。

#### 7.2 放置到workspace的root中

root路径下命令行输入`pnpm add utils -w`，会直接安装到根路径，使用的时候直接像用一个第三方npm包一样的使用`import {add} from 'utils'`，不用再考虑路劲

观察root 中 package.json 中的 依赖相关的字段中生成。

