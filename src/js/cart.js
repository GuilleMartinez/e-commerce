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

  items = [];

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
    const itemsFiltered = this.items.filter( item => item.product.id !==  itemId );
    this.items = itemsFiltered;
  }

  searchItem(productID) {
    return this.items.findIndex(item => item.product.id == productID);
  }

  calculateTotal() {
    let total = 0;
    this.items.forEach(item => total += item.total ); 
    
    return total;
  }

  getItemsCount() {
    return this.items.length;
  }

  removeAll() {
    this.items = [];
  }

  renderHTML(domCart) {
    
    const total = this.calculateTotal();
    const count = this.getItemsCount();
    domCart.paymentInfo.textContent = "";

    this.items.forEach( item =>  { 
        const trow = document.createElement('tr');
        const nameCell = document.createElement('td');
        const countCell = document.createElement('td');
        const totalCell = document.createElement('td');
        const btnCell = document.createElement('td');
        const deleteBtn = document.createElement('button');

        nameCell.textContent = item.product.name;
        countCell.textContent = item.count;
        totalCell.textContent = `$${item.total}`;

        deleteBtn.classList.add('remove-btn');
        deleteBtn.value = item.product.id;
        deleteBtn.textContent = "❌";

        btnCell.appendChild(deleteBtn);

        trow.appendChild(btnCell);
        trow.appendChild(nameCell);
        trow.appendChild(countCell);
        trow.appendChild(totalCell);

        domCart.paymentInfo.appendChild(trow);
    }) 

    domCart.totalCount.textContent = `Total de elementos en carrito: ${count}`;
    domCart.totalIcon.textContent = count > 0 ? count : "";
    domCart.paymentTotal.textContent = `Total a pagar: $${total}`;


  }

}
