class HistoryTag {
    constructor(data) {
        this.date = new Date().toLocaleDateString();
        this.time = new Date().toLocaleTimeString();
        this.data = data;
    }

    getHistorial () {
        return {
            time: `${this.date} ${this.time}`,
            data: this.data
        }
    }

}

class Historian {
    constructor() {
        this.historian = this.getHistory() || [];
    }

    getHistory() {
        return JSON.parse(localStorage.getItem('buy-history-miweb'));
    }

    addNewBuy(newBuy) {
        this.historian.push(newBuy);
    }

    saveHistory() {
        localStorage.setItem('buy-history-miweb', JSON.stringify(this.historian));
    }


}