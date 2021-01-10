function createProductsList() {
  const elements = [];
  DATABASE.forEach((item) => elements.push(new Product(item)));
  return elements;
}

function renderProducts() {
  const productsList = document.getElementById("products");

  PRODUCTS.forEach((product) => {
    const li = document.createElement("li");
    li.appendChild(product.renderHTML());
    productsList.appendChild(li);
  });
}

function setKeywords() {
  createHTML(concatKeys());

  function concatKeys() {
    const keys = [];

    for (product of PRODUCTS) {
      keys.push(...product.keywords);
    }

    const set = new Set(keys);
    return set;
  }

  function createHTML(keys) {
    const datalist = document.getElementById("keywords");
    for (key of keys) {
      const option = document.createElement("option");
      option.value = key;
      datalist.appendChild(option);
    }
  }
}

const PRODUCTS = createProductsList();
const CART = new ShoppingCart();

renderProducts();
setKeywords();
