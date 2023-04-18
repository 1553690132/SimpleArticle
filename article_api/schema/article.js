const expressJoi = require('@escook/express-joi')
const joi = require('joi')

// 定义检测规则
const title = joi.string().required()
const cate_id = joi.required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()

// Id规则
const id = joi.number().integer().min(1).required()
// 验证规则对象

exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

exports.delete_article_schema = {
    params: {
        id
    }
}