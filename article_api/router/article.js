const express = require('express')
const router = express.Router()

// 导入解析formdata格式的npm包
const multer = require('multer')
// 导入处理路径的模块
const path = require('path')
// 创建multer的实例对象，提供 dest指定路径
const upload = multer({dest: path.join(__dirname, '../uploads')})
// 导入处理文章函数模块
const articleHandler = require('../router_handler/article')
// 导入验证数据正确性中间件
const expressJoi = require('@escook/express-joi')
// 导入规则对象
const {add_article_schema} = require('../schema/article')


// 发布新文章路由
// upload.single作为局部生效的中间件，用来解析FormData格式的表单数据
// 将新增文件挂载至req.file上，新增文章挂载至req.body上
// multer先进行formdata数据检验，expressjoi再进行规则检测
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), articleHandler.addArticle)
// 获取文章列表
router.get('/list', articleHandler.getArticle)
// 根据id删除文章数据
router.get('/delete/:id', articleHandler.deleteArtById)
// 根据id获取文章数据
router.get('/detail/:id', articleHandler.getArticleById)
// 更新文章内容
router.post('/updateArticle', articleHandler.updateArticle)

module.exports = router