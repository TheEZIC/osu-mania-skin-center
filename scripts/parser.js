module.exports = class Parser {
    constructor(skin) {
        this.skinData = {};
        this.parse(skin);
        return this.skinData;
    }

    parse(skin) {
        let maniaNumber = 0;

        skin.split('\n').forEach(row => {
            if(row.trim().startsWith('//')) return null;
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