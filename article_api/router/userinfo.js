/**
 * 获取用户信息的模块
 */

const express = require('express')
const router = express.Router()
const userInfoHandler = require('../router_handler/userinfo')

// 导入验证表单合法性的中间件
const expressJoi = require('@escook/express-joi')
// 导入规则对象
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

// 获取用户信息
router.get('/userinfo', userInfoHandler.getUserInfo)
// 修改用户信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userInfoHandler.updateUserInfo)
// 重置用户密码
router.post('/updatepwd', expressJoi(update_password_schema), userInfoHandler.updatePassword)
// 更新用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userInfoHandler.updateAvatar)

module.exports = router