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

function showCart() {
  const modal = document.getElementById("shopping-cart");
  if (modal.open) {
    modal.close();
  } else {
    modal.show();
  }
}

function setFilterByKeywords() {

  const SEARCH_INPUT = document.getElementById("search-input");
  SEARCH_INPUT.oninput = filterbyKey;

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
}


const PRODUCTS = createProductsList(DATABASE);
const CART = new ShoppingCart();


renderProducts(PRODUCTS, CART);
setKeywords(PRODUCTS);
setFilterByKeywords();
setCartRender();

