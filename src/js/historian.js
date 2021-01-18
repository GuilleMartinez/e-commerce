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
            const totalSpan = document.createElement("span");

            for (const item of entry.data.items) {
                const li = document.createElement("li");
                li.textContent = `${item.product.name} x ${item.count}Kg - $${item.product.hasDiscount
                    ? item.product.discountPrice * item.count
                    : item.product.price * item.count
                    }`;
                entryList.appendChild(li);
            }

            summary.textContent = `Compra realizada - ${entry.time}`;
            totalSpan.textContent = `Total: $${entry.data.total}`;
            details.appendChild(summary);
            details.appendChild(entryList);
            details.appendChild(totalSpan);

            return details;
        }
        return false;
    }

    renderLastHistory(htmlcontainer) {
        const lastEntry = this.getLastEntry();
        if (lastEntry) htmlcontainer.appendChild(this.createHtmlEntry(lastEntry));
    }


    renderFullHistorial(htmlcontainer) {
        for (const entry of this.historian) {
            htmlcontainer.appendChild(this.createHtmlEntry(entry));
        }
    }

}

