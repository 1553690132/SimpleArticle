/**
 * 定义验证规则:
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

const joi = require('joi')

// 用户名验证规则
const username = joi.string().alphanum().min(1).max(10).required()
// 密码验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
// id验证规则
const id = joi.number().integer().min(1).required()
// 昵称验证规则
const nickname = joi.string().required()
// 邮箱验证规则
const email = joi.string().email().required()
// 头像验证规则
const avatar = joi.string().dataUri().required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}

// 更新用户信息的规则对象
exports.update_userinfo_schema = {
    // 对req.body的数据进行验证
    body: {
        id,
        nickname,
        email
    }
}

// 更新用户密码规则对象
exports.update_password_schema = {
    body: {
        // 使用password规则，验证req.body.oldPwd的值
        oldPwd: password,
        // 使用joi.not(joi.ref('oldPwd')).concat(password)验证newPwd的值
        // 1.joi.ref('oldPwd)代表newPwd的值必须和oldPwd保持一致
        // 2.joi.not(joi.ref('oldPwd'))代表newPwd的值不能和oldPwd的值一致
        // 3. .concat()用于和并joi.not(joi.ref('oldPwd'))和password这两条规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

// 更新用户头像的规则对象
exports.update_avatar_schema = {
    body: {
        avatar
    }
}