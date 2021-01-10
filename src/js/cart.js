class CartItem {
  constructor(product, count) {
    this.product = product;
    this.count = count;
    this.total = this.getTotal();
  }

  updateCount(newCount) {
    this.count = newCount;
    this.total = this.getTotal();
  }

  getTotal() {
    const total = this.product.hasDiscount
      ? this.product.discountPrice * this.count
      : this.product.price * this.count;

    return total;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    const index = this.searchItem(item.product.id);
    if (index < 0) {
      this.items.push(item);
    }
    else {
      this.updateItem(index, item.count);
    }
  }

  updateItem(index, newCount) {
    this.items[index].updateCount(newCount);
  }

  removeItem(itemId) {
    console.log("Eliminar Item");
  }

  searchItem(productID) {
    return this.items.findIndex(item => item.product.id == productID);
  }

  calculateTotal() {
    let total = 0;
    this.items.forEach(item => total += item.total ); 
    
    return {total: total, count: this.items.length};
  }

  removeAll() {
    console.log("Remover todos los items del carrito");
  }

  renderHTML() {
    const tbody = document.getElementById('cart-info');
    const cartTotal = document.getElementById('cart-total');
    const itemsCount = document.getElementById('cart-items-count');
    const countIcon = document.getElementById('count-icon');

    const {total, count } = this.calculateTotal();

    tbody.textContent = "";


    this.items.forEach( item =>  { 
        const trow = document.createElement('tr');
        const name = document.createElement('td');
        const count = document.createElement('td');
        const total = document.createElement('td');

        name.textContent = item.product.name;
        count.textContent = item.count;
        total.textContent = `$${item.total}`;

        trow.appendChild(name);
        trow.appendChild(count);
        trow.appendChild(total);

        tbody.appendChild(trow);
    }) 

    itemsCount.textContent = `Total de elementos en carrito: ${count}`;
    countIcon.textContent = count;
    cartTotal.textContent = `Total a pagar: $${total}`;


  }

}
