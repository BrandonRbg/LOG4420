$(document).ready(() => {
    async function setTotal(products) {
        if (!products) {
            const items = await service.getAllProducts();
            const data = storage.getProductsInCard();
            products = items.filter(a => data.some(x => {
                a.quantity = +x.quantity;
                return utils.idEquals(x.id, a.id);
            }));
        }

        let total = 0;
        for (const product of products) {
            total += +product.quantity * +product.price;
        }

        $("#total-amount").html(`${utils.formatCurrency(total)} $`);
    }

    function genTable() {
        $("#card").append(table.getTableHtml());
        $("#remove-all-items-button").click(e => {
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
                return utils.idEquals(x.id, a.id);
            })).sort(utils.sortNames)
            .map(x => {
                x.quantity = data.find(d => utils.idEquals(d.id, x.id)).quantity;
                return x;
            });

        for (const item of items) {
            $("#card-body").append(table.getTableRowHtml(item));
            checkButtons(item);
        }

        setTotal(items);

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

    function checkButtons(product) {
        if (product.quantity === 1) {
            $(`#quantity-minus-${product.id}`).prop("disabled", true);
        } else {
            $(`#quantity-minus-${product.id}`).prop("disabled", false);
        }
    }

    async function editQuantity(id, value) {
        const data = storage.getProductsInCard();
        const product = await service.getProductById(id);
        for (const item of data) {
            if (+item.id === +id) {
                item.quantity += value;
                product.quantity = +item.quantity;
            }
        }
        $(`#quantity-${id}`).html(product.quantity);
        $(`#total-${id}`).html(`${utils.formatCurrency(+product.quantity * +product.price)} $`);
        checkButtons(product);
        setTotal();
        storage.write("products", data);
        badge.updateBadge();
    }

    function removeProduct(id) {
        const items = storage.getProductsInCard();
        const product = items.find(x => utils.idEquals(x.id, id));
        items.splice(items.indexOf(product), 1);
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