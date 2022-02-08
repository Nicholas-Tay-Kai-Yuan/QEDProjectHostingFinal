const urlSearchParams = new URLSearchParams(window.location.search);
let groupId = urlSearchParams.get("groupId");
/* EVENT LISTENERS */
$(document).ready(function () {
    getGroupById();
    getGroupMembers();
    $(".header").load("topbar.html", function () {
        document.getElementById("profile-image").src = img_info()
    });
});

// on click on leave group button
$(document).on("click", "#leaveGroup", function () {
    let userId = decodeToken().sub;
    removeMemberFromGroup(groupId, userId, () => {
        window.location.href = "/group.html";
    });
});

$(document).on("click", "#updateGroupBtn", function () {
    const file = document.getElementById("getval").files[0]
    if (file) {
        const formData = new FormData();
        formData.append("image", file);
        console.log("There is a group file");
        console.log(file)
        
        $.ajax({
            url: `/group/pfp/${groupId}`,
            method: "PUT",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (returnedPfpData, textStatus, xhr) {
                console.log(returnedPfpData);
                document.getElementById("showText").style.display="none";
                document.getElementById("successText").style.display="block";              
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
                alert("Group profile image failed to retrieve");
            },
        })
    } else {
        document.getElementById("showText").style.display='block';
        document.getElementById("successText").style.display="none";
    }
});

// search user by mail input
$(document).on("keyup", "#group_name", function () {
    document.querySelector("#check-icon").style.display = "block";
});

// on click check icon update group_name
$(document).on("click", "#check-icon", function () {
    let group_name = document.querySelector("#group_name").value;
    updateGroupName(groupId, group_name, function () {
        document.querySelector("#check-icon").style.display = "none";
        document.querySelector("#error").innerHTML = "";
    });
});

// toggle alert when removing member
$(document).on("click", ".rmMemberToggle", function () {
    let userId = this.closest(".list-member").id.split("added-")[1];
    document.querySelector("#rmUID").value = userId;
});

// toggle result popover on focus
$(document).on("focusin", "#add-members", function () {
    searchUserEmail();
    $(".popover_content").toggleClass("display_popover");
});
$(document).on("focusout", "#add-members", function () {
    $(".popover_content").toggleClass("display_popover");
});

// search user by mail input
$(document).on("keyup", "#add-members", function () {
    searchUserEmail();
});

// add user to member list
$(document).on("click", ".result", function () {
    const id = this.id;
    const owner_id = document.querySelector("#group_owner").dataset.owner_id;
    console.log(id, owner_id);
    if (owner_id && id != owner_id) {
        const pic = this.children[0].children[0].src;
        const name = this.children[1].children[0].children[0].innerHTML;
        const email = this.children[1].children[1].children[0].innerHTML;
        const role = this.children[1].children[2].children[0].innerHTML;

        addMemberToGroup(groupId, id, pic, name, email, role);
    } else {
        document.querySelector("#error").innerHTML =
            "User is already the owner of the group";
    }
});

// remove user on click dropdown
$(document).on("click", "#rm-member", function () {
    let userId = document.querySelector("#rmUID").value;
    removeMemberFromGroup(groupId, userId, () => {
        document.querySelector("#added-" + userId).remove();
        document.querySelector("#error").innerHTML = "";
    });
});
// make user an admin on click dropdown item
$(document).on("click", "#mk-admin", function () {
    let userId = this.closest(".list-member").id.split("added-")[1];
    makeGroupAdmin(groupId, userId, this.closest(".list-member"));
});
// remove user an admin on click dropdown item
$(document).on("click", "#rm-admin", function () {
    let userId = this.closest(".list-member").id.split("added-")[1];
    rmGroupAdmin(groupId, userId, this.closest(".list-member"));
});
// delete group
$(document).on("click", "#delGroup", function () {
    deleteGroup(groupId);
    console.log(groupId);
});

/* API CALLS */
function getGroupById() {
    console.log("incall");
    if (!groupId) window.location.href = "/group.html";
    console.log("incall2");

    $.ajax({
        url: `/group/${groupId}`,
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            displayGroup(data);
            console.log("success");
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
            window.location.href = "/404.html";
            console.log("erorr");
        },
    });
}

