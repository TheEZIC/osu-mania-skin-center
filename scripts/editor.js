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
                console.log(columnWidthSum, ColumnLineWidthSum, ratio)

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