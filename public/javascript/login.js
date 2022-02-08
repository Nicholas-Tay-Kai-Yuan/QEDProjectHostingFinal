var schoolOption = '';

/*EVENT LISTENER*/
$(document).ready(function () {
    getSchool();
    tokenExist();
})

/* FACEBOOK LOGIN */
window.fbAsyncInit = function() {
    FB.init({
        appId      : '3175042339451827',
        status     : true,
        cookie     : true,                     // Enable cookies to allow the server to access the session.
        xfbml      : true,
        version    : "v12.0"                     // Parse social plugins on this webpage.
    });

    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
        statusChangeCallback(response);        // Returns the login status.
    });
};

function checkLoginState() {                 // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // See the onlogin handler
        statusChangeCallback(response);
    });
}


function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      fbLogin();  
    }
}

function fbLogin() {
    FB.login(function(response) {
        if (response.status === 'connected') {
            FB.api('/me', {fields: 'name, email'}, 
            function(response) {
                console.log(response)
                console.log("Email : " + response.email);
                console.log(response.first_name);
                let email = response.email;
                let rememberMe = $('#remember_me').is(':checked');

                let data = {
                    "email": email,
                    "rememberMe": rememberMe
                }

                $.ajax({
                    url: '/user/socialLogin',
                    type: 'POST',
                    data: data,
                    dataType: "json",
                    success: function (data, textStatus, xhr) {

                        localStorage.setItem('token', data.accessTK);
                        localStorage.setItem('userInfo', JSON.stringify(data.user));

                        if (data.user.role == "admin") {
                            window.location.href = './control.html'; //Admin to control page
                        }
                        else {
                            window.location.href = './overview.html';
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        let error;
                        let key;
                        let message = JSON.parse(xhr.responseText);

                        if (message.code == "INVALID_REQUEST") { //invalid_req code err returns array
                            error = JSON.parse(xhr.responseText).error[0];

                            switch (error.split(" ")[0]) {
                                case 'Email':
                                    key = "email";
                                    break;
                                case 'Password':
                                    key = "password";
                                    break;
                            }
                        }
                        else {
                            error = message.error;
                        }
                        showError(error, key);
                    }
                })
                //Prevent form to run normally
                event.preventDefault();
            });
        }
    })
}

$(document).on("click", "#loginBtn", function (event) {
    let email = $('#email').val();
    let password = $('#password').val();
    let rememberMe = $('#remember_me').is(':checked');

    let data = {
        "email": email,
        "password": password,
        "rememberMe": rememberMe
    }

    $.ajax({
        url: '/user/login',
        type: 'POST',
        data: data,
        dataType: "json",
        success: function (data, textStatus, xhr) {

            localStorage.setItem('token', data.accessTK);
            localStorage.setItem('userInfo', JSON.stringify(data.user));

            if (data.user.role == "admin") {
                window.location.href = './control.html'; //Admin to control page
            }
            else {
                window.location.href = './overview.html';
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            let error;
            let key;
            let message = JSON.parse(xhr.responseText);

            if (message.code == "INVALID_REQUEST") { //invalid_req code err returns array
                error = JSON.parse(xhr.responseText).error[0];

                switch (error.split(" ")[0]) {
                    case 'Email':
                        key = "email";
                        break;
                    case 'Password':
                        key = "password";
                        break;
                }
            }
            else {
                error = message.error;
            }
            showError(error, key);
        }
    })
    //Prevent form to run normally
    event.preventDefault();
})

//GOOGLE LOGIN
function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    let email = profile.getEmail();
    let rememberMe = $('#remember_me').is(':checked');

    let data = {
        "email": email,
        "rememberMe": rememberMe
    }

    $.ajax({
        url: '/user/socialLogin',
        type: 'POST',
        data: data,
        dataType: "json",
        success: function (data, textStatus, xhr) {

            localStorage.setItem('token', data.accessTK);
            localStorage.setItem('userInfo', JSON.stringify(data.user));

            if (data.user.role == "admin") {
                window.location.href = './control.html'; //Admin to control page
            }
            else {
                window.location.href = './overview.html';
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            let error;
            let key;
            let message = JSON.parse(xhr.responseText);

            if (message.code == "INVALID_REQUEST") { //invalid_req code err returns array
                error = JSON.parse(xhr.responseText).error[0];

                switch (error.split(" ")[0]) {
                    case 'Email':
                        key = "email";
                        break;
                }
            }
            else {
                error = message.error;
            }
            showError(error, key);
        }
    })
    //Prevent form to run normally
    event.preventDefault();
}

// FACEBOOK LOGIN
// $(document).on("click", "#fbLoginBtn", function (event) {
//     FB.api('/me', { locale: 'en_US', fields: 'name, email' },
//     function(response) {
//         console.log(response.email);
//         let email = response.email;
//         let rememberMe = $('#remember_me').is(':checked');

//         let data = {
//             "email": email,
//             "rememberMe": rememberMe
//         }

//         $.ajax({
//             url: '/user/socialLogin',
//             type: 'POST',
//             data: data,
//             dataType: "json",
//             success: function (data, textStatus, xhr) {

//                 localStorage.setItem('token', data.accessTK);
//                 localStorage.setItem('userInfo', JSON.stringify(data.user));

//                 if (data.user.role == "admin") {
//                     window.location.href = './control.html'; //Admin to control page
//                 }
//                 else {
//                     window.location.href = './overview.html';
//                 }
//             },
//             error: function (xhr, textStatus, errorThrown) {
//                 let error;
//                 let key;
//                 let message = JSON.parse(xhr.responseText);

//                 if (message.code == "INVALID_REQUEST") { //invalid_req code err returns array
//                     error = JSON.parse(xhr.responseText).error[0];

//                     switch (error.split(" ")[0]) {
//                         case 'Email':
//                             key = "email";
//                             break;
//                         case 'Password':
//                             key = "password";
//                             break;
//                     }
//                 }
//                 else {
//                     error = message.error;
//                 }
//                 showError(error, key);
//             }
//         })
//         //Prevent form to run normally
//         event.preventDefault();
//     });
// })

$(document).on("change", "#role", function () {
    let content = '';
    let role = $('#role').val();
    let container = document.getElementById('studentContainer');

    //Showing school and level option if student
    if (role == 'student') {
        container.style.display = "block";
        content += `            
            <div>
                <select class="form-select rounded-pill" required id="grade">
                    <option value="1">Primary 1</option>
                    <option value="2">Primary 2</option>
                    <option value="3">Primary 3</option>
                    <option value="4">Primary 4</option>
                    <option value="5">Primary 5</option>
                    <option value="6">Primary 6</option>
                </select>
            </div>
            <div class="mt-2">
                <select class="form-select rounded-pill" required id="school">
                    ${schoolOption}                
                </select>
            </div>`;
        container.innerHTML = content;
    }
    else {
        // Removing school and level option if not student
        container.style.display = "none"
    }
})

$(document).on('click', ".showPassword", function () {
    let id = this.id;
    let input = document.getElementById(id.slice(0, -3));
    let type = "password";

    //Changing input type
    if (input.type === "password") {
        type = "text";
    }

    input.type = type;
    $(this).children().toggleClass("fas fa-eye-slash fas fa-eye"); //Toggling show password icon

})

/* API CALLS */
function getSchool() {
    let data = {
        resource_id: 'ede26d32-01af-4228-b1ed-f05c45a1d8ee', // the resource id
        q: 'primary', // query for 'primary'
        limit: 200 // Recieving limit
    };
    $.ajax({
        url: 'https://data.gov.sg/api/action/datastore_search',
        data: data,
        dataType: 'JSON',
        success: function (data, textStatus, xhr) {
            for (let i = 0; i < data.result.records.length; i++) {
                schoolOption += `<option value='${data.result.records[i].school_name}'>${data.result.records[i].school_name}</option>`;
            }
            $('#role').trigger("change");
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function tokenExist(){
    $.ajax({
        url: '/user/refresh_token',
        method: 'POST',
        dataType: 'JSON',
        xhrFields: {
            withCredentials: true
        },
        success: function(data, textStatus, xhr) {
            let token = data.accessToken;
            let base64Url = token.split('.')[1]; // token you get
            let base64 = base64Url.replace('-', '+').replace('_', '/');
            let decodedData = JSON.parse(window.atob(base64));
            
            localStorage.setItem('token', token);

                if (decodedData.issuedRole == "admin") {
                    window.location.href = './control.html'; //Admin to control page
                }
                else {
                    window.location.href = './overview.html';
                }

        },
        error: function(xhr, textStatus, errorThrown){
            document.getElementById('container').style.display = "flex";
            document.getElementsByClassName('lds-ellipsis')[0].style.display = "none";
        }
    });
}

function createGameInfo(id){
    $.ajax({
        url: `/game?user_id=${id}`,
        method: 'POST',
        dataType: 'JSON',
        success: function(data, textStatus, xhr) {
            console.log("Game Info Successfully Created!")
        },
        error: function(xhr, textStatus, errorThrown){
            console.log("Error: " + xhr.responseText);
        }
    });
}

function showError(message, key) {
    let errorBox = document.getElementById("alertBox");
    let errorText = document.getElementById("errorMessage");

    //Focus on the empty field
    $('#' + key).focus();

    errorText.innerHTML = message;
    errorBox.style.display = "block";
}

// google login

setTimeout(function () {
    $('.googleSignUp div div span span:last').text("Sign up with Google");
    $('.googleSignUp div div span span:first').text("Sign up with Google");
}, 0);


function onFailure(error) {
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}