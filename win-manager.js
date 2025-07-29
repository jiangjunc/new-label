class winbox {
    constructor(title, imgurl, width, height, url, state, color) {
        this.title = title;
        this.imgurl = imgurl;
        this.width = width;
        this.height = height;
        this.url = url;
        this.state = state === "true";
        this.color = color;
    }
}
const folderapp = new winbox("folder", "./img/folder-icon.svg", 1200, 700, "./folder-app.html", false, "#191919");
const vscodeapp = new winbox("vscode", "./img/vscode-icon.svg", 1200, 700, "https://vscode.dev/?vscode-lang=zh-cn", false, "#191919");

const appList = [folderapp, vscodeapp];

document.addEventListener('DOMContentLoaded', function () {
    appList.forEach((app, index) => {
        document.getElementById("footer-box").innerHTML += `
            <div class="app-icon-container">
                <img src="${app.imgurl}" id="${app.title}" class="app-icon">
                <div class="app-icon-dot" id="appicon-dot${index + 1}"></div>
            </div>
        `;
        document.getElementById(app.title).addEventListener("click", function () {
            const appDiv = document.createElement('div');
            appDiv.id = `${app.title}-app`;
            appDiv.innerHTML = `
            <div class="window-header"></div>
            <div id="window-controller">
                <img src="./img/minimize.svg" id="mini" class="winapp-btn">
                <img src="./img/maximize.svg" id="maxi" class="winapp-btn">
                <img src="./img/close.svg" id="close" class="winapp-btn">
            </div>`;
            document.body.appendChild(appDiv);
            document.getElementById(`${app.title}-app`).style.width = `${app.width}px`;
            document.getElementById(`${app.title}-app`).style.height = `${app.height}px`;
            document.getElementById(`${app.title}-app`).style.backgroundColor = `${app.color}`;
            document.getElementById(`${app.title}-app`).style.display = "block";
        });
    });
});