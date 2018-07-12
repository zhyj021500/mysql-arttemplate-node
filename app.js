let http = require('http');
let path = require('path');
let queryString = require('querystring');
let fs = require('fs');
let template = require('art-template');
let mime = require('mime');
let mysql = require('mysql');
//设置根目录
let rootPath = path.join(__dirname, 'www');
http.createServer((request, response) => {
    //设置完整路径 对URL解码
    let filePath = path.join(rootPath, queryString.unescape(request.url));
    //console.log(filePath);
    if (filePath.indexOf('index.html') != -1) {
        //链接数据库
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'test'
        });
        connection.connect();
        connection.query('select*from manyhero', function (error, results, fields) {
            if (error) throw error;
            // 把数据通过模板引擎进行渲染
           // console.log(results);
            //模版引擎
            var html = template(__dirname + '/www/index.html', {
                results
            });
            //返回
            response.end(html);
        });
        //
        connection.end();

    } else {

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log('404');

            } else {
                response.writeHead(200, {
                    'content-type': mime.getType(filePath)
                });
                response.end(data);
            }
        });
    }
}).listen(80, '127.0.0.1', () => {
    console.log('监听');

});