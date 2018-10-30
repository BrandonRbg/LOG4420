const table = {
    getTableHtml: () => {
        return `<div id="table">
                    <table class="table shopping-cart-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Produit</th>
                                <th>Prix unitaire</th>
                                <th>Quantité</th>
                                <th>Prix</th>
                            </tr>
                        </thead>
                        <tbody id="card-body"></tbody>
                    </table>
                    <p class="shopping-cart-total">Total: <strong id="total-amount"></strong></p>
                    <a class="btn pull-right" href="./order.html">Commander <i class="fa fa-angle-double-right"></i></a>
                    <button class="btn" id="remove-all-items-button"><i class="fa fa-trash-o"></i>&nbsp; Vider le panier</button>
                </div>`
    },
    getTableRowHtml: (item) => {
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
};