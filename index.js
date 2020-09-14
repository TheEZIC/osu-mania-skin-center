(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
module.exports = class Editor {
    constructor(parsed, ratio) {
        return this.edit(parsed, ratio);
    }

    edit(parsed, ratio) {
        for (let header in parsed) {
            if (header.startsWith('Mania')) {
                const { ColumnWidth, ColumnLineWidth } = parsed[header];
                const columnWidthSum = this.calcSum(ColumnWidth);
                const ColumnLineWidthSum = this.calcSum(ColumnLineWidth || 0);

                parsed[header].ColumnStart = Math.floor((480 * ratio - (columnWidthSum + ColumnLineWidthSum)) / 2);
            }
        }

        return parsed;
    }

    calcSum(value) {
        //Try catch block for 1K keymode
        try {
            return +value.split(',').reduce((a, b) => Number(a) + Number(b), 0);
        } catch(e) {
            return +value;
        }
    }
}
},{}],3:[function(require,module,exports){
const fs = require('fs');

const Editor = require('./editor');
const Parser = require('./parser');

class Main {
    constructor() {
        const dragAndDropArea = document.getElementById('dragAndDrop');
        const fileInput = document.getElementById('fileInput');
        const width = document.getElementById('width');
        const height = document.getElementById('height');
        const start = document.getElementById('start');

        dragAndDropArea.addEventListener('dragover', evt => evt.preventDefault());
        dragAndDropArea.addEventListener('drop', evt => {
            evt.preventDefault();
            let { files } = evt.dataTransfer;
            this.processFile(files[0]);
        }, false)

        fileInput.addEventListener('change', () => this.processFile(fileInput.files[0]));

        [width, height].forEach(e => e.addEventListener('change', () => this.updateRatio()));
        start.addEventListener('click', () => this.createSkinIni());
    }

    processFile(file) {
        const FR = new FileReader();
        FR.readAsText(file);
        FR.addEventListener('loadend', () => {
            const parsed = new Parser(FR.result);
            const edited = new Editor(parsed, this.ratio);
            this.skinData = this.dataToString(edited);

            document.querySelector('#dragAndDrop span').innerHTML = edited.General.Name.trim();
        });
    }

    updateRatio() {
        const width = document.getElementById('width').innerHTML;
        const height = document.getElementById('height').innerHTML;
        this.ratio = width / height;
    }

    createSkinIni() {
        const file = new File([this.skinData], 'skin.ini');
        this.download(file);
    }

    download(file) {
        let a = document.createElement('a');
        a.setAttribute('href', URL.createObjectURL(file));
        a.setAttribute('download', 'skin.ini');
        a.click();
    }

    dataToString(data) {
        let arrayData = '';

        for (let header in data) {
            arrayData += `\[${header.replace(/[0-9]+/, '')}\]\n`;
            Object.entries(data[header]).forEach(([key, value]) => arrayData += `${key}: ${value}\n`);
        }

        return arrayData;
    }
}

new Main();
},{"./editor":2,"./parser":4,"fs":1}],4:[function(require,module,exports){
module.exports = class Parser {
    constructor(skin) {
        this.skinData = {};
        this.parse(skin);
        return this.skinData;
    }

    parse(skin) {
        let maniaNumber = 0;

        skin.split('\n').forEach(row => {
            const header = this.getHeader(row);

            if (header) return this.header = header;
            if (!this.header) return null;

            const param = this.getParam(row);
            if (!param) return null;
            const { key, value } = param;

            if(this.header === 'Mania') {
                this.header += maniaNumber;
                maniaNumber++;
            }

            if(!this.skinData[this.header]) 
                this.skinData[this.header] = {};
            
            this.skinData[this.header][key] = value;
        })
    }

    getHeader(row) {
        const regexp = /\[(?<title>[A-Za-z0-9]+)\]/;
        if(!regexp.test(row)) return null;

        let { groups: { title } } = row.match(regexp);
        return title.trim();
    }

    getParam(row) {
        const regexp = /(?<key>[A-Za-z0-9]+):(?<value>.+)/;
        if(!regexp.test(row)) return null;

        let { groups: {key, value} } = row.match(regexp);
        return { 
            key: key.trim(), 
            value: value.trim()
        }
    }
}
},{}]},{},[3]);
