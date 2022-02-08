$(document).ready(function () {
    const { role, pfp } = JSON.parse(localStorage.getItem("userInfo"));
    document.getElementById("profileimg").src = getUserPfp()
    if (role == "admin") {
        window.location.href = "/control.html";
    } else if (role == "parent" || role == "teacher") {
        window.location.href = "/group.html";
    }
    $(".header").load("topbar.html", function () {
        document.getElementById("profile-image").src = img_info()
        document.getElementById("name").innerHTML = getName();
    });
    getRecommendation();
    $(`#welcome-pfp`).attr("src", pfp)

    let user = JSON.parse(localStorage.getItem("userInfo"));
    let width = (user.exp_points / ((user.rank_level + 1) * 1000)) * 100;

    $(".progress-bar").css("width", width + "%");
    $(".progress-bar").html(Math.floor(width) + "%");
    getAssignmentByUser();

    console.log(user._id);
    getNotification(user._id);
});

function getUserPfp() {
    if (!userInfo.pfp) {
        return "images/frog.png"
    } else {
        return userInfo.pfp
    }
}

function getAssignmentPfp(userId) {
    $.ajax({
        url: `/notification/user?userId=${userId}`,
        type: "GET",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            displayNotifications(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("ERROR!" + xhr.responseText);
        },
    });
}



function getNotification(userId) {
    $.ajax({
        url: `/notification/user?userId=${userId}`,
        type: "GET",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            displayNotifications(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("ERROR!" + xhr.responseText);
        },
    });
}

function displayNotifications(data) {
    var notificationBox = document.getElementById("notification-box");
    for (let notification of data) {
        const type =
            notification.content.slice(0, 5) === "There"
                ? "leaderboard"
                : notification.content.slice(9, 20) === "uncompleted"
                    ? "recurring"
                    : "new";

        let href, imageUrl;
        switch (type) {
            case "recurring":
            case "new":
                const pfp = notification.teacher[0].pfp;
                href = `quiz.html?skill=${notification.skill_id}&assignment=${notification.assignment_id}`;
                // Temporary image to represent pfp of TEACHER
                imageUrl = pfp ? pfp : `./avatars/panda (1).png`;
                break;
            case "leaderboard":
                const groupPfp = notification.group[0].pfp;
                href = `group_leaderboard.html?groupId=${notification.group[0]._id}`;
                // Temporary image to represent GROUP image
                imageUrl = imageUrl = groupPfp ? groupPfp : `./images/sample_groupimg.png`;;
                break;
        }

        notificationBox.innerHTML += `
            <div onclick="window.location.href= '${href}'"class="row d-flex small-notification-box">
                <div class="col">
                    <div class="row m-auto">
                        <div class="col d-flex small-notification-header">
                            <img src="${imageUrl}" class="notificationimg1"
                                alt="...">
                            <h4 class="text-center">
                                <p id="NotificationTitle-1">${type === "leaderboard"
                ? notification.group[0].group_name
                : notification.teacher[0].first_name
            }&nbsp;${type === "leaderboard" ? "" : notification.teacher[0].last_name
            }</p>
                            </h4>
                        </div>
                    </div>
                    <div class="row m-auto">
                        <div class="col small-notification-normal-text">
                            <p>${notification.content}</p>
                        </div>
                    </div>
                </div>
                <button class="small-notification-side-button-1 col-1 d-flex align-items-center justify-content-center">
                    <i class="fas fa-angle-right link-light fa-lg"></i>
                </button>
            </div>
            `;
    }
}

// For displaying date in notifications

const displayDate = (dt) => {
    const date = new Date(dt);
    const tempAry = date.toDateString().split(" ");
    return `${tempAry[2]} ${tempAry[1]} ${tempAry[3]} ${tempAry[0]}`;
};

let userInfo = JSON.parse(localStorage.getItem("userInfo"));

$(document).ready(function () {
    $("#account-fn").html(userInfo.first_name);
    $("#account-ln").html(userInfo.last_name);
});

$(document).on("click", "#editBtn", function () {
    let fn = $("#account-fn");
    let ln = $("#account-ln");
    let newFn = $("#accountFn").val();
    let newLn = $("#accountLn").val();

    fn.text(newFn);
    ln.text(newLn);
});

