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
        this.keywords = product.extra.keywords.split(",");
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

        $(productImg)
            .addClass("product-img")
            .prop("alt", this.description)
            .prop("src", this.imgURL);

        $(productCaption)
            .addClass("product-caption")
            .text(`${this.name} x Kg`);

        $(figure).append(productImg, productCaption);

        if (this.hasDiscount) {

            const price = document.createElement("del");
            const discountPrice = document.createElement("b");

            $(discount)
                .addClass("discount-amount")
                .text(`-${this.discountValue * 100}%`);

            $(price)
                .addClass("product-price")
                .text(`${this.price}$`);

            $(discountPrice)
                .addClass("product-price")
                .text(`${this.discountPrice}$`);

            $(prices).append(price, discountPrice);
            $(productInfo).append(discount);

        } else {
            const price = document.createElement("b");

            $(price)
                .addClass("product-price")
                .text(`${this.price}$`);

            $(prices).append(price);
        }

        $(prices).addClass("prices");

        $(itemCount)
            .addClass("item-count")
            .prop("type", "number")
            .prop("min", 1)
            .prop("value", 1)

        $(addBtn)
            .addClass("add-cart-btn")
            .prop("title", "Añadir al carrito")
            .prop("value", this.id)
            .text("+");

        $(buttons)
            .addClass("buttons")
            .append(itemCount, addBtn);

        $(productInfo)
            .addClass("product-info")
            .append(prices, buttons);

        $(container)
            .addClass("product")
            .append(figure, productInfo);

        return container;
    }
}

