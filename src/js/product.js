class Product {
    constructor(product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.category = product.category;
        this.brand = product.brand;
        this.price = product.price;
        this.imgURL = product.extra.imgURL;
        this.hasDiscount = product.extra.hasDiscount;
        this.discountValue = product.extra.discountValue;
        this.discountPrice = this.hasDiscount
            ? this.price - this.price * this.discountValue
            : 0;
        this.keywords = product.extra.keywords.split(',');
    }

    renderHTML() {
        const container = document.createElement("div");
        const figure = document.createElement("figure");
        const productImg = document.createElement("img");
        const productCaption = document.createElement("figcaption");
        const productInfo = document.createElement("div");
        const prices = document.createElement("div");
        const discount = document.createElement("span");
        const buttons = document.createElement("div");
        const itemCount = document.createElement("input");
        const addBtn = document.createElement("button");

        container.classList.add("product");

        productImg.classList.add("product-img");
        productImg.alt = this.description;
        productImg.src = this.imgURL;

        productCaption.classList.add("product-caption");
        productCaption.textContent = `${this.name} x Kg`

        figure.appendChild(productImg);
        figure.appendChild(productCaption);

        productInfo.classList.add("product-info");

        prices.classList.add("prices");

        if (this.hasDiscount) {
            const price = document.createElement("del");
            const discountPrice = document.createElement("b");

            discount.classList.add("discount-amount");
            discount.textContent = `-${this.discountValue * 100}%`;

            price.classList.add("product-price");
            price.textContent = `${this.price}$`

            discountPrice.classList.add("product-price");
            discountPrice.textContent = `${this.discountPrice}$`;

            prices.appendChild(price);
            prices.appendChild(discountPrice);
            productInfo.appendChild(discount);
        } else {
            const price = document.createElement("b");
            prices.classList.add("product-price");
            price.textContent = `${this.price}$`;
            prices.appendChild(price);
        }

        itemCount.classList.add("item-count");
        itemCount.type = "number";
        itemCount.min = 1;
        itemCount.defaultValue = 1;

        addBtn.classList.add("add-cart-btn");
        addBtn.title = "Añadir al carrito";
        addBtn.textContent = "+";
        addBtn.value = this.id;

        buttons.classList.add("buttons");
        buttons.appendChild(itemCount);
        buttons.appendChild(addBtn);

        productInfo.appendChild(prices);
        productInfo.appendChild(buttons);

        container.appendChild(figure);
        container.appendChild(productInfo);

        return container;
    }
}

