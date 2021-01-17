// Elementos HTML
const HTML_PRODUCTS = document.getElementById("products");
const HTML_DATALIST = document.getElementById("keywords");
const HTML_FORM = document.getElementById("search-form");
const HTML_HISTORY_BTN = document.getElementById("history-btn");

const HTML_CART = {
  billPayment: document.getElementById("bill-payment"),
  paymentInfo: document.getElementById("payment-info"),
  paymentTotal: document.getElementById("payment-total"),
  totalCount: document.getElementById("total-count"),
  totalIcon: document.getElementById("items-count-icon"),
  removeAllBtn: document.getElementById("delete-all-btn"),
  payBtn: document.getElementById("pay-btn"),
};

const HTML_HISTORIAL = {
  container: document.getElementById("historial"),
  isOpen: false,
};

// Objetos principales
const PRODUCTS = createProductsList(DATABASE);
const CART = new ShoppingCart(HTML_CART);
const SHOP_HISTORY = new Historian();

// Funciones principales de nuestra aplicación.
renderProducts(HTML_PRODUCTS, PRODUCTS);
setKeywords(PRODUCTS, HTML_DATALIST);
setFormFilters(HTML_FORM, HTML_PRODUCTS, PRODUCTS);
setAddProductEvent(HTML_PRODUCTS, PRODUCTS, CART);
setRemoveProductEvent(HTML_CART, CART);
setClearCartEvent(HTML_CART);
setPayProductsEvent(HTML_CART, CART, SHOP_HISTORY, HTML_HISTORIAL);
setHistoryEvent(HTML_HISTORY_BTN, SHOP_HISTORY, HTML_HISTORIAL);

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
function renderProducts(domList, productsList) {
  domList.textContent = ""; // Para resetear nuestra lista de productos.
  for (product of productsList) {
    const li = document.createElement("li");
    li.appendChild(product.renderHTML());
    domList.appendChild(li);
  }
}

// Renderizar las palabras clave para buscar nuestros productos
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

// Renderizar el filtro del forumlario de búsqueda
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

// Agregar un producto al carrito
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

// Remover un producto del carrito
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

// Borrar todos los elementos del carrito de compras
function setClearCartEvent(domCart) {
  domCart.removeAllBtn.onclick = clearCart;
}

// Realizar pago de productos
function setPayProductsEvent(domCart, shoppingCart, shopHistory, domHistorial) {
  domCart.payBtn.onclick = savePayment;

  function savePayment() {
    if (shoppingCart.getItemsCount() > 0) {

      const newHistory = new HistoryTag({
        items: shoppingCart.items,
        total: shoppingCart.calculateTotal(),
      });

      shopHistory.addNewBuy(newHistory.getHistorial());
      shopHistory.saveHistory();
      clearCart();
      updateHistoryView(domHistorial, shopHistory);
      console.log("Compra realizada: ", newHistory.time);
    }

  }
}

// Renderizado de Historial de Compras en HTML
function setHistoryEvent(htmlButton, shopHistory, domHistorial) {
  htmlButton.onclick = showHistory;

  function showHistory() {
    domHistorial.container.textContent = "";
    domHistorial.container.classList.toggle("visible");
    domHistorial.isOpen = !domHistorial.isOpen;
    updateHistoryView(domHistorial, shopHistory);
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
  if (domHistorial.isOpen) historian.renderHistory(domHistorial.container);
}
