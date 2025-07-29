const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8888;

app.use('/', express.static('./'));

app.get('/', (req, res) => {
    fs.readFile('index.html', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.send(data);
        }
    });
});

// 添加获取时间API
app.get('/api/time', (req, res) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    res.json({
        timeString: `${month}月${day}日   ${hours} : ${minutes}`
    });
});

app.listen(port, () => {
    console.log('某服务已启动');
    console.log(`服务器已在${port}号端口启动访问地址: http://localhost:${port}`);
});