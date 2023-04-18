const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'nmsl4599',
    database: 'test'
})

// 共享数据库连接对象
module.exports = db