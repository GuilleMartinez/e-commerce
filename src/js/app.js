// Elementos HTML
const HTML_DATALIST = document.getElementById("keywords");
const HTML_FORM = document.getElementById("search-form");
const HTML_HISTORY_BTN = document.getElementById("history-btn");
const HTML_CART_BTN = document.getElementById("cart-btn");

const HTML_CART = {
  container: document.getElementById("bill-container"),
  billPayment: document.getElementById("bill-payment"),
  paymentInfo: document.getElementById("payment-info"),
  paymentTotal: document.getElementById("payment-total"),
  totalCount: document.getElementById("total-count"),
  totalIcon: document.getElementById("items-count-icon"),
  removeAllBtn: document.getElementById("delete-all-btn"),
  payBtn: document.getElementById("pay-btn"),
  hasNewItem: false
};

const HTML_PRODUCTS = {
  container: document.getElementById("products"),
  isFiltered: false,
};

const HTML_HISTORIAL = {
  container: document.getElementById("historial"),
  isOpen: false,
  hasChange: false,
};

// Objetos principales
const PRODUCTS = createProductsList(DATABASE);
const CART = new ShoppingCart(HTML_CART);
const SHOP_HISTORY = new Historian();

// Funciones principales de nuestra aplicación.
renderProducts(HTML_PRODUCTS, PRODUCTS);
SHOP_HISTORY.renderFullHistorial(HTML_HISTORIAL.container);
setKeywords(PRODUCTS, HTML_DATALIST);
setFormFilters(HTML_FORM, HTML_PRODUCTS, PRODUCTS);
setAddProductEvent(HTML_PRODUCTS, PRODUCTS, CART);
setRemoveProductEvent(HTML_CART, CART);
setClearCartEvent(HTML_CART);
setPayProductsEvent(HTML_CART, CART, SHOP_HISTORY, HTML_HISTORIAL);
setShowHistoryEvent(HTML_HISTORY_BTN);
setShowCartEvent(HTML_CART_BTN);

// Creación de lista de productos a partir de JSON.
function createProductsList(JSON) {
  const productsList = [];
  for (data of JSON) {
    const product = new Product(data);
    productsList.push(product);
  }
  productsList.sort((a, b) => a.name > b.name);
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
function setAddProductEvent(htmlList, productsList, shoppingCart) {
  htmlList.container.onclick = addProduct;

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

// Remover un producto del carrito
function setRemoveProductEvent(htmlCart, shoppingCart) {
  htmlCart.billPayment.onclick = removeProduct;

  function removeProduct(e) {
    if (e.target.className.includes("remove-btn")) {
      const productId = Number(e.target.value);
      shoppingCart.removeItem(productId);
      shoppingCart.renderHTML(htmlCart);
    }
  }
}

// Borrar todos los elementos del carrito de compras
function setClearCartEvent(htmlCart) {
  htmlCart.removeAllBtn.onclick = clearCart;
}

// Realizar pago de productos
function setPayProductsEvent(
  htmlCart,
  shoppingCart,
  shopHistory,
  htmlHistorial
) {
  htmlCart.payBtn.onclick = savePayment;

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
    }
  }
}

// Renderizado de Historial de Compras en HTML
function setShowHistoryEvent(htmlButton) {
  htmlButton.onclick = showHistory;

  function showHistory() {
    HTML_HISTORIAL.container.classList.toggle("visible");
    HTML_HISTORIAL.isOpen = !HTML_HISTORIAL.isOpen;
  }
}

function setShowCartEvent(htmlButton) {
  htmlButton.onclick = showCart;

  function showCart() {
    HTML_CART.container.classList.toggle('visible');
  }
}

// Funciones Universales

// Vaciar Carrito de Compras
function clearCart() {
  HTML_CART.paymentInfo.textContent = "";
  CART.removeAll();
  CART.renderHTML(HTML_CART);
}

// Actualizar ventana de Historial
function updateHistoryView(domHistorial, historian) {
  if (domHistorial.hasChange && domHistorial.isOpen) {
    historian.renderLastHistory(domHistorial.container);
    domHistorial.hasChange = false;
  }
}
