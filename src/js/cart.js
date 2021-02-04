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
    const index = this.searchIndex(item.product.id);
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
    const itemsFiltered = this.items.filter(item => item.product.id !== itemId);
    this.items = itemsFiltered;
  }

  searchIndex(productID) {
    return this.items.findIndex(item => item.product.id == productID);
  }

  calculateTotal() {
    let total = 0;
    this.items.forEach(item => total += item.total);
    return total;
  }

  getItemsCount() {
    return this.items.length;
  }

  removeAll() {
    this.items = [];
  }

  getItem(index) {
    const [item] = this.items.slice(index);
    return item || 0;
  }

  itemExists(itemID) {
    return this.searchIndex(itemID) >= 0;
  }

  renderItem(item) {
    const tableRow = document.createElement("tr");
    const nameCell = document.createElement("td");
    const countCell = document.createElement("td");
    const subtotalCell = document.createElement("td");
    const buttonCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    const incrementBtn = document.createElement("button");
    const decrementBtn = document.createElement("button");
    const countSpan = document.createElement("span");

    $(nameCell)
      .addClass("item-name")
      .text(item.product.name);

    $(decrementBtn)
      .addClass("update-btn decrement-btn")
      .text("➖")
      .prop("title", "Decrementar cantidad")
      .prop("value", 1);

    $(incrementBtn)
      .addClass("update-btn increment-btn")
      .text("➕")
      .prop("title", "Incrementar cantidad")
      .prop("value", 1);

    $(countSpan).text(item.count);

    $(countCell)
      .addClass("item-count")
      .append(decrementBtn, countSpan, incrementBtn);

    $(subtotalCell)
      .addClass("item-subtotal")
      .text(`$${item.total}`);

    $(deleteBtn)
      .addClass("remove-btn")
      .prop("value", item.product.id)
      .prop("title", "Eliminar producto")
      .text("🗑")

    $(buttonCell).append(deleteBtn);

    $(tableRow)
      .prop("id", `product-${item.product.id}`)
      .append(nameCell, countCell, subtotalCell, buttonCell);

    return tableRow;
  }



}