$(document).on("click", ".assignment", function () {
    if (this.classList.contains("completed")) {
        window.location.href =
            "/viewpastquiz.html?quizId=" + this.dataset.quizId;
    } else {
        window.location.href =
            "/quiz.html?skill=" +
            this.id +
            "&assignment=" +
            this.dataset.assignment;
    }
});

function getPopularQuiz(fallback) {
    $.ajax({
        url: `/quiz/popular`,
        type: "GET",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            let content = "";

            if (data.length >= 1) {
                for (let i = 0; i < data.length; i++) {
                    if (i == 0) {
                        $(".attempt-daily-quizbutton").wrap(
                            `<a href="quiz.html?skill=${data[i]._id}"></a>`
                        );
                    }
                    content += `<div><a href="quiz.html?skill=${data[i]._id}">${data[i].skill_name}</a></div>`;
                }
            } else {
                for (let i = 0; i < fallback.length; i++) {
                    if (i == 0) {
                        $(".attempt-daily-quizbutton").wrap(
                            `<a href="quiz.html?skill=${fallback[i].skillId}"></a>`
                        );
                    }
                    content += `<div><a href="quiz.html?skill=${fallback[i].skillId}">${fallback[i].skill_name}</a></div>`;
                }
            }

            $(".trynowbox").html(content);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("ERROR!" + xhr.responseText);
        },
    });
}

$(document).on("click", ".assignmentbutton", function () {
    window.location.href = "assignment.html";
});

$(document).on("click", ".leaderboard-button", function () {
    window.location.href = "leaderboard.html";
});

// Get Daily Quiz

function getRecommendation() {
    let newSkills = [];
    $.ajax({
        url: `/quiz/recommendation?userId=${getUserId()}`,
        type: "GET",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            let content = "";
            console.log(data);
            newSkills = data.newSkills;
            if (data.weakest3.length > 0) {
                for (let i = 0; i < data.weakest3.length; i++) {
                    if (i == 0) {
                        $(document).on("click", ".attempt-daily-quizbutton", function () {
                            window.location.href = "quiz.html?skill=" + data.weakest3[i]._id
                        })
                    }
                    content += `<div><a href="quiz.html?skill=${data.weakest3[i]._id}">${data.weakest3[i].skill_name}</a></div>`;
                }

                $(".trynowbox").html(content);
            } else {
                getPopularQuiz(newSkills);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("ERROR!" + xhr.responseText);
        },
    });
}

// Assignments Section

function getAssignmentByUser() {
    let userId = decodeToken().sub;

    $.ajax({
        url: `/assignment/user?userId=${userId}`,
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            displayAssignments(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
}

function displayAssignments(data) {
    const assignmentIteration = data.length >= 3 ? 3 : data.length
    var smallAssignmentBox = document.getElementById("small-assignment-box");

    if (assignmentIteration == 0) {
        smallAssignmentBox.innerHTML = "<span class='noAssignments'>No Assignments Found</span>"
    } else {
        for (let i = 0; i < assignmentIteration; i++) {
            const href = "/quiz.html?skill=" + data[i].skill_id + "&assignment=" + data[i]._id;

            smallAssignmentBox.innerHTML += `
    
            <div onclick="window.location.href= '${href}'"class="row d-flex small-assignment-box">
            <div class="col">
                <div class="row">
                    <div class="col d-flex small-assignment-header">
                        <img src="${data[i].pfp ? data[i].pfp : "./avatars/cat.png"}" id="Image-1" class="assignmentimg1" alt="profileImg">
                        <h4 class="text-center">
                             <p id= "Title">
                                ${data[i].title}
                             </p>
                        </h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col small-assignment-text-box">
                        <div class="small-assignment-text">
                            <p id="Skill">
                                ${data[i].skill_name}
                            </p>
                        </div>
                    </div>
                    <div class="col small-assignment-text-box2">
                        <div class="small-assignment-text">
                           <span id="Date">
                                <i class="fas fa-clock"></i>
                                ${displayDate(data[i].deadline)}
                           </span>
                        </div>
                    </div>
                </div>
            </div>
            <button class="small-assignment-side-button-1 col-1 d-flex align-items-center justify-content-center">
                <i class="fas fa-angle-right link-light fa-lg"></i>
            </button>
        </div>
        `
        }
    }
}
