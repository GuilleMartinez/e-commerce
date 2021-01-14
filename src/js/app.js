const PRODUCTS = createProductsList(DATABASE);
const CART = new ShoppingCart();


renderProducts(PRODUCTS, CART);
CART.renderHTML();
setKeywords(PRODUCTS);
setFilterByKeywords();
setCartRender();


function createProductsList(JSON) {
  const productsList = [];
  for (data of JSON) {
    const product = new Product(data);
    productsList.push(product);
  }
  return productsList;
}

function renderProducts(productsList, shoppingCart) {
  const PRODUCTS_UL = document.getElementById("products");
  PRODUCTS_UL.textContent = "";

  for (product of productsList) {
    const li = document.createElement("li");
    const htmlProduct = product.renderHTML(productsList, shoppingCart);
    li.appendChild(htmlProduct);
    PRODUCTS_UL.appendChild(li);
  }

  PRODUCTS_UL.onclick = addProduct;

  function addProduct(e) {
    if (e.target.className.includes('add-cart-btn')) {
      const count = Number(e.target.previousSibling.value);
      const productID = Number(e.target.value);
      const product = productsList.find(item => item.id === productID);
      shoppingCart.addItem(new CartItem(product, count));
      shoppingCart.renderHTML();
    }

  }

}

function setKeywords(productList) {
  const keys = prepareKeys();
  createOptions(keys);

  function prepareKeys() {
    const keysArray = [];

    for (product of productList) {
      keysArray.push(...product.keywords);
    }
    return new Set(keysArray);
  }

  function createOptions(keys) {
    const datalist = document.getElementById("keywords");

    for (key of keys) {
      const option = document.createElement("option");
      option.value = key;
      datalist.appendChild(option);
    }
  }
}

function setFilterByKeywords() {

  const SEARCH_FORM = document.getElementById('search-form');

  SEARCH_FORM.oninput = filterbyKey;
  SEARCH_FORM.onsubmit = () => false;

  function filterbyKey(event) {

    const word = event.target.value.toLowerCase();
    if (word) {
      const arr = PRODUCTS.filter((item) => item.keywords.includes(word));
      if (arr.length) renderProducts(arr, CART);
    } else {
      renderProducts(PRODUCTS, CART);
    }
  }

}

function setCartRender() {
  const SHOP_BTN = document.getElementById("cart-icon");
  SHOP_BTN.onclick = showCart;

  function showCart() {
    const modal = document.getElementById("shopping-cart");
    if (modal.open) {
      modal.close();
    } else {
      modal.show();
    }
  }

}

