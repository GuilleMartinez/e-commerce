class Historian {
    constructor() {
        this.buyHistory = this.getHistory() || [];
    }

    getHistory() {
        console.log(JSON.parse(localStorage.getItem('buy-history-miweb')));
    }

    addNewBuy(newBuy) {
        this.buyHistory.push(newBuy);
    }

    saveHistory() {
        localStorage.setItem('buy-history-miweb', JSON.stringify(this.buyHistory));
    }


}