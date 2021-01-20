// Elementos HTML
const HTML_DATALIST = document.getElementById("keywords");
const HTML_FORM = document.getElementById("search-form");

const HTML_CART = {
  container: document.getElementById("bill-container"),
  billPayment: document.getElementById("bill-payment"),
  paymentInfo: document.getElementById("payment-info"),
  paymentTotal: document.getElementById("payment-total"),
  totalCount: document.getElementById("total-count"),
  totalIcon: document.getElementById("items-count-icon"),
  removeAllBtn: document.getElementById("delete-all-btn"),
  payBtn: document.getElementById("pay-btn"),
  showCartBtn: document.getElementById("cart-btn"),
  closeCartBtn: document.getElementById('close-cart-btn'),

  updateRow(rowID, newRow) {
    const oldRow = document.getElementById(rowID);
    oldRow.replaceWith(newRow);
  },

  removeRow(rowID) {
    const tableRow = document.getElementById(rowID);
    tableRow.remove();
  },

  updateTable(shoppingCart) {
    this.totalCount.textContent = `Productos en carrito: ${shoppingCart.getItemsCount()}`;
    this.totalIcon.textContent = shoppingCart.getItemsCount();
    this.paymentTotal.textContent = `Total a pagar: $${shoppingCart.calculateTotal()}`;
  },

  removeAll() {
    this.paymentInfo.textContent = "";
  }
};

const HTML_PRODUCTS = {
  container: document.getElementById("products"),
  isFiltered: false,
};

const HTML_HISTORIAL = {
  container: document.getElementById("historial"),
  historyBtn: document.getElementById("history-btn"),
  closeHistoryBtn: document.getElementById("close-history-btn"),
  hasChange: false,
};

// Objetos principales
const PRODUCTS = createProductsList(DATABASE);
const CART = new ShoppingCart();
const SHOP_HISTORY = new Historian();

// Funciones principales aplicación.
renderProducts(HTML_PRODUCTS, PRODUCTS);
SHOP_HISTORY.renderFullHistorial(HTML_HISTORIAL.container);
setKeywords(PRODUCTS, HTML_DATALIST);

setFormFilters(HTML_FORM, HTML_PRODUCTS, PRODUCTS);
setAddProductEvent(HTML_PRODUCTS, PRODUCTS, CART);

setRemoveProductEvent(HTML_CART);
setClearCartEvent(HTML_CART);
setPayProductsEvent(HTML_CART, CART, SHOP_HISTORY, HTML_HISTORIAL);

setShowEvent(HTML_CART.showCartBtn);
setShowEvent(HTML_CART.closeCartBtn);
setShowEvent(HTML_CART.payBtn);
setShowEvent(HTML_HISTORIAL.historyBtn);
setShowEvent(HTML_HISTORIAL.closeHistoryBtn);


// Creación de lista de productos a partir de JSON.
function createProductsList(JSON) {
  const productsList = [];
  for (data of JSON) {
    const product = new Product(data);
    productsList.push(product);
  }
  productsList.sort((a, b) => (a.category < b.category ? 1 : -1));
  return productsList;
}

// Renderizado de nuestros productos en HTML
function renderProducts(htmlProducts, productsList) {
  htmlProducts.container.textContent = ""; // Para resetear nuestra lista de productos.
  for (product of productsList) {
    const li = document.createElement("li");
    li.appendChild(product.renderHTML());
    htmlProducts.container.appendChild(li);
  }
}

// Renderizar las palabras clave para buscar nuestros productos
function setKeywords(productList, htmlDatalist) {
  const words = prepareKeywords(productList);
  renderKeywords(words, htmlDatalist);

  function prepareKeywords(array) {
    const words = [];
    for (element of array) {
      words.push(...element.keywords);
    }
    words.sort((a, b) => (a < b ? -1 : 1));
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

// Renderizar el filtro del forumlario de búsqueda
function setFormFilters(htmlForm, htmlList, productList) {
  htmlForm.oninput = filterbyKey;
  htmlForm.onsubmit = () => false;

  function filterbyKey(event) {
    if (event.target.name === "product-filter") {
      const keyword = event.target.value;
      const filteredProducts = PRODUCTS.filter((item) =>
        item.keywords.includes(keyword)
      );

      if (filteredProducts.length) {
        renderProducts(htmlList, filteredProducts);
        htmlList.isFiltered = true;
      } else if (!keyword && htmlList.isFiltered) {
        htmlList.isFiltered = false;
        renderProducts(htmlList, productList);
      }
    }
  }
}

// Agregar un producto al carrito
function setAddProductEvent(htmlCart, productsList, shoppingCart) {
  htmlCart.container.addEventListener("click", addProduct);

  function addProduct(e) {
    if (e.target.className.includes("add-cart-btn")) {
      const count = Number(e.target.previousSibling.value);
      const productID = Number(e.target.value);
      const index = shoppingCart.searchItem(productID);

      if (index < 0) {
        const product = productsList.find((item) => item.id === productID);
        shoppingCart.addItem(new CartItem(product, count));
        itemRow = shoppingCart.renderItem(shoppingCart.getItem(-1));
        HTML_CART.paymentInfo.appendChild(itemRow);
      } else {
        const cartItem = shoppingCart.getItem(index);
        const rowID = `product-${cartItem.product.id}`;
        shoppingCart.updateItem(index, count);
        HTML_CART.updateRow(rowID, shoppingCart.renderItem(cartItem));
      }
      HTML_CART.updateTable(shoppingCart);
    }
  }
}

// Remover un producto del carrito
function setRemoveProductEvent(htmlCart) {
  htmlCart.billPayment.addEventListener("click", removeProduct);

  function removeProduct(e) {
    if (e.target.className.includes("remove-btn")) {
      const productId = Number(e.target.value);
      const rowID = `product-${productId}`;
      CART.removeItem(productId);
      HTML_CART.removeRow(rowID);
      HTML_CART.updateTable(CART);
    }
  }
}

// Borrar todos los elementos del carrito de compras
function setClearCartEvent(htmlCart) {
  htmlCart.removeAllBtn.addEventListener("click", clearCart);
}

// Realizar pago de productos
function setPayProductsEvent(
  htmlCart,
  shoppingCart,
  shopHistory,
  htmlHistorial
) {
  htmlCart.payBtn.addEventListener("click", savePayment);

  function savePayment() {
    if (shoppingCart.getItemsCount() > 0) {
      const newHistory = new HistoryTag({
        items: shoppingCart.items,
        total: shoppingCart.calculateTotal(),
      });

      shopHistory.addNewBuy(newHistory.getHistorial());
      shopHistory.saveHistory();
      htmlHistorial.hasChange = true;
      clearCart();
      updateHistoryView(htmlHistorial, shopHistory);
      console.log("Compra realizada: ", newHistory.time);
      alert("Muchas gracias por su compra!");
    }
  }
}

// Renderizado de Historial de Compras en HTML
function setShowEvent(htmlButton) {
  htmlButton.addEventListener("click", showElement);
}

// Funciones Universales

// Vaciar Carrito de Compras
function clearCart() {
  CART.removeAll();
  HTML_CART.removeAll();
  HTML_CART.updateTable(CART);
}

// Actualizar ventana de Historial
function updateHistoryView(domHistorial, historian) {
  if (domHistorial.hasChange) {
    historian.renderLastHistory(domHistorial.container);
    domHistorial.hasChange = false;
  }
}


function showElement(event) {
  const element = document.getElementById(event.target.value);
  element.classList.toggle("visible");
}