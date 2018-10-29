function init() {
    $(document).ready(() => {
        $.validator.addMethod("expirydate", function (value, element) {
            return this.optional(element) || /^0[1-9]|1[0-2]\/\d{2}$/g.test(value);
        }, "La date d'expiration de votre carte de crédit est invalide.");

        $("#order-form").validate({
            rules: {
                "phone": {
                    required: true,
                    phoneUS: true
                },
                "credit-card": {
                    required: true,
                    creditcard: true
                },
                "credit-card-expiry": {
                    required: true,
                    expirydate: true
                }
            },
            submitHandler(form) {
                storage.clearCart();
                const firstName = $("#first-name").val();
                const lastName = $("#last-name").val();
                storage.createOrder(firstName, lastName);
                badge.updateBadge();
                form.submit();
            }
        });
    });
}

init();
