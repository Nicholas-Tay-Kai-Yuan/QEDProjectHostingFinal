$(document).ready(function () {
    $(".header").load("topbar.html", function () {
        document.getElementById("profile-image").src = img_info()
        document.getElementById("name").innerHTML = getName();
    });
});

function getName() {
    return JSON.parse(localStorage.getItem("userInfo")).first_name;
}

document.getElementById("getval").addEventListener("change", readURL, true);
function readURL() {
    var file = document.getElementById("getval").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        document.getElementById("profile-upload").style.backgroundImage =
            "url(" + reader.result + ")";
    };
    if (file) {
        reader.readAsDataURL(file);
    }
}

//edit and update profile

jQuery(function ($) {
    var $inputs = $("#contact_form :input").prop("disabled", true);
    $("#edit_btn").click(function () {
        $("#submit_btn").show(0);
        $("#edit_btn").hide(0);
        $inputs.prop("disabled", false);
    });
    $("#submit_btn").click(function () {
        $inputs.prop("disabled", true);
        $("#submit_btn").hide(0);
        $("#edit_btn").show(0);
    });
});
