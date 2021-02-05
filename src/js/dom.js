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
    const element = $(`#product-${rowID}`);
    deleteAnimation(element);
  },

  updateTable() {
    this.cartTitle.text(`Productos: ${CART.getItemsCount()}`);
    this.cartTotal.text(`Total a pagar: $${CART.calculateTotal()}`);
    this.cartCountIcon.text(CART.getItemsCount());
    this.animateIcon();
  },

  animateIcon() {
    if (CART.getItemsCount()) {
      this.cartCountIcon.addClass(
        "animate__animated animate__heartBeat animate__infinite"
      );
    } else {
      this.cartCountIcon.removeClass(
        "animate__animated animate__heartBeat animate__infinite"
      );
    }
  },

  clearTable() {
    children = this.cartInfo.children();
    deleteAnimation(children);
  },
};

const HTML_PRODUCTS = {
  productsList: $("#products"),
  isFiltered: false,

  renderProductsList(products) {
    // Vaciado de productos
    this.clearProducts();

    // Creacion de Productos en HTML
    for (const product of products) {
      const li = document.createElement("li");
      $(li).append(product.renderHTML());
      this.productsList.append(li);
    }
  },

  clearProducts() {
    this.productsList.children().remove();
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
    return new Set(words);
  },

  appendKeywords(words) {
    const keywords = this.prepareKeywords(words);

    for (const word of keywords) {
      const option = document.createElement("option");
      $(option).prop("value", word);
      this.datalist.append(option);
    }
  },
};

const HTML_HISTORIAL = {
  container: $("#historial .container"),
  removeBtn: $("#delete-history-btn"),
  hasChange: false,

  updateHistoryView(historian) {
    if (this.hasChange) {
      historian.renderLastHistory(...this.container);
      this.hasChange = false;
    }
  },

  clearHistory() {
    const details = this.container.children("details")
    deleteAnimation(details);
  }
};
