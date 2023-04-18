/**
 * 定义处理文章的函数供artcate使用
 */

const db = require('../db/index')

// 文章分类处理函数
exports.getArticleCates = (req, res) => {
    const sqlStr = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类列表成功!',
            data: results
        })
    })
}

// 新增文章分类函数
exports.addArticleCates = (req, res) => {
    // 查询分类名称和别名是否已被使用
    const sqlStr = 'select * from ev_article_cate where name=? or alias=?'
    db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 2) return res.cc('分类名和别名均已占用！')
        if (results.length === 1 && req.body.name === results[0].name && req.body.alias === results[0].alias) return res.cc('分类名和别名均被占用!')
        if (results.length === 1 && req.body.name === results[0].name) return res.cc('分类名称已被占用!')
        if (results.length === 1 && req.body.alias === results[0].alias) return res.cc('别名已被占用!')
        // 均未被占用，更新名称
        const sqlUpdate = 'insert into ev_article_cate set ?'
        db.query(sqlUpdate, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增失败！')
            return res.cc('新增成功!', 0)
        })
    })
}

// 根据id删除文章分类函数
exports.deleteCateById = (req, res) => {
    console.log('run')
    // 标记删除，保证安全
    const sqlStr = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除失败!')
        return res.cc('删除成功!', 0)
    })
}

// 根据id获取文章分类数据函数
exports.getCateById = (req, res) => {
    const sqlStr = 'select * from ev_article_cate where id=?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取文章分类失败!')
        return res.send({
            status: 0,
            message: '获取文章分类成功!',
            data: results[0]
        })
    })
}

// 根据id更新文章分类函数
exports.updateCateById = (req, res) => {
    // 判断除此时要修改的文章外的其他文章是否占用用户输入的名字和别名
    const sqlStr = 'select * from ev_article_cate where id<>? and (name=? or alias=?)'
    db.query(sqlStr, [req.body.id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 2) return res.cc('名称和别名被占用!')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('名称或别名被占用')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('名称被占用')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('别名被占用')
        // 未被占用则进行更新操作
        const sqlUpdate = 'update ev_article_cate set ? where id=?'
        db.query(sqlUpdate, [req.body, req.body.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败')
            return res.cc('更新文章分类成功!', 0)
        })
    })
}