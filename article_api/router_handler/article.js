const db = require('../db/index')

// 发布新文章处理函数
exports.addArticle = (req, res) => {
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数')
    const path = require('path')
    const {cate_id: cate} = {...req.body}
    const cate_id = cate.substring(0, cate.indexOf('|')), cate_name = cate.substring(cate.indexOf('|') + 1)
    const articleInfo = {
        // req的body属性展开导入
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('./uploads', req.file.filename),
        pub_date: new Date(),
        author_id: req.user.id,
        is_delete: 0,
        cate_id: cate_id,
        cate_name: cate_name,
    }
    const sqlStr = 'insert into ev_articles set?'
    db.query(sqlStr, articleInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('发布文章失败!')
        return res.cc('发布文章成功!', 0)
    })
}

// 获取文章列表
exports.getArticle = (req, res) => {
    const {pagenum, pagesize, cate_id, state} = req.query
    const sqlStr = `select * from ev_articles where is_delete=0 limit ?, ?`
    const _sqlStr = `select * from ev_articles where is_delete=0`
    if (cate_id === '' && state === '') {
        db.query(_sqlStr, (err, result) => {
            const total = result.length
            db.query(sqlStr, [Number((pagenum - 1) * pagesize), Number(pagesize)], (err, results) => {
                if (err) return res.cc(err)
                return res.send({
                    status: 0,
                    message: '文章内容如下',
                    data: results,
                    total: total
                })
            })
        })
    } else if (cate_id !== '' && state === '') {
        const sqlStr = 'select * from ev_articles where is_delete=0 and cate_id=?'
        db.query(sqlStr, cate_id, (err, result) => {
            const total = result.length
            const _sqlStr = `select * from ev_articles where is_delete=0 and cate_id=? limit ?, ?`
            db.query(_sqlStr, [cate_id, Number((pagenum - 1) * pagesize), Number(pagesize)], (err, results) => {
                if (err) return res.cc(err)
                return res.send({
                    status: 0,
                    message: '文章内容如下',
                    data: results,
                    total: total
                })
            })
        })
    } else if (state !== '' && state === '') {
        const sqlStr = 'select * from ev_articles where is_delete=0 and state=?'
        db.query(sqlStr, state, (err, result) => {
            const total = result.length
            const _sqlStr = `select * from ev_articles where is_delete=0 and state=? limit ?, ?`
            db.query(_sqlStr, [state, Number((pagenum - 1) * pagesize), Number(pagesize)], (err, results) => {
                if (err) return res.cc(err)
                return res.send({
                    status: 0,
                    message: '文章内容如下',
                    data: results,
                    total: total
                })
            })
        })
    } else {
        const sqlStr = 'select * from ev_articles where is_delete=0 and state=? and cate_id=?'
        db.query(sqlStr, [state, cate_id], (err, result) => {
            const total = result.length
            const _sqlStr = `select * from ev_articles where is_delete=0 and state=? and cate_id=? limit ?, ?`
            db.query(_sqlStr, [state, cate_id, Number((pagenum - 1) * pagesize), Number(pagesize)], (err, results) => {
                if (err) return res.cc(err)
                return res.send({
                    status: 0,
                    message: '文章内容如下',
                    data: results,
                    total: total
                })
            })
        })
    }

}


// 根据id删除文章内容
exports.deleteArtById = (req, res) => {
    // 标记删除，保证安全
    const sqlStr = 'update ev_articles set is_delete=1 where id=?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章失败!')
        return res.cc('删除文章成功!', 0)
    })
}

exports.getArticleById = (req, res) => {
    const sqlStr = 'select * from ev_articles where Id = ?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取文章数据失败!')
        return res.send({
            status: 0,
            message: '获取文章数据成功!',
            data: results[0]
        })
    })
}

exports.updateArticle = (req, res) => {
    const sqlStr = 'select * from ev_articles where id<>? and title=?'
    const cate_id = req.body.cates.substring(0, req.body.cates.indexOf('|')),
        cate_name = req.body.cates.substring(req.body.cates.indexOf('|') + 1)
    const articleInfo = {...req.body, cate_id: cate_id, cate_name: cate_name}
    delete articleInfo.cates
    console.log(articleInfo)
    db.query(sqlStr, [articleInfo.Id, articleInfo.title], (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 1) return res.cc('文章标题已被占用!')
        const sqlUpdate = 'update ev_articles set ? where Id=?'
        db.query(sqlUpdate, [articleInfo, articleInfo.Id], (err, result) => {
            console.log(result)
            if (err) return res.cc(err)
            if (result.affectedRows !== 1) return res.cc('更新文章失败')
            return res.cc('更新文章成功!', 0)
        })
    })
}