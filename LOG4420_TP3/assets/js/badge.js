const badge = {
    updateBadge() {
        const itemCount = storage.getProductsInCard()
            .reduce((count, p) => count + p.quantity, 0);
        this.updateBadgeWithQuantity(itemCount);
    },
    updateBadgeWithQuantity(quantity) {
        if (quantity) {
            $(".count").prop("hidden", false);
            $(".count").html(quantity);
        } else {
            $(".count").prop("hidden", true);
        }
    }
};

$(document).ready(() => {
    badge.updateBadge();
});