function getGroupMembers() {
    $.ajax({
        url: `/group/members?groupId=${groupId}`,
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            displayMembers(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
            // window.location.href = "/404.html";
        },
    });
}



function searchUserEmail() {
    var q = document.querySelector("#add-members").value;

    $.ajax({
        url: `/user/search?query=${q}`,
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            displaySearchResult(data);
            console.log(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
}

function addMemberToGroup(groupId, id, pic, name, email, role) {
    $.ajax({
        url: `/group/addMember?groupId=${groupId}&userId=${id}`,
        method: "POST",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            displayAdded(id, pic, name, email, role);
            let adddedList = document.querySelector("#added-list");
            adddedList.scrollTo(0, adddedList.scrollHeight);
            document.querySelector("#error").innerHTML = "";
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
            document.querySelector("#error").innerHTML = xhr.responseJSON.error;
        },
    });
}

function removeMemberFromGroup(groupId, userId, successCallback) {
    $.ajax({
        url: `/group/removeMember?groupId=${groupId}&userId=${userId}`,
        type: "DELETE",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            let myId = decodeToken().sub;
            if (myId == userId) {
                window.location.href = "/group.html";
            } else {
                successCallback();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
            document.querySelector("#error").innerHTML = xhr.responseJSON.error;
        },
    });
}

function makeGroupAdmin(groupId, userId, parentElement) {
    $.ajax({
        url: `/group/makeAdmin?groupId=${groupId}&userId=${userId}`,
        type: "PUT",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            displayAdminTag(parentElement);
            document.querySelector("#error").innerHTML = "";
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
            document.querySelector("#error").innerHTML = xhr.responseJSON.error;
        },
    });
}

function rmGroupAdmin(groupId, userId, parentElement) {
    $.ajax({
        url: `/group/dismissAdmin?groupId=${groupId}&userId=${userId}`,
        type: "PUT",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            let myId = decodeToken().sub;
            document.querySelector("#error").innerHTML = "";
            if (myId == userId) {
                window.location.href = "/group_members.html?groupId=" + groupId;
            } else {
                hideAdminTag(parentElement);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
            document.querySelector("#error").innerHTML = xhr.responseJSON.error;
        },
    });
}

function deleteGroup(groupId) {
    $.ajax({
        url: `/group/${groupId}`,
        type: "DELETE",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            window.location.href = "/group.html";
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(groupId)
            console.log(errorThrown);
            document.querySelector("#error").innerHTML = xhr.responseJSON.error;
        },
    });
}

function updateGroupName(groupId, groupName, successCallback) {
    if (groupName != "" && groupName != null && groupName != undefined) {
        $.ajax({
            url: `/group?groupId=${groupId}`,
            type: "PUT",
            data: JSON.stringify({
                group_name: groupName,
            }),
            dataType: "JSON",
            contentType: "application/json",
            success: function (data, textStatus, xhr) {
                successCallback();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(errorThrown);
                document.querySelector("#error").innerHTML =
                    xhr.responseJSON.error;
            },
        });
    } else {
        document.querySelector("#error").innerHTML =
            "Group Name cannot be empty";
    }
}

/* DISPLAY DATA */
function displayGroup(data) {
    // document.querySelector(".title").textContent = data.group_name;

    // display group name on modal
    document.querySelector("#group_name").value = data.group_name;
    console.log(data)
    document.getElementById("group-member-upload").style.backgroundImage =
            "url(" + data.pfp + ")";
    // display edit button if group admin
    let decoded = decodeToken();
    let memberIndex = data.members.findIndex((member) => {
        return member.user_id == decoded.sub;
    });

    let isGrpAdmin;
    if (memberIndex != -1) isGrpAdmin = data.members[memberIndex].is_admin;

    let isGrpOwner = data.owner == decoded.sub;

    if (isGrpAdmin || isGrpOwner) {
        $(".rightbar").prepend(`
            <div id="edit-btn" data-bs-toggle="modal" data-bs-target="#addGroupModal">
                <i class="fas fa-pen"></i>
            </div>
        `);
    }
    if (isGrpOwner) {
        document.querySelector("#leaveGrpToggle").style.display = "none";
    }
}

