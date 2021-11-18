"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDom = void 0;
const path = require("path");
const fs = require("fs");
const version_1 = require("./version");
const vscode = require("vscode");
const cssName = vscode.version >= "1.38" ? 'workbench.desktop.main.css' : 'workbench.main.css';
class FileDom {
    constructor(imagePath, opacity) {
        // 文件路径
        this.filePath = path.join(path.dirname(require.main.filename), 'vs', 'workbench', cssName);
        this.extName = "backgroundCover";
        this.imagePath = '';
        this.imageOpacity = 1;
        this.imagePath = imagePath;
        this.imageOpacity = opacity;
    }
    install() {
        let content = this.getCss().replace(/\s*$/, ''); // 去除末尾空白
        if (content === '') {
            return false;
        }
        // 添加代码到文件中，并尝试删除原来已经添加的
        let newContent = this.getContent();
        newContent = this.clearCssContent(newContent);
        newContent += content;
        this.saveContent(newContent);
        return true;
    }
    getCss() {
        // 重新计算透明度
        let opacity = this.imageOpacity;
        opacity = opacity <= 0.1 ? 0.1 : opacity >= 1 ? 1 : opacity;
        opacity = 0.59 + (0.4 - ((opacity * 4) / 10));
        return `
		/*ext-${this.extName}-start*/
		/*ext.${this.extName}.ver.${version_1.default}*/
		body{
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			opacity:${opacity};
			background-image:url('${this.imagePath}');
		}
		/*ext-${this.extName}-end*/
		`;
    }
    /**
    * 获取文件内容
    * @var mixed
    */
    getContent() {
        return fs.readFileSync(this.filePath, 'utf-8');
    }
    /**
    * 本地图片文件转base64
    * @var mixed
    */
    imageToBase64() {
        try {
            let extname = path.extname(this.imagePath);
            extname = extname.substr(1);
            this.imagePath = fs.readFileSync(path.resolve(this.imagePath)).toString('base64');
            this.imagePath = `data:image/${extname};base64,${this.imagePath}`;
        }
        catch (e) {
            return false;
        }
        return true;
    }
    /**
    * 设置文件内容
    *
    * @private
    * @param {string} content
    */
    saveContent(content) {
        fs.writeFileSync(this.filePath, content, 'utf-8');
    }
    /**
    * 清理已经添加的代码
    *
    * @private
    * @param {string} content
    * @returns {string}
    */
    clearCssContent(content) {
        let re = new RegExp("\\/\\*ext-" + this.extName + "-start\\*\\/[\\s\\S]*?\\/\\*ext-" + this.extName + "-end\\*" + "\\/", "g");
        content = content.replace(re, '');
        content = content.replace(/\s*$/, '');
        return content;
    }
    /**
    * 卸载
    *
    * @private
    */
    uninstall() {
        try {
            let content = this.getContent();
            content = this.clearCssContent(content);
            this.saveContent(content);
            return true;
        }
        catch (ex) {
            //console.log(ex);
            return false;
        }
    }
}
exports.FileDom = FileDom;
//# sourceMappingURL=FileDom.js.map