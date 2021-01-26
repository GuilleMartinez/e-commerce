const HTML_CART = {
    container: $("#cart .container"),
    cartTitle: $("#total-count"),
    cartInfo: $("#cart-info"),
    cartTotal: $("#cart-total"),
    cartCountIcon: $("#items-count-icon"),
    payBtn: $("#pay-btn"),
    clearBtn: $("#delete-all-btn"),

    insertRow(htmlRow) {
        this.cartInfo.append(htmlRow);
    },

    updateRow(rowID, newRow) {
        $(`#product-${rowID}`).replaceWith(newRow);
    },

    deleteRow(rowID) {
        $(`#product-${rowID}`).remove();
    },

    updateTable() {
        this.cartTitle.text(
            `Productos en carrito: ${CART.getItemsCount()}`
        );
        this.cartTotal.text(`Total a pagar: $${CART.calculateTotal()}`);
        this.cartCountIcon.text(CART.getItemsCount());
    },
};

const HTML_PRODUCTS = {
    productsList: $("#products"),
    isFiltered: false,

    renderProductsList(products) {
        // Clear products
        this.productsList.children().remove();

        // Re-render products
        for (const product of products) {
            const li = document.createElement("li");
            li.appendChild(product.renderHTML());
            this.productsList.append(li);
        }
    },
};

const HTML_FORM = {
    form: $("#search-form"),
    searchInput: $("#search-form input[list]"),
    datalist: $("#search-form datalist"),

    prepareKeywords(products) {
        const words = [];
        for (const product of products) {
            words.push(...product.keywords);
        }
        words.sort((a, b) => (a < b ? -1 : 1));
        return new Set(words);
    },

    appendKeywords(words) {
        const keywords = this.prepareKeywords(words);

        for (const word of keywords) {
            const option = document.createElement("option");
            option.value = word;
            this.datalist.append(option);
        }
    },
};


const HTML_HISTORIAL = {
    container: $("#historial .container"),
    hasChange: false,
    
    updateHistoryView(historian) {
        if (this.hasChange) {
            historian.renderLastHistory(...this.container);
            this.hasChange = false;
        }
    }
}