function displayMembers(data) {
    // main page
    let ownerList = document.querySelector("#owner-list");
    let parentList = document.querySelector("#parent-list");
    let teacherList = document.querySelector("#teacher-list");
    let studentList = document.querySelector("#student-list");

    // modal page
    let addedList = document.querySelector("#added-list");
    let group_owner = document.querySelector("#group_owner");

    // display owner
    ownerList.innerHTML += `
        <div class="member" id="${data.owner._id}">
            <div>${data.owner.pfp
            ? `<img class="member-img" src=${data.owner.pfp}>`
            : `<i class="fas fa-user-circle fa-lg"></i>`
        }&nbsp&nbsp<span class="member-name">${data.owner.first_name} ${data.owner.last_name
        }</span></div>
            <img src="images/crown.png" style="width:20px" alt="owner"/>
        </div>
    `;

    // display owner in modal
    group_owner.value = data.owner.first_name + " " + data.owner.last_name;
    group_owner.dataset.owner_id = data.owner._id;

    // display members
    if (data.members && data.members.length >= 1) {
        data.members.forEach((member) => {
            if (!jQuery.isEmptyObject(member)) {
                const insertStr = `
                <div class="member" id="${member.user_id}">
                    <div>${member.pfp
                        ? `<img class="member-img" src=${member.pfp}>`
                        : `<i class="fas fa-user-circle fa-lg"></i>`
                    }&nbsp&nbsp<span class="member-name">${member.user_name
                    }</span></div>
                    ${member.is_admin
                        ? '<img src="images/crown.png" style="width:20px" alt="admin"/>'
                        : ""
                    }
                </div>
                `;
                switch (member.role) {
                    case "student":
                        studentList.innerHTML += insertStr;
                        break;
                    case "parent":
                        parentList.innerHTML += insertStr;
                        break;
                    default:
                        teacherList.innerHTML += insertStr;
                }

                // display members in modal
                addedList.innerHTML +=
                    `
                <div class="list-member" id="added-${member.user_id}">
                    <div class="col">
                        <img src="${member.pfp ? member.pfp : `/images/monkey.png`
                    }" alt="profileimg" class="modal-pfp"/>
                    </div>
                    <div class="member-details">
                        <span class="added-name">${member.user_name}</span>
                        <span class="added-email">${member.email}</span>
                        <span class="added-role">` +
                    member.role.charAt(0).toUpperCase() +
                    member.role.slice(1) +
                    `</span>
                    </div>
                    <div class="is_admin">
                        ${member.is_admin
                        ? '<span class="admin-tag-modal">Admin</span>'
                        : ""
                    }
                    </div>
                    <div class="edit-member" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="fas fa-ellipsis-v"></span>
                    </div>
                    <ul class="dropdown-menu">
                    ${member.is_admin
                        ? '<li class="dropdown-item" id="rm-admin">Remove Admin</li>'
                        : '<li class="dropdown-item" id="mk-admin">Make Admin</li>'
                    }
                        <li class="dropdown-item rmMemberToggle"
                            data-bs-toggle="modal"
                            data-bs-target="#rmMemberModal">Remove Member</li>
                    </ul>
                </div>
            `;
            }
        });
    }

    // display count (minus 1 to exclude header)
    document.querySelector("#parent-count").innerHTML =
        "(" + document.querySelector("#parent-list").children.length + ")";
    document.querySelector("#teacher-count").innerHTML =
        "(" + document.querySelector("#teacher-list").children.length + ")";
    document.querySelector("#student-count").innerHTML =
        "(" + document.querySelector("#student-list").children.length + ")";
}

function displaySearchResult(data) {
    let searchList = document.querySelector("#search-list");
    let content = "";

    if (data.length < 1) {
        content += `
            <div class="text-center p-2"><small>No result</small></div>
        `;
    } else {
        data.forEach((result) => {
            content += `
                <div class="result row m-auto" id="${result._id}">
                    <div class="col-1 m-auto">
                    <img src="${result.pfp ? result.pfp : `/images/monkey.png`
                }" alt="profileimg" class="modal-pfp"/>
                    </div>
                    <div class="col m-auto mx-2">
                        <div class="row">
                            <span class="member-name">${result.first_name} ${result.last_name
                }</span>
                        </div>
                        <div class="row">
                            <span class="email">${result.email}</span>
                        </div>
                        <div class="row">
                            <span class="email">${result.role}</span>
                        </div>
                    </div>   
                </div>
                
            `;
            // <span class="role">${result.role}</span>
        });
    }

    searchList.innerHTML = content;
}

