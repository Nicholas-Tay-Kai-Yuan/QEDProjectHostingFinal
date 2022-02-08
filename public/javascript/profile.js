let userInfo = JSON.parse(localStorage.getItem("userInfo"));

$(document).ready(function () {
    getSchool();
    console.log(userInfo);

    document.getElementById("profile-upload").style.backgroundImage =
        "url(" + userInfo.pfp + ")";

    $("#account-fn").html(userInfo.first_name);
    $("#account-ln").html(userInfo.last_name);
    $("#account-email").val(userInfo.email);
    $(
        "input:radio[name=inlineRadioOptions][value=" + userInfo.gender + "]"
    ).attr("checked", true);
    $("#account-role").val(userInfo.role);
    $("#levelOption").val(userInfo.grade);

    if (userInfo.role != "student") {
        document.getElementById("schoolOption").style.display = "none";
        document.getElementById("levelOption").style.display = "none";
        document.getElementById("account-role").style.display = "none";
    } else {
        document.getElementById("account-role").style.display = "none";
    }
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    })

    $("#expLevel").html(`EXP: ${userInfo.exp_points}/100`);
    $("#rankLevel").html(`Lv${userInfo.rank_level}`);
    $(".exp").width(userInfo.exp_points + '%');

    if (userInfo.role == "teacher" || userInfo.role == "parent") {
        $(".expContainer").css('display', 'none');
    }

    if (userInfo.role == "admin") {
        $(".expContainer").css('display', 'none');
    }
})

$(document).on("change", "#account-role", function () {
    let role = $("#account-role").val();

    if (role != "student") {
        $("#schoolOption").attr("disabled", "disabled");
        $("#levelOption").attr("disabled", "disabled");
    } else {
        $("#schoolOption").removeAttr("disabled");
        $("#levelOption").removeAttr("disabled");
    }
});

$(document).on("click", "#editBtn", function () {
    let fn = $("#account-fn");
    let ln = $("#account-ln");
    let newFn = $("#accountFn").val();
    let newLn = $("#accountLn").val();

    if (newFn == "" || newLn == "") {
        $("#errorForm").css("display", "block");
    } else {
        $("#errorForm").css("display", "none");
        $("#editNameModal").modal("toggle");

        fn.text(newFn);
        ln.text(newLn);
    }
});

$(document).on("click", "#editName", function () {
    let fn = $("#account-fn").text();
    let ln = $("#account-ln").text();

    $("#accountFn").val(fn);
    $("#accountLn").val(ln);
});

$(document).on("click", "#updateBtn", function () {
    let first_name = $("#account-fn").text();
    let last_name = $("#account-ln").text();
    let gender = $("input:radio:checked").val();
    let role = $("#account-role").val();

    let data = {
        first_name: first_name,
        last_name: last_name,
        gender: gender,
    };

    if (role == "student") {
        data["school"] = $("#schoolOption").val();
        data["grade"] = $("#levelOption").val();
    }

    updateAccount(data);
});

function onLoad() {
    gapi.load('auth2', function () {
        gapi.auth2.init();
    });
}

function signOut() {
    onLoad();
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}


// facebook log out

window.fbAsyncInit = function () {
    FB.init({
        appId: '3175042339451827',
        cookie: true,                     // Enable cookies to allow the server to access the session.
        xfbml: true,                     // Parse social plugins on this webpage.
    });

    FB.getLoginStatus(function (response) {   // Called after the JS SDK has been initialized.
        statusChangeCallback(response);        // Returns the login status.
    });
};

function checkLoginState() {                 // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function (response) {   // See the onlogin handler
        statusChangeCallback(response);
    });
}


function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
        console.log('test1')
        fbLogOut();
    }
}
//             var accessToken = response.authResponse.accessToken;

function fbLogOut() {
    console.log('test2')
    FB.logout(function (response) {
        console.log("FB LOG OUT")
    });
}

$(document).on("click", "#logoutBtn", function () {
    checkLoginState();
    onLoad();
    signOut();
    $.ajax({
        url: "/user/logout",
        method: "POST",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            //Clearing token and userinfo
            localStorage.clear();
            //Redirect to login
            location.href = "login.html";
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("YOU HAVE BEEN PROHIBITED TO LEAVE!");
        },
    });
});


