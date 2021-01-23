const PRODUCTS = {
  list: createProductsList(DATABASE),

  findProduct(id) {
    return this.list.find(item => item.id == id);
  }
}

const CART = new ShoppingCart();
const SHOP_HISTORY = new Historian();

// ----------------------------------------------- // 

// --- RENDERIZADO HTML --- //
SHOP_HISTORY.renderFullHistorial(HTML_HISTORIAL.container);
HTML_FORM.appendKeywords(PRODUCTS.list);
HTML_PRODUCTS.renderProductsList(PRODUCTS.list);

// ----------------------------------------------- // 

// ---- SETEO DE EVENTOS --- // 

// BOTONES DE MOSTRAR Y CERRAR VENTANAS
$(".vision-btn").click(showElement);

// AGREGAR PRODUCTOS AL CARRITO
HTML_PRODUCTS.productsList.click(addItemEvent);

// ABM DE PRODUCTOS EN CARRITO
HTML_CART.container.click(removeItemEvent);
HTML_CART.clearBtn.click(clearCartEvent);
HTML_CART.payBtn.click(payEvent);

// BUSQUEDA Y FILTRADO DE PRODUCTOS
HTML_FORM.searchInput.on("input", filterProducts);
HTML_FORM.form.submit(filterProducts);

// ----------------------------------------------- // 

function createProductsList(database) {
  const items = [];
  for (const data of database) {
    items.push(new Product(data));
  }
  items.sort((a, b) => (a.category < b.category ? -1 : 1));
  return items;
}


function addItemEvent(event) {
  const target = $(event.target);
  if (target.hasClass('add-cart-btn')) {

    const productID = Number(target.val());
    const productCount = Number(target.prev().val());

    if (CART.itemExists(productID)) {
      const index = CART.searchIndex(productID);
      const item = CART.getItem(index);
      CART.updateItem(index, productCount);
      HTML_CART.updateRow(item.product.id, CART.renderItem(item))

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
  if (target.hasClass('remove-btn')) {
    const productID = Number(target.val());
    CART.removeItem(productID);
    HTML_CART.deleteRow(productID);
    HTML_CART.updateTable();
  }
}

function clearCartEvent() {
  CART.removeAll();
  HTML_CART.cartInfo.children().remove();
  HTML_CART.updateTable();
}

function showElement(event) {
  const target = $(event.target);
  $(`#${target.val()}`).toggleClass('visible');
}

function filterProducts(event) {
  event.preventDefault();

  const word = $(event.target).val();
  const filteredProducts = PRODUCTS.list.filter(product => product.keywords.includes(word));

  if (filteredProducts.length && word) {
    HTML_PRODUCTS.renderProductsList(filteredProducts);
    HTML_PRODUCTS.isFiltered = true;
  } else if (!word && HTML_PRODUCTS.isFiltered) {
    HTML_PRODUCTS.renderProductsList(PRODUCTS.list);
    HTML_PRODUCTS.isFiltered = false;
  }

}

function payEvent() {
  if (CART.getItemsCount()) {
    const newHistory = new HistoryTag({
      items: CART.items,
      total: CART.calculateTotal()
    })

    SHOP_HISTORY.addNewBuy(newHistory.getHistorial());
    SHOP_HISTORY.saveHistory();
    HTML_HISTORIAL.hasChange = true;
    HTML_HISTORIAL.updateHistoryView(SHOP_HISTORY);
    alert('Muchas gracias por su compra! 😊');
    clearCartEvent();
  }
}