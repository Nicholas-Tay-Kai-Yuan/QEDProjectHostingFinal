
/* EVENT LISTENER */
$(document).ready(function () {
    $(".header").load("topbar.html", function () {
        document.getElementById("profile-image").src = img_info()
        document.getElementById("name").innerHTML = getName();
    });
    getGroupsByUser();
    displayForEducator();
});

// console.log("Adding the change event")
// document.getElementById('getval').addEventListener('change', readURL, true);
function readURL() {
    var file = document.getElementById("getval").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        document.getElementById('group-upload').style.backgroundImage = "url(" + reader.result + ")";
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
    }
}

$(document).on("focusin", "#add-members", function () {
    searchUserEmail();
    $(".popover_content").toggleClass("display_popover");
});
$(document).on("focusout", "#add-members", function () {
    $(".popover_content").toggleClass("display_popover");
});

$(document).on("keyup", "#add-members", function () {
    searchUserEmail();
});

// MODAL
// add user to member list
$(document).on("click", ".result", function () {
    const id = this.id;
    const pic = this.children[0].children[0].src
    const name = this.children[1].children[0].children[0].innerHTML;
    const email = this.children[1].children[1].children[0].innerHTML;

    // console.log(id);
    // console.log(pic);

    // console.log(name);

    // console.log(email);

    displayAdded(id, pic, name, email);
});

// remove member from list 
$(document).on("click", ".remove-member", function () {
    this.parentElement.parentElement.parentElement.remove();
});

$(document).on("click", "#addGroup", function () {
    createGroup();
});

// GROUP LISTING
$(document).on("click", ".group", function () {
    const groupId = this.id;
    window.location.href = "/group_announcement.html?groupId=" + groupId;
});


/* CALL APIs */
function getGroupsByUser() {
    var userId = JSON.parse(localStorage.getItem("userInfo"))._id;

    $.ajax({
        url: `/group/user?userId=${userId}`,
        dataType: 'JSON',
        success: function (data, textStatus, xhr) {
            console.log(data)
            displayMyGroups(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function searchUserEmail() {
    var q = document.querySelector("#add-members").value;

    $.ajax({
        url: `/user/search?query=${q}`,
        dataType: 'JSON',
        success: function (data, textStatus, xhr) {
            displaySearchResult(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function createGroup() {
    var group_name = document.querySelector("#group_name").value;
    var owner = JSON.parse(localStorage.getItem("userInfo"))._id;
    var membersList = Array.from(document.querySelector("#added-list").children);

    var members = [];
    membersList.forEach(memberElement => {
        var id = (memberElement.id).split("added-")[1];
        members.push({ user_id: id });
    });

    var data = {
        group_name,
        owner,
        members
    };
    console.log(data)
    $.ajax({
        url: `/group`,
        method: "POST",
        data: JSON.stringify(data),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (returnedGroupData, textStatus, xhr) {
            const file = document.getElementById("getval").files[0]
            if (file) {
                const formData = new FormData();
                formData.append("image", file);
                console.log("There is a group file");
                console.log(file)
                console.log(returnedGroupData)
                console.log(formData)
                // window.location.href = "";
                $.ajax({
                    url: `/group/pfp/${returnedGroupData.new_id}`,
                    method: "PUT",
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (returnedPfpData, textStatus, xhr) {
                        console.log(returnedPfpData);

                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(xhr.responseText);
                        alert("Group profile image failed to upload");
                    },
                })
            } else {
                window.location.href = "";
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("Sorry, an unexpected error occured");
            console.log(errorThrown);
        }
    });
}




/* DISPLAY DATA */
function displayMyGroups(data) {
    if (data.length >= 1) {
        var groupList = document.querySelector("#group-list");

        var content = "";
        data.forEach(group => {
            console.log(group)
            content += `
                <div id="${group._id}" class="group">
                    <div class="row">
                        <div class="col-md-2 col-sm-3 d-flex justify-content-center">
                            <img src="${group.pfp? group.pfp : '../images/sample_groupimg.png'}" class="group_img img-fluid" />
                        </div>
                        <div class="col p-0 my-auto">
                            <div class="group-body">
                                <span class="group_name">${group.group_name}</span><br>
                                <div class="latest-msg-wrapper">
                                    <span class="sender_name">
                                    ${!Array.isArray(group.posts.pfp) && group.posts.content ? `<img class="group-icon" src= "${group.posts.pfp}">`: `<span class="group-icon"><i class="fas fa-user-circle owner-image"></i></span`}
                                    </span>
                                    <span class="latest_msg">
                                        ${group.posts && group.posts.content ? group.posts.content : "No Messages"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="group-owner">
                                Owner:&nbsp&nbsp
                                
                                ${group.owner_pfp? `<img class="group-icon" src= "${group.owner_pfp}">`: `<span class="group-icon"><i class="fas fa-user-circle owner-image"></i></span`}
                                
                                <span class="owner">${group.owner_name}</span>
                            </span>
                        </div>
                    </div>
                </div>
            `;

        });
        groupList.innerHTML = content;
    }
}


function displaySearchResult(data) {
    var searchList = document.querySelector("#search-list");
    
    var content = "";

    if (data.length < 1) {
        content += `
            <div class="text-center p-2" style="font-family: Poppins"><small>No result</small></div>
        `;
    }
    else {
        data.forEach(result => {
            console.log(result)
            content += `

                <div class="result row m-auto" id="${result._id}">
                    <div class="col-1 m-auto">
                        <img src="${result.pfp? result.pfp : '../avatars/frog.png'}" id="eachMemberProfileImg" style="width: 35px"/>
                    </div>
                    <div class="col m-auto mx-2">
                        <div class="row">
                            <span class="name">${result.first_name} ${result.last_name}</span>
                        </div>
                        <div class="row">
                            <span class="email">${result.email}</span>
                        </div>
                    </div> 
                </div>
            `;
            // <span class="role">${result.role}</span>
        });
    }

    searchList.innerHTML = content;
}

function displayAdded(id, pic, name, email) {
    var addedList = document.querySelector("#added-list");
    var children = Array.from(addedList.children); //convert children to array

    // check if user exists in members list
    var userExists = children.find(addedMember => {
        return addedMember.id.split("added-")[1] == id;
    });

    // add to members list if user is not already in it
    if (!userExists) {
        addedList.innerHTML += `
            <div class="added-member row" id="added-${id}">
                <div class="col-1 m-auto">
                    <img src="${pic}" alt="profileimg" style="width: 35px"/>
                </div>
                <div class="col m-auto mx-2">
                    <div class="row">
                        <div class="member-details">
                            <span class="added-name">${name}</span>
                            <span class="added-email">${email}</span>
                        </div>
                    </div>
                </div>
                <div class="col d-flex justify-content-end align-items-center">
                    <div class="row">
                        <div class="remove-member">
                            <span class="fas fa-times fa-lg"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}


function displayForEducator() {
    let role = decodeToken().issuedRole;

    if (role == "teacher" || role == "parent" || role == "admin") {
        let createGroupBtn = `
            <button class="btn add-btn" data-bs-toggle="modal" data-bs-target="#addGroupModal">
                Create Group
            </button>
        `;
        document.querySelector(".btn-wrapper").innerHTML += createGroupBtn;
    }
}


/* MISC FUNCTIONS */
function decodeToken() {
    const token = localStorage.getItem('token');
    if (!token || token == "") window.location.href = "/login.html";

    let base64Url = token.split('.')[1]; // token you get
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    let decodedData = JSON.parse(window.atob(base64));



    return decodedData;
}
