const HTML_PRODUCTS = document.getElementById("products");
const HTML_DATALIST = document.getElementById("keywords");
const HTML_FORM = document.getElementById("search-form");
const HTML_HISTORY_BTN = document.getElementById("history-btn");
const HTML_HISTORIAL = document.getElementById("historial");

const HTML_CART = {
  billPayment: document.getElementById("bill-payment"),
  paymentInfo: document.getElementById("payment-info"),
  paymentTotal: document.getElementById("payment-total"),
  totalCount: document.getElementById("total-count"),
  totalIcon: document.getElementById("items-count-icon"),
  removeAllBtn: document.getElementById("delete-all-btn"),
  payBtn: document.getElementById("pay-btn"),
};

const PRODUCTS = createProductsList(DATABASE);
const CART = new ShoppingCart(HTML_CART);
const SHOP_HISTORY = new Historian();

renderProducts(HTML_PRODUCTS, PRODUCTS);
setKeywords(PRODUCTS, HTML_DATALIST);
setFormFilters(HTML_FORM, HTML_PRODUCTS, PRODUCTS);
setAddProductEvent(HTML_PRODUCTS, PRODUCTS, CART);
setRemoveProductEvent(HTML_CART, CART);
setClearCartEvent(HTML_CART, CART);
setPayProductsEvent(HTML_CART, CART, SHOP_HISTORY);
setHistoryEvent(HTML_HISTORY_BTN, SHOP_HISTORY);

function createProductsList(JSON) {
  const productsList = [];
  for (data of JSON) {
    const product = new Product(data);
    productsList.push(product);
  }
  productsList.sort((a, b) => a.name > b.name);
  return productsList;
}

function renderProducts(domList, productsList) {
  domList.textContent = ""; // Remove all the elements of the list

  for (product of productsList) {
    const li = document.createElement("li");
    li.appendChild(product.renderHTML());
    domList.appendChild(li);
  }
}

function setKeywords(productList, domDatalist) {
  const words = prepareKeywords(productList);
  renderKeywords(words, domDatalist);

  function prepareKeywords(array) {
    const words = [];
    for (element of array) {
      words.push(...element.keywords);
    }
    return new Set(words);
  }

  function renderKeywords(words, datalist) {
    for (word of words) {
      const option = document.createElement("option");
      option.value = word;
      datalist.appendChild(option);
    }
  }
}

function setFormFilters(domForm, domList, productList) {
  domForm.oninput = filterbyKey;
  domForm.onsubmit = () => false;

  function filterbyKey(event) {
    if (event.target.name === "product-filter") {
      const keyword = event.target.value;
      const filteredProducts = PRODUCTS.filter((item) =>
        item.keywords.includes(keyword)
      );

      if (filteredProducts.length) {
        renderProducts(domList, filteredProducts);
      } else {
        renderProducts(domList, productList);
      }
    }
  }
}

function setAddProductEvent(domList, productsList, shoppingCart) {
  domList.onclick = addProduct;

  function addProduct(e) {
    if (e.target.className.includes("add-cart-btn")) {
      const count = Number(e.target.previousSibling.value);
      const productID = Number(e.target.value);
      const product = productsList.find((item) => item.id === productID);
      shoppingCart.addItem(new CartItem(product, count));
      shoppingCart.renderHTML(HTML_CART);
    }
  }
}

function setRemoveProductEvent(domCart, shoppingCart) {
  domCart.billPayment.onclick = removeProduct;

  function removeProduct(e) {
    if (e.target.className.includes("remove-btn")) {
      const productId = Number(e.target.value);
      shoppingCart.removeItem(productId);
      shoppingCart.renderHTML(domCart);
    }
  }
}

function setClearCartEvent(domCart) {
  domCart.removeAllBtn.onclick = clearCart;
}

function setPayProductsEvent(domCart, shoppingCart, historian) {
  domCart.payBtn.onclick = savePayment;

  function savePayment() {

    if (shoppingCart.getItemsCount() > 0) {
      const newHistory = new HistoryTag({
        items: shoppingCart.items,
        total: shoppingCart.calculateTotal(),
      });
      historian.addNewBuy(newHistory.getHistorial());
      historian.saveHistory();
      clearCart();
      console.log('Compra realizada: ', newHistory.time)
    }

  }
}

function clearCart() {
  HTML_CART.paymentInfo.textContent = "";
  CART.removeAll();
  CART.renderHTML(HTML_CART);
}

function setHistoryEvent(htmlButton, shopHistory) {
  htmlButton.onclick = showHistory;

  function showHistory() {
    HTML_HISTORIAL.textContent = "";
    for (entry of shopHistory.historian) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const entryList = document.createElement('ul');
      const totalSpan = document.createElement('span');

      for (item of entry.data.items) {
        const li = document.createElement('li');
        li.textContent = `${item.product.name} x ${item.count}Kg - $${item.product.price * item.count}`;
        entryList.appendChild(li);
      }

      summary.textContent = `${entry.time}`;
      totalSpan.textContent = `Total: $${entry.data.total}`;
      details.appendChild(summary);
      details.appendChild(entryList);
      details.appendChild(totalSpan);
      HTML_HISTORIAL.appendChild(details);
    }
  }
}