$(document).on("click", "#deleteBtn", function () {
    var userid = JSON.parse(localStorage.getItem("userInfo"))._id;
    var userRole = JSON.parse(localStorage.getItem("userInfo")).role;

    // Get groups by user
    $.ajax({
        url: "/group/user?userId=" + userid,
        method: "GET",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            data.map(function (data, index) {

                if (data.owner == userid) {

                    // Delete notifications sent by the group
                    $.ajax({
                        url: "/notification/" + data._id,
                        method: "DELETE",
                        dataType: "JSON",
                        success: function (data, textStatus, xhr) {
                            console.log("Delete notifications success")
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Failed to delete notifications");
                        },
                    });

                    // Delete groups created by user
                    $.ajax({
                        url: "/group/" + data._id,
                        method: "DELETE",
                        dataType: "JSON",
                        success: function (data, textStatus, xhr) {
                            console.log("Delete group successful");
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Fail to delete group");
                        },
                    });
                }
                
                else {

                    // Remove user from all the groups they are in
                    $.ajax({
                        url: "/group/removeMember?groupId=" + data._id + "&userId=" +userid,
                        method: "DELETE",
                        dataType: "JSON",
                        success: function (data, textStatus, xhr) {
                            console.log("Remove member from group successful");
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Fail to remove member from group");
                        },
                    });
                }
            
            })
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Cannot retrieve groups by user")
        },
    });

    // Delete all user notifications
    $.ajax({
        url: "/notification/user?userId=" + userid,
        method: "GET",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            data.map(function(data, index) {
                $.ajax({
                    url: "/notification/" + data._id,
                    method: "DELETE",
                    dataType: "JSON",
                    success: function (data, textStatus, xhr) {
                        console.log("Delete notifications success")
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log("Failed to delete notifications");
                    },
                });
            })
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Failed to get notifications by user");
        },
    });

    // Delete notifications sent by user (teacher/parent)
    $.ajax({
        url: "/notification",
        method: "GET",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            data.map(function(data, index) {
                if (data.teacher_id && data.teacher_id == userid) {
                    $.ajax({
                        url: "/notification/" + data._id,
                        method: "DELETE",
                        dataType: "JSON",
                        success: function (data, textStatus, xhr) {
                            console.log("Delete notifications success")
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Failed to delete notifications");
                        },
                    });
                }
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Delete notification failed")
        },
    });

    // Get quizzes attempted by user
    $.ajax({
        url: "/quiz/user?userId=" +userid,
        method: "GET",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            data.map(function(data, index) {
                let quizId = data._id;

                // Delete all quiz records of user
                $.ajax({
                    url: "/quiz/" + quizId,
                    method: "DELETE",
                    dataType: "JSON",
                    success: function (data, textStatus, xhr) {
                        console.log("Successfully deleted quizzes");
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log("Failed to delete quizzes");
                    },
                });
            })
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Failed to get user quizzes");
        },
    });

    $.ajax({
        url: "/user/" + userid,
        method: "DELETE",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            //Clearing token and userinfo
            localStorage.clear();
            //Redirect to login
            location.href = "login.html";
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("YOU HAVE BEEN PROHIBITED TO DELETE YOUR ACCOUNT!");
        },
    });
});

function getSchool() {
    let data = {
        resource_id: "ede26d32-01af-4228-b1ed-f05c45a1d8ee", // the resource id
        q: "primary", // query for 'primary'
        limit: 200, // Recieving limit
    };
    $.ajax({
        url: "https://data.gov.sg/api/action/datastore_search",
        data: data,
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            let schoolOption = document.getElementById("schoolOption");

            for (let i = 0; i < data.result.records.length; i++) {
                schoolOption.innerHTML += `<option value='${data.result.records[i].school_name}'>${data.result.records[i].school_name}</option>`;
            }

            $("#schoolOption").val(userInfo.school);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
}

function updateAccount(data) {
    let id = userInfo._id;

    // Profile image upload
    const file = document.getElementById("getval").files[0];
    if (file) {
        const formData = new FormData();
        formData.append("image", file);
        console.log("There is a file");
        $.ajax({
            url: `/user/pfp/${id}`,
            method: "PUT",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data, textStatus, xhr) {
                $.alert({
                    title: "Profile image uploaded!",
                    content: "Reload page to see the new changes!",
                });
                localStorage.setItem("userInfo", JSON.stringify(data.user))
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
                alert("Profile image failed to upload");
            },
        });
    }
    $.ajax({
        url: `/user/${id}`,
        data: data,
        method: "PUT",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            $.alert({
                title: "Updated!",
                content: "Profile successfully updated! Image might take a few seconds to upload",
            });
            localStorage.setItem("userInfo", JSON.stringify(data.user));
        },
        error: function (xhr, textStatus, errorThrown) {
            let key;
            var error;
            console.log(xhr.responseText);
            if (JSON.parse(xhr.responseText).code == "INVALID_REQUEST") {
                error = JSON.parse(xhr.responseText).error[0];

                switch (error.split(" ")[0]) {
                    case "First":
                        key = "account-fn";
                        break;
                    case "Last":
                        key = "account-ln";
                        break;
                    // case 'Role':
                    //     key = "account-role";
                    //     break;
                    case "Gender":
                        key = "account-gender";
                        break;
                    case "School":
                        key = "schoolOption";
                        break;
                    case "Grade":
                        key = "levelOption";
                        break;
                }
                $(`#${key}`).focus();
            } else {
                error = JSON.parse(xhr.responseText).error;
            }
            document.getElementById("err").innerHTML = error;
        },
    });


}
