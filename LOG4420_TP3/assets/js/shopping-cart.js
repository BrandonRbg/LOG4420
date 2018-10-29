$(document).ready(() => {
    async function setTotal() {
        const items = await getAllProducts();
        const data = storage.getProductsInCard();
        const products = items.filter(a => data.some(x => {
            a.quantity = +x.quantity;
            return +x.id === +a.id
        }));

        let total = 0;
        for (const product of products) {
            total += +product.quantity * +product.price;
        }

        $("#total-amount").html(`${total.toFixed(2).replace(".", ",")} $`);
    }

    async function getAllProducts() {
        const data = await fetch("http://localhost:8000/data/products.json");
        return await data.json();
    }

    async function getOneProduct(id) {
        const products = await getAllProducts();
        return products.find(x => +x.id === +id);
    }

    function genTable() {
        $("#card").append(`<div id="table"><table class="table shopping-cart-table">
        <thead>
          <tr>
            <th></th>
            <th>Produit</th>
            <th>Prix unitaire</th>
            <th>Quantité</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody id="card-body">
        </tbody>
      </table>
      <p class="shopping-cart-total">Total: <strong id="total-amount"></strong></p>
      <a class="btn pull-right" href="./order.html">Commander <i class="fa fa-angle-double-right"></i></a>
      <button class="btn" id="empty-btn"><i class="fa fa-trash-o"></i>&nbsp; Vider le panier</button></div>`);
        $("#empty-btn").click(e => {
            if (confirm("Voulez vous supprimer tous les produits du panier ?")) {
                storage.write("products", []);
                badge.updateBadge();
                $("#table").remove();
                $("#no-items").prop("hidden", false);
            }
        });
    }

    async function createTable() {
        const res = await fetch("http://localhost:8000/data/products.json");
        const products = await res.json();
        const data = storage.getProductsInCard();

        if (data.length > 0) {
            genTable();
            $("#no-items").prop("hidden", true);
        }

        const items = products
            .filter(a => data.some(x => {
                return +x.id === +a.id
            })).sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            })
            .map(x => {
                x.quantity = data.find(d => +d.id === +x.id).quantity;
                return x;
            });

        let total = 0;
        for (const item of items) {
            total += +item.quantity * +item.price;
            $("#card-body").append(createTableRow(item));
            checkButtons(item);
        }

        $("#total-amount").html(`${total.toFixed(2).replace(".", ",")} $`);

        $(".add-quantity-button").click(function () {
            const id = $(this).data("id");
            editQuantity(id, 1);
        });

        $(".remove-quantity-button").click(function () {
            const id = $(this).data("id");
            editQuantity(id, -1);
        });

        $(".remove-item-button").click(function () {
            if (confirm("Voulez vous supprimer tous les produits du panier ?")) {
                const id = $(this).data("id");
                removeProduct(id);
            }
        });
    }

    function createTableRow(item) {
        return `<tr id="${item.id}">
                <td><button class="remove-item-button" title="Supprimer" data-id="${item.id}"><i class="fa fa-times"></i></button></td>
                <td><a href="./product.html?id=${item.id}">${item.name}</a></td>
                <td>${item.price.toFixed(2).replace(".", ",")}&thinsp;$</td>
                <td>
                    <div class="row">
                        <div class="col">
                            <button id="quantity-minus-${item.id}" class="remove-quantity-button" title="Retirer" data-id="${item.id}"><i class="fa fa-minus"></i></button>
                        </div>
                        <div class="col quantity" id="quantity-${item.id}">${item.quantity}</div>
                        <div class="col">
                            <button class="add-quantity-button" title="Ajouter" data-id="${item.id}"><i class="fa fa-plus""></i></button>
                        </div>
                    </div>
                </td>
                <td class="price" id="total-${item.id}">${(item.quantity * item.price).toFixed(2).replace(".", ",")}&thinsp;$</td>
            </tr>`;
    }

    function checkButtons(product) {
        if (product.quantity === 1) {
            $(`#quantity-minus-${product.id}`).prop("disabled", true);
        } else {
            $(`#quantity-minus-${product.id}`).prop("disabled", false);
        }
    }

    async function editQuantity(id, value) {
        const data = storage.getProductsInCard();
        const product = await getOneProduct(id);
        for (const item of data) {
            if (+item.id === +id) {
                item.quantity += value;
                product.quantity = +item.quantity;
            }
        }
        $(`#quantity-${id}`).html(product.quantity);
        $(`#total-${id}`).html(`${(+product.quantity * +product.price).toFixed(2).replace(".", ",")} $`);
        checkButtons(product);
        setTotal();
        storage.write("products", data);
        badge.updateBadge();
    }

    function removeProduct(id) {
        const items = storage.getProductsInCard();
        const product = items.find(x => x.id === id);
        items.splice(items.indexOf(product));
        storage.write("products", items);
        badge.updateBadge();
        $(`#${id}`).remove();
        setTotal();

        if (!items.length) {
            $("#table").remove();
            $("#no-items").prop("hidden", false);
        }
    }

    createTable();
});