class Product {
  constructor(
    id,
    name,
    description,
    category,
    author,
    size,
    img,
    price,
    hasDiscount,
    discountValue,
    keywords
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.author = author;
    this.size = size;
    this.imgURL = img;
    this.price = price;
    this.hasDiscount = hasDiscount;
    this.discountValue = discountValue;
    this.discountPrice = hasDiscount ? this.price * this.discountValue : 0;
    this.keywords = keywords.split(",");
  }

  renderHTML() {
    return "Producto renderizado como elemento HTML";
  }
}

class CartItem {
  constructor(product, count) {
    this.item = product;
    this.count = count;
    this.total = product.hasDiscount
      ? product.discountPrice * count
      : product.price * count;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    console.log("Añadir Item");
  }

  updateItem(itemId) {
    console.log("Actualizar Item");
  }

  removeItem(itemId) {
    console.log("Eliminar Item");
  }

  searchItem(itemId) {
    console.log("Buscar Item");
  }

  calculateTotal() {
    console.log("Calcular total");
  }

  removeAll() {
    console.log("Remover todos los items del carrito");
  }

  renderHTML(items) {
    return "Carrito renderizado como elemento HTML";
  }
}

const product = new Product(
  0,
  "Tigre de bengala",
  "Fotografía tigre de bengala",
  "animales",
  "GEORGE DESIPRIS",
  "30x60",
  "../img/bengal-tiger.jpg",
  70,
  true,
  0.5,
  "animales,animal,trigre,naturaleza,felino"
);

const cartItem = new CartItem(product, 3);

const shoppingCart = new ShoppingCart();

console.log(product);
console.log(cartItem);
console.log(shoppingCart);
