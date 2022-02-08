$(document).ready(() => {
    getNotificationsByUserId();
    setProfileImage();
});

const token = localStorage.getItem("token");
const base64Url = token.split(".")[1]; // token you get
const base64 = base64Url.replace("-", "+").replace("_", "/");
const { sub, issuedRole } = JSON.parse(window.atob(base64));

// Set profile image

const setProfileImage = () => {
    const { pfp } = JSON.parse(localStorage.getItem("userInfo"));
    if (!pfp) return;
    $("#topbar-pfp").attr("src", pfp);
};

/* API CALLS */
const getNotificationsByUserId = () => {
    $.ajax({
        url: `notification/user?userId=${sub}`,
        dataType: "JSON",
        success: (data, textStatus, xhr) => {
            renderNotification(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Failed to retrieve notifications");
        },
    });
};

/* DISPLAY DATA */
const renderNotification = (data) => {
    if (data.length === 0) {
        $("#notificationList")
            .append(`<div class="row container-fluid my-1 p-0 py-2 m-0 no-notification">
                            <span class="row container-fluid">No notifications!</span>
                        </div>`);
    } else {
        if (issuedRole === "student") {
            for (let notification of data) {
                const type =
                    notification.content.slice(0, 5) === "There"
                        ? "leaderboard"
                        : notification.content.slice(9, 20) === "uncompleted"
                        ? "recurring"
                        : "new";
                const timeDiff = getTimeDiff(new Date(notification.created_at));
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
                        imageUrl = groupPfp
                            ? groupPfp
                            : `./images/sample_groupimg.png`;
                        break;
                }

                // Append the html code
                $("#notificationList").append(`
                        <div onclick="location.href='${href}'" class="notification-container  ${
                    notification.unread ? "notification-container-unread" : ""
                }"> 
                            <div class="notification-image-container">
                                <img src="${imageUrl}" class="notification-image" />
                            </div>
                            <div class="notification-right-items-container">
                                <div class="notification-content-container">
                                    <span class="notification-content">${
                                        notification.content
                                    }</span>
                                </div>
                                <div class="notification-time-container">
                                    <span class="notification-time">${timeDiff}</span>
                                </div>
                            </div>
                        </div>
                        `);
            }
        } else {
            // Teacher's notification
            for (let notification of data) {
                const timeDiff = getTimeDiff(new Date(notification.created_at));
                $("#notificationList").append(`
                <a class="notification-link" href="group_assignment.html?groupId=${
                    notification.group_id
                }">
                    <div class="notification-container  ${
                        notification.unread
                            ? "notification-container-unread"
                            : ""
                    }"> 
                        <div class="notification-image-container">
                            <img src="${
                                notification.group[0].pfp
                                    ? notification.group[0].pfp
                                    : "./images/sample_groupimg.png"
                            }" class="notification-image" />
                        </div>
                        <div class="notification-right-items-container">
                            <div class="notification-content-container">
                                <span class="notification-content">${
                                    notification.content
                                }</span>
                            </div>
                            <div class="notification-time-container">
                                <span class="notification-time">${timeDiff}</span>
                            </div>
                        </div>
                    </div>
                </a>`);
            }
        }
    }
};

const getTimeDiff = (time) => {
    let difference = new Date() - time;
    if (difference < 0) return "1s";
    if (difference / 604600000 > 1)
        return Math.floor(difference / 604600000) + "w";
    if (difference / 86400000 > 1)
        return Math.floor(difference / 86400000) + "d";
    if (difference / 3600000 > 1) return Math.floor(difference / 3600000) + "h";
    if (difference / 60000 > 1) return Math.floor(difference / 60000) + "m";
    return Math.floor(difference / 1000) + "s";
};

// return User's Profile Picture and Display at Topbar
function img_info() {
    return userInfo.pfp;
}
