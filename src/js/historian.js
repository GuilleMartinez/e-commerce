class HistoryTag {
    constructor(data) {
        this.date = new Date().toLocaleDateString();
        this.time = new Date().toLocaleTimeString();
        this.data = data;
    }

    getHistorial() {
        return {
            time: `${this.date} ${this.time}`,
            data: this.data,
        };
    }
}

class Historian {
    constructor() {
        this.historian = this.getHistory() || [];
    }

    getHistory() {
        return JSON.parse(localStorage.getItem("buy-history-miweb"));
    }

    addNewBuy(newBuy) {
        this.historian.push(newBuy);
    }

    saveHistory() {
        localStorage.setItem("buy-history-miweb", JSON.stringify(this.historian));
    }

    getFullHistory() {
        return this.historian;
    }

    getLastEntry() {
        const [lastEntry] = this.historian.slice(-1);
        return lastEntry;
    }

    createHtmlEntry(entry) {
        if (entry) {
            const details = document.createElement("details");
            const summary = document.createElement("summary");
            const entryList = document.createElement("ul");
            const totalP = document.createElement("p");

            for (const item of entry.data.items) {
                const li = document.createElement("li");

                $(li).text(
                    `${item.product.name} x ${item.count}Kg - $${item.product.hasDiscount
                        ? item.product.discountPrice * item.count
                        : item.product.price * item.count
                    }`
                );

                $(entryList).append(li);
            }

            $(summary).text(`Compra - ${entry.time}`);
            $(totalP).text(`Total: $${entry.data.total}`);
            $(details).append(summary, entryList, totalP);

            return details;
        }
        return false;
    }

    renderLastHistory(jqueryContainer) {
        const lastEntry = this.getLastEntry();
        if (lastEntry) jqueryContainer.append(this.createHtmlEntry(lastEntry));
    }

    renderFullHistorial(jqueryContainer) {
        for (const entry of this.historian) {
            jqueryContainer.append(this.createHtmlEntry(entry));
        }
    }

    removeHistorial() {
        localStorage.clear();
        this.historian = [];
    }
}
