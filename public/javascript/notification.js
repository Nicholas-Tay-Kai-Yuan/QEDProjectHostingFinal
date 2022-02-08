const notificationBox = document.getElementById("notificationBox");

const displayNotification = () =>
    (notificationBox.style.display =
        notificationBox.style.display === "block" ? "none" : "block");
