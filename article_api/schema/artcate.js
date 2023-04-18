const joi = require('joi')

// 分类名称规则
const name = joi.string().required()
// 分类别名规则
const alias = joi.string().alphanum().required()
// Id规则
const id = joi.number().integer().min(1).required()

// 增加文章分类的验证规则对象
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

// 删除文章验证规则对象
exports.delete_cate_schema = {
    params: {
        id
    }
}

// 查询文章验证规则对象
exports.get_cate_schema = {
    params: {
        id
    }
}

// 更新文章验证规则对象
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias
    }
}