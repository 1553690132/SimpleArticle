/**
 * 定义和用户相关的路由处理函数，供/router/user.js使用
 */
const db = require('../db/index')

// 导入加密中间件
const bcrypt = require('bcryptjs')

// 导入生成Token包
const jwt = require('jsonwebtoken')

// 导入密钥
const config = require('../config')

// 注册的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的数据
    const userInfo = req.body
    const username = userInfo.username
    let password = userInfo.password

    const sqlSelect = 'select * from ev_users where username=?'
    db.query(sqlSelect, username, (err, results) => {
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 用户名已被占用
        if (results.length !== 0) {
            // return res.send({ status: 1, message: '用户名已被占用!' })
            return res.cc('用户名已被占用!')
        }

        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        password = bcrypt.hashSync(password, 10)

        // 用户名可用 执行后续操作
        const sqlInsert = 'insert into ev_users(username, password) values(?, ?)'
        db.query(sqlInsert, [username, password], (err, results) => {
            if (err) {
                // return res.send({ status: 1, message: err.message })
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册失败!' })
                return res.cc('注册失败')
            }
            // return res.send({ status: 0, message: '注册成功!' })
            return res.cc('注册成功', 0)
        })
    })
}

// 登录的处理函数
exports.login = (req, res) => {
    // 获取登录输入数据
    console.log(123)
    const userInfo = req.body
    const sqlSelect = 'select * from ev_users where username=?'

    return db.query(sqlSelect, userInfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户名错误!')
        // 判断密码是否一致 bcrypt的compareSync方法解码比较
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('登录失败!')
        }
        // 登录成功，生成Token字符串响应给客户端
        // 展开查询对象，对敏感的数据：密码和头像清空，提高Token安全性
        const user = {...results[0], password: '', user_pic: ''}
        // 调用jwt的sign方法生成Token字符串(加密对象，密钥，有效期)
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
        return res.send({
            status: 0,
            message: '登录成功!',
            // 方便客户端使用Token，加Bearer前缀
            token: 'Bearer ' + tokenStr
        })
    })
}