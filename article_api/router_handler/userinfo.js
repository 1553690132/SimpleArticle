const db = require('../db/index')
// 定义获取用户信息的路由处理函数

exports.getUserInfo = (req, res) => {
    const sqlStr = 'select id, username, nickname, email, user_pic from ev_users where id=?'
    // req上的user对象属性，是Token解析成功，由express-jwt挂载的
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取用户信息失败!')
        res.send({
            status: 0,
            message: '用户信息获取成功!',
            data: results[0]
        })
    })
}

// 更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
    const sqlStr = 'update ev_users set ? where id=?'
    db.query(sqlStr, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新失败!')
        res.cc('更新成功!', 0)
    })
}

// 重置用户密码的处理函数
exports.updatePassword = (req, res) => {
    console.log()
    const sqlStr = 'select * from ev_users where id=?'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在!')
        // 导入加密中间件
        const bcrypt = require('bcryptjs')
        // 判断输入密码与解密密码是否一致
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误!')
        // 密码正确则进行密码更新
        const sqlUpdate = 'update ev_users set password=? where id=?'
        // 对新输入密码进行加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sqlUpdate, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败')
            return res.cc('更新密码成功', 0)
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    const sqlStr = 'update ev_users set user_pic=? where id=?'
    db.query(sqlStr, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败!')
        return res.cc('更新头像成功!', 0)
    })
} 

