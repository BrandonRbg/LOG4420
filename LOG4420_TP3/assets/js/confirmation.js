function init() {
    $(document).ready(() => {
        const lastOrder = storage.getLastOrder();
        if (lastOrder) {
            $("article").append(`
                <h1>Votre commande est confirmée ${lastOrder.firstName} ${lastOrder.lastName}!</h1>
                <p>Votre numéro de confirmation est le <strong>${lastOrder.id}</strong>.</p>
            `);
        }
    });
}

init();
