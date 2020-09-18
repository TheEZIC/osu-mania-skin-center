const SlimSelect = require('slim-select');
const { data } = require('../resolutions.json');
const Editor = require('./editor');
const Parser = require('./parser');

const dragAndDropArea = document.getElementById('dragAndDrop');
const fileInput = document.getElementById('fileInput');
const resolutions = document.getElementById('resolutions');
const inputs = document.getElementById('inputs');
const toggler = document.getElementById('toggler'); 
const width = document.getElementById('width');
const height = document.getElementById('height');
const start = document.getElementById('start');

new SlimSelect({ select: resolutions, data });
        
const resolutions2 = document.querySelector('.ss-main');

class Main {
    constructor() {
        dragAndDropArea.addEventListener('dragover', evt => evt.preventDefault());
        dragAndDropArea.addEventListener('drop', evt => {
            evt.preventDefault();
            let { files } = evt.dataTransfer;
            this.file = files[0];
            this.processFile();
        }, false)

        fileInput.addEventListener('change', () => {
            this.file = fileInput.files[0];
            this.processFile();
        });

        [width, height].forEach(e => e.addEventListener('change', () => {
            this.updateRatio();
            this.processFile();
        }));

        start.addEventListener('click', () => this.createSkinIni());

        resolutions.addEventListener('change', evt => {
            this.updateSelectRatio(evt.target.value);
            this.processFile();
        });

        toggler.addEventListener('change', evt => {
            if (evt.target.checked) {
                resolutions2.style.display = 'none';
                inputs.style.display = 'flex';
            } else {
                resolutions2.style.display = 'flex';
                inputs.style.display = 'none';
            }
        });
    }

    processFile() {
        const FR = new FileReader();
        FR.readAsText(this.file);
        FR.addEventListener('loadend', () => {
            const parsed = new Parser(FR.result);
            const edited = new Editor(parsed, this.ratio);
            this.skinData = this.dataToString(edited);

            document.querySelector('#dragAndDrop span').innerHTML = edited.General.Name.trim();
        });
    }

    updateRatio() {
        this.ratio = width.value / height.value;
    }

    updateSelectRatio(value) {
        let [w, h] = value.split('x');
        this.ratio = w / h;
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