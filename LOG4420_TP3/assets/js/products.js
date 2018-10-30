const PRICE_ASC = "price_asc";
const PRICE_DESC = "price_desc";
const NAME_ASC = "name_asc";
const NAME_DESC = "name_desc";

const COMPUTERS = "computers";
const CAMERAS = "cameras";
const SCREENS = "screens";
const CONSOLES = "consoles";
const ALL_CATEGORIES = "all";

let category = ALL_CATEGORIES;
let sorting = PRICE_ASC;

function isCategory(toggle) {
    return [COMPUTERS, CAMERAS, SCREENS, CONSOLES, ALL_CATEGORIES]
        .includes(toggle);
}

function isSorting(toggle) {
    return [PRICE_ASC, PRICE_DESC, NAME_ASC, NAME_DESC]
        .includes(toggle);
}

function sortProducts(products) {
    return products
        .sort((p1, p2) => {
            switch (sorting) {
                case PRICE_ASC:
                    return p1.price - p2.price;
                case PRICE_DESC:
                    return p2.price - p1.price;
                case NAME_ASC:
                    return p1.name.localeCompare(p2.name);
                case NAME_DESC:
                    return p2.name.localeCompare(p1.name);
            }
            return 0;
        });
}

function filterProducts(products) {
    return products.filter(p => p.category === category || category === ALL_CATEGORIES);
}

function renderProducts(products) {
    $("#products-list").empty();
    products.forEach((product) => {
        $("#products-list").append(`
            <div class="product">
              <a href="./product.html?id=${product.id}" title="En savoir plus...">
                <h2>${product.name}</h2>
                <img alt="${product.name}" src="./assets/img/${product.image}">
                <p class="price"><small>Prix</small> ${utils.formatCurrency(product.price)}&thinsp;$</p>
              </a>
            </div>
        `);
    });
}

function reloadProducts() {
    service.getAllProducts()
        .then(p => sortProducts(p))
        .then(p => filterProducts(p))
        .then(p => {
            renderProducts(p);
            updateProductCount(p.length);
        });
}

function updateProductCount(count) {
    $("#products-count").html(`${count} produit${count !== 1 ? "s" : ""}`);
}

function init() {
    reloadProducts();
    $(document).ready(() => {
        $("button").click(function () {
            const toggle = $(this).data("toggle");
            if (isCategory(toggle)) {
                $("#product-categories").children().removeClass();
                category = toggle;
            } else if (isSorting(toggle)) {
                sorting = toggle;
                $("#product-criteria").children().removeClass();
            }
            $(this).addClass("selected");
            reloadProducts();
        });
    });
}

init();
