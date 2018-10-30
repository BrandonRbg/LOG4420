const productId = getQueryParam("id");

function getQueryParam(name) {
    const result = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
    if (!result) {
        return null;
    }
    return result[1] || 0;
}

function renderProduct(product) {
    $("article").empty()
        .append(product ? `
        <h1 id="product-name">${product.name}</h1>
        <div class="row">
            <div class="col">
                <img id="product-image" alt="${product.name}" src="./assets/img/${product.image}">
            </div>
            <div class="col">
                <section>
                    <h2>Description</h2>
                    <p id="product-desc">${product.description}</p>
                </section>
                <section>
                    <h2>Caractéristiques</h2>
                    <ul id="product-features">
                        ${product.features.map(f => `<li>${f}</li>`).join("\n")}
                    </ul>
                </section>
                <hr>
                <form class="pull-right" id="add-to-cart-form">
                    <label for="product-quantity">Quantité:</label>
                    <input class="form-control" id="product-quantity" type="number" value="1" min="1">
                    <button class="btn" title="Ajouter au panier" type="submit">
                        <i class="fa fa-cart-plus"></i>&nbsp; Ajouter
                    </button>
                </form>
                <p id="product-price">Prix: <strong>${utils.formatCurrency(product.price)}&thinsp;$</strong></p>
            </div>
        </div>
        ` : `<h1>Page non trouvée!</h1>`);
}

function addProductToCart(quantity) {
    storage.addProductToCard(productId, +quantity);
    badge.updateBadge();
    notifications.showNotification("Le produit a été ajouté au panier.", 5000);
}

function init() {
    service.getProductById(productId)
        .then(p => renderProduct(p))
        .then(() => {
            $("#add-to-cart-form").submit((e) => {
                e.preventDefault();
                const quantity = $("#product-quantity").val();
                addProductToCart(quantity);
            });
        });
}

init();
