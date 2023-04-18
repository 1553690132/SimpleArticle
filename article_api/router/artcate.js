const express = require('express')
const router = express.Router()

// 导入处理文章分类函数模块
const artcateHandler = require('../router_handler/artcate')

// 导入验证数据正确的中间件
const expressJoi = require('@escook/express-joi')

// 导入验证规则对象
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

// 查询文章分类
router.get('/cates', artcateHandler.getArticleCates)
// 新增文章分类
router.post('/addcates', expressJoi(add_cate_schema), artcateHandler.addArticleCates)
// id删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcateHandler.deleteCateById)
// id获取文章分类
router.get('/cates/:id', expressJoi(get_cate_schema), artcateHandler.getCateById)
// id更新文章分类
router.post('/updatecate', expressJoi(update_cate_schema), artcateHandler.updateCateById)

module.exports = router