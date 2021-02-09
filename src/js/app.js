const PRODUCTS = {
  list: [],

  findProduct(id) {
    return this.list.find((item) => item.id == id);
  },

  filterProducts(keyword) {
    return this.list.filter((product) => product.keywords.includes(keyword));
  },
};

const CART = new ShoppingCart();
const SHOP_HISTORY = new Historian();

// ----------------------------------------------- //

$.ajax({
  url: "./src/js/database.json",
  type: "GET",
  dataType: "json",
  success: (JSON) => {
    PRODUCTS.list = createProductsList(JSON);
    HTML_PRODUCTS.renderProductsList(PRODUCTS.list);
    SHOP_HISTORY.renderFullHistorial(HTML_HISTORIAL.container);
    HTML_FORM.appendKeywords(PRODUCTS.list);
    successLog("Productos cargados correctamente 😁");
  },
  error: (xhr) =>
    errorLog(`Hubo un error al cargar los datos, Error: ${xhr.statusText} 😟`),
});

// ---------------------------- EVENTOS ------------------------ //

// BOTONES DE MOSTRAR Y CERRAR VENTANAS //
$(".vision-btn").click(showElement);

// AGREGAR PRODUCTOS AL CARRITO //
HTML_PRODUCTS.productsList.click(addItemEvent);

// QUITAR PRODUCTOS DEL CARRITO //
HTML_CART.container.click(removeItemEvent);
HTML_CART.clearBtn.click(clearCartEvent);

// ACTUALIZAR CANTIDADES EN CARRITO //
HTML_CART.cartInfo.click(updateProductEvent);

// REALIZAR PAGO //
HTML_CART.payBtn.click(payEvent);

// BUSQUEDA Y FILTRADO DE PRODUCTOS //
HTML_FORM.searchInput.on("input", filterEvent);
HTML_FORM.form.submit(cancelSubmit);

// ELIMINAR HISTORIAL DE COMPRAS //
HTML_HISTORIAL.removeBtn.click(deleteHistoryEvent);

// ------------------------------------------------------------ //

// ---------------------------- FUNCIONES DE EVENTOS ------------------------ //

function createProductsList(database) {
  const items = [];
  for (const data of database) {
    items.push(new Product(data));
  }
  return items;
}

function addItemEvent(event) {
  const target = $(event.target);
  if (target.hasClass("add-cart-btn")) {
    const productID = Number(target.val());
    const productCount = Number(target.prev().val()) || 1;

    if (CART.itemExists(productID)) {
      const index = CART.searchIndex(productID);
      const item = CART.getItem(index);
      CART.updateItem(index, productCount);
      HTML_CART.updateRow(item.product.id, CART.renderItem(item));
    } else {
      const selectedProduct = PRODUCTS.findProduct(productID);
      CART.addItem(new CartItem(selectedProduct, productCount));
      HTML_CART.insertRow(CART.renderItem(CART.getItem(-1)));
    }

    HTML_CART.updateTable();
  }
}

function removeItemEvent(event) {
  const target = $(event.target);
  if (target.hasClass("remove-btn")) {
    const productID = Number(target.val());
    CART.removeItem(productID);
    HTML_CART.deleteRow(productID);
    HTML_CART.updateTable();
  }
}

function showElement(event) {
  const target = $(event.target);
  const container = $(`${target.val()}`);
  container.toggleClass("invisible animate__slideInDown");
}

function filterEvent(event) {
  event.preventDefault();

  const word = $(event.target).val();
  const filteredProducts = PRODUCTS.filterProducts(word);

  if (filteredProducts.length && word) {
    HTML_PRODUCTS.renderProductsList(filteredProducts);
    HTML_PRODUCTS.isFiltered = true;
  } else if (!word && HTML_PRODUCTS.isFiltered) {
    HTML_PRODUCTS.renderProductsList(PRODUCTS.list);
    HTML_PRODUCTS.isFiltered = false;
  }
}

function updateProductEvent(event) {
  const target = $(event.target);

  if (target.hasClass("update-btn")) {
    const productId = target.parents("tr").attr("id").slice(8);
    const productIndex = CART.searchIndex(productId);
    const product = CART.getItem(productIndex);
    const newValue = Number(target.val());

    if (product.count - 1 > 0 && target.hasClass("decrement-btn")) {
      CART.updateItem(productIndex, product.count - newValue);
    } else if (target.hasClass("increment-btn")) {
      CART.updateItem(productIndex, product.count + newValue);
    }

    HTML_CART.updateRow(productId, CART.renderItem(product));
    HTML_CART.updateTable();
  }
}

function payEvent() {
  if (CART.getItemsCount()) {
    const newHistory = new HistoryTag({
      items: CART.items,
      total: CART.calculateTotal(),
    });

    SHOP_HISTORY.addNewBuy(newHistory.getHistorial());
    SHOP_HISTORY.saveHistory();
    HTML_HISTORIAL.hasChange = true;
    HTML_HISTORIAL.updateHistoryView(SHOP_HISTORY);
    alert("Muchas gracias por su compra! 😊");
    clearCartEvent();
  }
}

function clearCartEvent() {
  CART.removeAll();
  HTML_CART.clearTable();
  HTML_CART.updateTable();
}

function deleteHistoryEvent() {
  SHOP_HISTORY.removeHistorial();
  HTML_HISTORIAL.clearHistory();
}

function cancelSubmit(event) {
  event.preventDefault();
}
// ------------------------------------------------------------ //

// ---------------------------- ANIMACIONES Y LOGS ------------------------ //

function successLog(msg) {
  console.log(
    `%c${msg}`,
    "background-color: #00ff00 ; color: #00; padding: 4px; font-weight: bold;"
  );
}

function errorLog(msg) {
  console.log(
    `%c${msg}`,
    "background-color: #FF9494 ; color: #ff; padding: 4px; font-weight: bold;"
  );
}

function deleteAnimation(element) {
  element.fadeOut("fast", () => element.remove());
}

// ------------------------------------------------------------ //
