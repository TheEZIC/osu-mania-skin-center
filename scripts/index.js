const SlimSelect = require('slim-select');
const { data } = require('../resolutions.json');
const Editor = require('./editor');
const Parser = require('./parser');

class Main {
    constructor() {
        const dragAndDropArea = document.getElementById('dragAndDrop');
        const fileInput = document.getElementById('fileInput');
        const resolutions = document.getElementById('resolutions');
        const inputs = document.getElementById('inputs');
        const toggler = document.getElementById('toggler'); 
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

        new SlimSelect({ select: resolutions, data });

        const resolutions2 = document.querySelector('.ss-main'); 

        resolutions.addEventListener('change', evt => this.updateSelectRatio(evt.target.value));
        toggler.addEventListener('change', evt => {
            if (evt.target.checked) {
                resolutions2.style.display = 'none';
                inputs.style.display = 'flex';
            } else {
                resolutions2.style.display = 'flex';
                inputs.style.display = 'none';
            }
        })
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

    updateSelectRatio(value) {
        let [width, height] = value.split('x');
        this.ratio = width / height;
        console.log(this.ratio)
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