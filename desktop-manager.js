// 更新时间显示
function updateTime() {
    fetch('/api/time')
        .then(response => response.json())
        .then(data => {
            document.querySelector('#time').textContent = data.timeString;
        })
        .catch(error => {
            console.error('获取时间失败:', error);
        });
}

// 初始加载时更新时间
updateTime();

// 每秒更新一次时间
const timer = setInterval(updateTime, 1000);

// 清理定时器
window.addEventListener('beforeunload', () => {
    clearInterval(timer);
});