function displayAdded(id, pic, name, email, role) {
    var addedList = document.querySelector("#added-list");
    var children = Array.from(addedList.children); //convert children to array

    // check if user exists in members list
    var userExists = children.find((addedMember) => {
        return addedMember.id.split("added-")[1] == id;
    });

    // add to members list if user is not already in it
    if (!userExists) {
        addedList.innerHTML += `
        <div class="list-member d-flex " id="added-${id}">
            <div class="col">
                <img src="${pic}" alt="profileimg" class="modal-pfp" style="width: 30px"/>
            </div>
            <div class="member-details">
                <span class="added-name">${name}</span>
                <span class="added-email">${email}</span>
                <span class="added-role">${role}</span>
            </div>
            <div class="is_admin">
                
            </div>
            <div class="edit-member" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="fas fa-ellipsis-v"></span>
            </div>
            <ul class="dropdown-menu">
                <li class="dropdown-item" id="mk-admin">Make Admin</li>
                <li class="dropdown-item rmMemberToggle"
                    data-bs-toggle="modal"
                    data-bs-target="#rmMemberModal">Remove Member</li>
            </ul>
        </div>`;
    }
}

function displayAdminTag(parentElement) {
    let adminTag = parentElement.querySelector(".is_admin");
    let mkAdmin = parentElement.querySelector("#mk-admin");
    let dropdown = parentElement.querySelector(".dropdown-menu");

    adminTag.innerHTML = `
        <span class="admin-tag-modal">Admin</span>
    `;
    mkAdmin.remove();

    let li = document.createElement("li");
    li.id = "rm-admin";
    li.classList.add("dropdown-item");
    li.innerHTML = "Remove Admin";
    dropdown.prepend(li);
}

function hideAdminTag(parentElement) {
    let adminTag = parentElement.querySelector(".is_admin");
    let rmAdmin = parentElement.querySelector("#rm-admin");
    let dropdown = parentElement.querySelector(".dropdown-menu");

    adminTag.innerHTML = "";
    rmAdmin.remove();

    let li = document.createElement("li");
    li.id = "mk-admin";
    li.classList.add("dropdown-item");
    li.innerHTML = "Make Admin";
    dropdown.prepend(li);
}

/* MISC FUNCTIONS */
function decodeToken() {
    const token = localStorage.getItem("token");
    if (!token || token == "") window.location.href = "/login.html";

    let base64Url = token.split(".")[1]; // token you get
    let base64 = base64Url.replace("-", "+").replace("_", "/");
    let decodedData = JSON.parse(window.atob(base64));

    return decodedData;
}

function expandDropdown(value) {
    var selectedRole;
    var dropdownArrow;

    if (value == 1) {
        selectedRole = document.getElementById("owner-list");
        dropdownArrow =
            document.getElementById("owner").firstChild.nextSibling.firstChild
                .nextSibling;
    } else if (value == 2) {
        selectedRole = document.getElementById("teacher-list");
        dropdownArrow =
            document.getElementById("teacher").firstChild.nextSibling.firstChild
                .nextSibling;
    } else if (value == 3) {
        selectedRole = document.getElementById("parent-list");
        dropdownArrow =
            document.getElementById("parent").firstChild.nextSibling.firstChild
                .nextSibling;
    } else if (value == 4) {
        selectedRole = document.getElementById("student-list");
        dropdownArrow =
            document.getElementById("student").firstChild.nextSibling.firstChild
                .nextSibling;
    } else {
    }

    dropdownArrow.className = "fas fa-angle-down fa-lg";

    if (selectedRole.style.display == "none") {
        selectedRole.style.display = "block";
        dropdownArrow.className = "fas fa-angle-down fa-lg";
    } else {
        selectedRole.style.display = "none";
        dropdownArrow.className = "fas fa-angle-right fa-lg";
    }
}

function readURL() {
    var file = document.getElementById("getval").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        document.getElementById('group-member-upload').style.backgroundImage = "url(" + reader.result + ")";
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
    }
}