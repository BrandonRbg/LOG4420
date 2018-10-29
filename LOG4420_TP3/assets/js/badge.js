const badge = {
    updateBadge(itemCount) {
        itemCount = itemCount ? itemCount : storage.getProductsInCard()
            .reduce((count, p) => count + p.quantity, 0);
        this.updateBadgeWithQuantity(itemCount);
    },
    updateBadgeWithQuantity(quantity) {
        if (quantity) {
            $(".count").prop("hidden", false)
                .html(quantity);
        } else {
            $(".count").prop("hidden", true)
                .html("");
        }
    }
};

$(document).ready(() => {
    badge.updateBadge();
});
