# TikTok数据分析平台

一个用于搜索、展示、管理和分析TikTok用户数据的现代化Web应用程序。此应用允许您输入TikTok用户链接，获取并可视化其个人资料和视频数据，以及管理您关注的TikTok创作者。

![TikTok数据分析平台截图](https://via.placeholder.com/800x450)

## 功能特点

- **用户数据采集**：通过TikTok链接或用户名获取用户数据
- **成员管理**：管理、追踪您感兴趣的TikTok创作者
- **用户收藏**：将TikTok创作者添加到收藏夹，便于快速访问
- **数据导出**：支持将成员数据导出为CSV格式，方便离线分析
- **留言板**：用户可以发布、编辑和删除留言，促进社区交流
- **用户资料展示**：显示用户基本信息、头像、地区和粉丝数
- **统计分析**：展示用户内容的综合数据统计（视频数、播放量、点赞等）
- **互动率分析**：计算并展示重要互动指标（点赞率、评论率、分享率、收藏率）
- **视频列表**：以网格形式展示用户发布的视频及其详细数据
- **响应式设计**：完美适配桌面端和移动端设备
- **用户认证**：支持用户注册和登录，区分管理员和普通用户权限

## 技术栈

- **前端**：React.js、React Router、React Hooks
- **状态管理**：Context API
- **UI组件**：React Icons
- **样式**：CSS3 with Flexbox & Grid
- **日期处理**：内置JavaScript Date API
- **API通信**：Fetch API
- **存储**：LocalStorage (客户端持久化存储)
- **认证**：JWT (JSON Web Tokens)
- **后端**：Node.js

## 快速开始

### 前提条件

- Node.js (v14+)
- npm 或 yarn

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/tiktok-analyzer.git
cd tiktok-analyzer
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 启动后端API服务器

```bash
node server.js
```

4. 启动前端开发服务器（在新的终端窗口）

```bash
npm start
# 或
yarn start
```

5. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

### 数据采集

1. 在"TikTok用户采集"页面的搜索框中输入TikTok用户链接
   - 例如: `https://www.tiktok.com/@username`
2. 点击"搜索用户"按钮
3. 系统会显示用户资料、统计数据及视频列表

### 成员管理

1. 访问"成员管理"页面查看所有已添加的TikTok创作者
2. 使用搜索框快速查找特定成员
3. 点击表格标题对数据进行排序
4. 点击收藏按钮(星星图标)将创作者添加到您的收藏夹
5. 点击成员名称查看其TikTok主页
6. 管理员可以通过"添加成员"按钮添加新成员
7. 管理员可以通过删除按钮移除成员
8. 使用"一键更新成员数据"按钮批量更新所有成员的最新数据
9. 使用"导出CSV"按钮将当前成员数据导出为CSV文件

### 留言板

1. 访问"留言板"页面浏览所有用户留言
2. 在文本框中输入您的留言并点击"发布留言"
3. 您可以编辑或删除自己的留言

## 项目结构
tiktok-analyzer/
├── public/                  # 静态资源
└── src/                     # 源代码
    ├── api.js               # API调用函数
    ├── App.js               # 应用主组件
    ├── index.js             # 应用入口
    ├── index.css            # 全局样式
    ├── components/          # React组件
    │   ├── Layout.js        # 布局组件
    │   ├── UserCard.js      # 用户卡片组件
    │   ├── VideoList.js     # 视频列表组件
    │   ├── UserProfile.js   # 用户资料组件
    │   ├── PrivateRoute.js  # 私有路由组件
    │   └── ...
    ├── context/             # React Context
    │   ├── AuthContext.js   # 认证上下文
    │   └── FavoritesContext.js # 收藏功能上下文
    ├── pages/               # 页面组件
    │   ├── HomePage.js      # 首页
    │   ├── CollectPage.js   # 数据采集页
    │   ├── MembersPage.js   # 成员管理页面
    │   ├── MessageBoardPage.js # 留言板页面
    │   ├── MemberDetailPage.js # 成员详情页面
    │   ├── LoginPage.js     # 登录页面
    │   ├── RegisterPage.js  # 注册页面
    │   └── AboutPage.js     # 关于页面
    └── styles/              # 组件样式
        ├── Layout.css       # 布局样式
        ├── CollectPage.css  # 采集页样式
        ├── MembersPage.css  # 成员页样式
        ├── MessageBoardPage.css # 留言板样式
        └── ...
```

## API使用说明

本项目使用TikHub API获取TikTok用户数据。请注意，API有调用限制，如需大量使用，请考虑申请正式授权。

```javascript
// API调用示例
import { extractUniqueId, fetchUserData } from '../api';

// 从URL中提取用户ID
const uniqueId = extractUniqueId('https://www.tiktok.com/@username');

// 获取用户数据
const data = await fetchUserData(uniqueId);
```

## 用户认证与角色

- **普通用户**：可以浏览成员列表、收藏创作者、使用留言板
- **管理员**：额外拥有添加/删除成员、批量更新数据的权限

## 数据存储

应用使用浏览器的LocalStorage来存储以下数据：
- 用户认证信息
- 成员列表数据
- 用户收藏列表
- 留言板内容

## 注意事项

- TikTok的API政策可能随时变更，可能导致某些功能失效
- 本工具仅用于学习和研究目的，请遵守TikTok的服务条款和使用政策
- 请勿过度频繁地请求API，以免触发限流

## 贡献指南

1. Fork 这个仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如有任何问题或建议，请通过以下方式联系：

- 项目负责人：[您的名字](mailto:your.email@example.com)
- 项目主页：[GitHub仓库地址](https://github.com/yourusername/tiktok-analyzer) 
```
