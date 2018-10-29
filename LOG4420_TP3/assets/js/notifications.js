const notifications = {
    showNotification(text, duration) {
        $("#dialog").html(text)
            .prop("hidden", false)
            .delay(duration)
            .queue(function () {
                $(this).prop("hidden", true);
            });
    }
};
