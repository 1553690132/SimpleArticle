const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

// 解析表单数据中间件
// 只能解析 application/x-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// 注册全局响应数据的中间件 为所有的res的send方法封装
app.use((req, res, next) => {
    // status: 0:success 1:fail 默认为 1
    res.cc = (err, status = 1) => {
        res.send({
            status,
            // 状态描述：判断 err是错误对象 or 错误描述字符串
            message: err instanceof Error ? err.message : err
        })
    }
    // 共享res方法至路由
    next()
})

// 导入并注册解析Token的中间件
const config = require('./config')
const expressJWT = require('express-jwt')
// unless指定哪些路由没有访问权限
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//] }))

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入并使用用户信息的模块(请求头需要加Authorization字段)
const userInfoRouter = require('./router/userinfo')
app.use('/my', userInfoRouter)

// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)

// 导入发布文章路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

// 将存放用户封面路径设为静态资源
app.use('./uploads', express.static('./uploads'))

// 定义全局错误的中间件，捕获错误，将错误响应给客户端
const joi = require('joi')
app.use((err, req, res, next) => {
    // 验证失败的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证错误!')
    // 未知错误
    res.cc(err)
})

app.listen(3007, () => console.log('api server running at http://127.0.0.1:3007'))