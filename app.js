const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const cookieParser = require('cookie-parser');
const app = express();
const port = 9999;

app.use('/', express.static('./'));
app.use(express.json());

app.get('/', (req, res) => {
    fs.readFile('label.html', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.send(data);
        }
    });
});

app.get('/api/lunar', (req, res) => {
    const dateStr = req.query.date;
    if (!dateStr) {
        return res.status(400).json({ error: 'Missing date parameter' });
    }
    
    try {
        const date = new Date(dateStr);
        const lunar = getLunarDate(date);
        res.json(lunar);
    } catch (e) {
        res.status(400).json({ error: 'Invalid date format' });
    }
});

function getLunarDate(date) {
    const lunarInfo = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06560, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x1b255, 0x06d20, 0x0ada0
    ];

    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let lunarYear = 1900;
    let lunarMonth = 1;
    let lunarDay = 1;

    let days = 0;
    for (let i = 1900; i < year; i++) {
        days += getYearDays(i);
    }
    for (let i = 1; i < month; i++) {
        days += getMonthDays(year, i);
    }
    days += day - 1;

    let lunarDaysCount = 0;
    for (let i = 0; i < lunarInfo.length; i++) {
        lunarDaysCount += getYearDays(1900 + i);
        if (lunarDaysCount > days) {
            lunarYear = 1900 + i;
            break;
        }
    }

    let isLeap = false;
    let lunarDaysInMonth = 0;
    for (let i = 1; i <= 12; i++) {
        lunarDaysInMonth = getMonthDays(lunarYear, i);
        if (lunarDaysCount + lunarDaysInMonth > days) {
            lunarMonth = i;
            break;
        }
        lunarDaysCount += lunarDaysInMonth;
        if (lunarInfo[lunarYear - 1900] & (0x10000 >> i)) {
            isLeap = true;
            lunarDaysInMonth = getMonthDays(lunarYear, i + 1);
            if (lunarDaysCount + lunarDaysInMonth > days) {
                lunarMonth = i;
                break;
            }
            lunarDaysCount += lunarDaysInMonth;
        }
    }

    lunarDay = days - lunarDaysCount + 1;

    function getYearDays(year) {
        let days = 0;
        for (let i = 1; i <= 12; i++) {
            days += getMonthDays(year, i);
        }
        return days;
    }

    function getMonthDays(year, month) {
        return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }

    return {
        year: lunarYear,
        month: isLeap ? '闰' + lunarMonths[lunarMonth - 1] : lunarMonths[lunarMonth - 1],
        day: lunarDays[lunarDay - 1]
    };
}

app.listen(port, () => {
    console.log('浏览器服务已启动');
    console.log(`服务器已在${port}号端口启动访问地址: http://localhost:${port}`);
});