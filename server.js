// 如果你使用 Express 作为后端
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// 使用更详细的 CORS 设置
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // Use Express's built-in JSON parser

// 记录所有请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 默认管理员账户
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'A@d!min0897￥#%',
  isAdmin: true
};

// 用户存储 (仅开发使用，生产环境应使用数据库)
let users = [DEFAULT_ADMIN];

// 登录路由
app.post('/api/auth/login', (req, res) => {
  console.log('登录请求体:', req.body);
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // 不返回密码
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
});

// 注册路由
app.post('/api/auth/register', (req, res) => {
  console.log('注册请求体:', req.body);
  const { username, password } = req.body;
  
  // 验证输入
  if (!username || !password) {
    return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
  }
  
  // 检查用户名是否已存在
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ success: false, message: '用户名已被使用' });
  }
  
  // 创建新用户 (非管理员)
  const newUser = { username, password, isAdmin: false };
  users.push(newUser);
  
  // 不返回密码
  const { password: pwd, ...userWithoutPassword } = newUser;
  res.status(201).json({ success: true, user: userWithoutPassword });
});

// 添加根路由
app.get('/', (req, res) => {
  res.send('服务器正在运行');
});

// 图片代理路由
app.get('/api/proxy-image', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream'
    });
    
    // 设置正确的内容类型
    res.set('Content-Type', response.headers['content-type']);
    
    // 将图片数据流传递到客户端
    response.data.pipe(res);
  } catch (error) {
    console.error('代理图片失败:', error);
    res.status(404).send('图片获取失败');
  }
});

app.listen(3001, () => {
  console.log('服务器运行在 http://localhost:3001');
}); 