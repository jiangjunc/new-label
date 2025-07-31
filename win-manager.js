document.addEventListener('DOMContentLoaded', () => {
    fetch('app-information.json')
        .then(r => {
            if (!r.ok) throw new Error(`HTTP error! Status: ${r.status}`);
            return r.json();
        })
        .then(({ folder, vscode }) => {
            const dockAppList = [folder];
            const manyuseAppList = [folder , vscode];
            const dockBox = document.getElementById('dockapp-box');
            const manyuseBox = document.getElementById('manyuse-app-box');
            if (!dockBox || !manyuseBox) {
                throw new Error('Required container not found');
            }

            dockBox.insertAdjacentHTML('beforeend', `
                <div id="app-icon-container">
                    <img src="./img/Ubuntu-icon.svg" id="Ubuntu-icon" class="app-icon">
                </div>
            `);
            const startMenu = document.getElementById('start-menu-box');
            startMenu.style.display = 'none';

            dockBox.querySelector('#Ubuntu-icon').addEventListener('click', () => {
                if (startMenu.style.display === 'none' || startMenu.classList.contains('pop-out')) {
                    startMenu.classList.remove('pop-out');
                    startMenu.classList.add('pop-in');
                    startMenu.style.display = 'block';
                } else {
                    startMenu.classList.remove('pop-in');
                    startMenu.classList.add('pop-out');
                    startMenu.addEventListener('animationend', () => {
                        startMenu.style.display = 'none';
                    }, { once: true });
                }
            });

            // dock app
            dockAppList.forEach((app, idx) => {
                dockBox.insertAdjacentHTML('afterbegin', `
                    <div class="app-icon-container">
                        <img src="${app.imgurl}" id="${app.title}" class="app-icon">
                        <div class="app-icon-dot" id="appicon-dot${idx + 1}"></div>
                    </div>
                `);
                dockBox.querySelector(`#${app.title}`).addEventListener('click', () => createAppWindow(app));
            });

            // manyuse app
            manyuseAppList.forEach((app) => {
                manyuseBox.insertAdjacentHTML('beforeend', `
                    <div class="manyuseAppIconBox">
                        <img src="${app.imgurl}" id="${app.title}-many" class="manyuseAppIcon">
                        <p>${app.name}</p>
                    </div>
                `);
                manyuseBox.querySelector(`#${app.title}-many`).addEventListener('click', () => createAppWindow(app));
            });
        })
        .catch(console.error);

    /** 创建应用窗口 */
    function createAppWindow(app) {
        const { title, width, height, color, url } = app;

        const win = document.createElement('div');
        win.id = `${title}-app`;
        win.className = 'app-window';
        Object.assign(win.style, {
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: color,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,.3)'
        });

        // 顶部控制条
        const header = document.createElement('div');
        header.className = 'window-header';
        header.style.height = '30px';
        header.style.background = 'rgba(0,0,0,.2)';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'flex-end';
        header.style.paddingRight = '10px';

        const ctrlTpl = `
        <div id="window-controller">
            <img src="./img/minimize.svg" class="winapp-btn" data-action="minimize">
            <img src="./img/maximize.svg" class="winapp-btn" data-action="maximize">
            <img src="./img/close.svg" class="winapp-btn" data-action="close">
        </div>
        `;
        header.insertAdjacentHTML('beforeend', ctrlTpl);

        // 内容区
        const content = document.createElement('div');
        content.className = 'app-content';
        Object.assign(content.style, {
            width: '100%',
            height: 'calc(100% - 30px)',
            border: 'none'
        });

        // 加载页面
        if (url.startsWith('./')) {
            fetch(url)
                .then(r => r.ok ? r.text() : Promise.reject())
                .then(html => content.innerHTML = html)
                .catch(() => content.innerHTML = '<p style="padding:20px;color:#fff;">加载失败</p>');
        } else {
            const iframe = document.createElement('iframe');
            iframe.src = url;
            Object.assign(iframe.style, { width: '100%', height: '100%', border: 'none' });
            content.appendChild(iframe);
        }

        // 控制按钮事件
        header.addEventListener('click', e => {
            const action = e.target.dataset?.action;
            if (!action) return;

            if (action === 'close') {
                win.remove();
                const dot = document.getElementById(`appicon-dot${dockAppList.findIndex(a => a.title === title) + 1}`);
                if (dot) dot.style.display = 'none';
            } else if (action === 'minimize') {
                win.style.display = 'none';
            } else if (action === 'maximize') {
                const isMax = win.dataset.maximized === 'true';
                if (!isMax) {
                    win.dataset.maximized = 'true';
                    win.dataset.lastWidth = win.style.width;
                    win.dataset.lastHeight = win.style.height;
                    win.style.width = '100vw';
                    win.style.height = '100vh';
                    win.style.top = '0';
                    win.style.left = '0';
                    win.style.transform = 'none';
                    document.getElementById("maxi").src = "./img/minimize2.svg";
                } else {
                    win.dataset.maximized = 'false';
                    win.style.width = win.dataset.lastWidth;
                    win.style.height = win.dataset.lastHeight;
                    win.style.top = '50%';
                    win.style.left = '50%';
                    win.style.transform = 'translate(-50%, -50%)';
                    document.getElementById("maxi").src = "./img/minimize.svg";
                }
            }
        });

        win.appendChild(header);
        win.appendChild(content);
        document.body.appendChild(win);
    }
});
