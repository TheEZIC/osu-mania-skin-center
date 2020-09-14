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