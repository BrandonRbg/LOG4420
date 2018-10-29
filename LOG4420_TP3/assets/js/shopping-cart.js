$(document).ready(() => {
    $("#empty-btn").click(e => {
        write("products", []);
        reset();
    });

    async function setTotal() {
        const items = await getAllProducts();
        const data = getProductsInCard();
        const products = items.filter(a => data.some(x => {
            a.quantity = x.quantity;
            return x.id === a.id
        }));

        let total = 0;
        for (const product of products) {
            total += product.quantity * product.price;
        }

        $("#total").html(`${total.toFixed(2)} $`);
    }

    async function getAllProducts() {
        const data = await fetch("http://localhost:8000/data/products.json");
        return await data.json();
    }

    async function getOneProduct(id) {
        const products = await getAllProducts();
        return products.find(x => x.id === id);
    }

    async function reset() {
        $("#card-body").empty();
        await createTable();
    }

    async function createTable() {
        const res = await fetch("http://localhost:8000/data/products.json");
        const products = await res.json();
        const data = getProductsInCard();
        const items = products.filter(a => data.some(x => {
            a.quantity = x.quantity;
            return x.id === a.id
        }));

        let total = 0;
        for (const item of items) {
            total += item.quantity * item.price;
            $("#card-body").append(createTableRow(item));
            checkButtons(item);
        }

        $("#total").html(`${total.toFixed(2)} $`);

        $(".quantity-plus").click(function() {
            const id = $(this).data("id");
            editQuantity(id, 1);
        });

        $(".quantity-minus").click(function() {
            const id = $(this).data("id");
            editQuantity(id, -1);
        });

        $(".remove-product").click(function() {
            const id = $(this).data("id");
            removeProduct(id);
        });
    }

    function createTableRow(item) {
        return `<tr id="${item.id}">
                <td><button class="remove-product" title="Supprimer" data-id="${item.id}"><i class="fa fa-times"></i></button></td>
                <td><a href="./product.html?id=${item.id}">${item.name}</a></td>
                <td>${item.price}&thinsp;$</td>
                <td>
                    <div class="row">
                        <div class="col">
                            <button id="quantity-minus-${item.id}" class="quantity-minus" title="Retirer" data-id="${item.id}"><i class="fa fa-minus"></i></button>
                        </div>
                        <div class="col" id="quantity-${item.id}">${item.quantity}</div>
                        <div class="col">
                            <button class="quantity-plus" title="Ajouter" data-id="${item.id}"><i class="fa fa-plus""></i></button>
                        </div>
                    </div>
                </td>
                <td id="total-${item.id}">${item.quantity * item.price}&thinsp;$</td>
            </tr>`;
    }

    function write(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function read(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    function addProductToCard(id) {
        const data = read("products");
        data.push(id);
    }

    function getProductsInCard() {
        return read("products");
    }

    function checkButtons(product) {
        if (product.quantity === 1) {
            $(`#quantity-minus-${product.id}`).prop("disabled", true);
        } else {
            $(`#quantity-minus-${product.id}`).prop("disabled", false);
        }
    }

    async function editQuantity(id, value) {
        const data = getProductsInCard();
        const product = await getOneProduct(id);
        for (const item of data) {
            if (item.id === id) {
                item.quantity += value;
                product.quantity = item.quantity;
            }
        }
        write("products", data);
        $(`#quantity-${id}`).html(product.quantity);
        $(`#total-${id}`).html(`${(product.quantity * product.price).toFixed(2)} $`);
        checkButtons(product);
        setTotal();
    }

    function removeProduct(id) {
        const items = getProductsInCard();
        const product = items.find(x => x.id === id);
        items.splice(items.indexOf(product));
        write("products", items);

        $(`#${id}`).remove();
        setTotal();
    }

    createTable();
});