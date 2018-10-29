const badge = {
    updateBadge() {
        const itemCount = storage.getProductsInCard()
            .reduce((count, p) => count + p.quantity, 0);
        this.updateBadgeWithQuantity(itemCount);
    },
    updateBadgeWithQuantity(quantity) {
        $(".count").remove();
        if (quantity) {
            $(".shopping-cart").append(`<span class="count">${quantity}</span>`);
        }
    }
};

$(document).ready(() => {
    badge.updateBadge();
});
