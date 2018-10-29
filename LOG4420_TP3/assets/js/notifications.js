const notifications = {
    showNotification(text, duration) {
        $(`<div class="notification"> ${text} </div>`)
            .appendTo("body")
            .delay(duration)
            .queue(function () {
                $(this).remove();
            });
    }
};
