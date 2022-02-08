var urlSearchParams = new URLSearchParams(window.location.search);
var groupId = urlSearchParams.get("groupId");

/* EVENT LISTENER */
$(document).ready(function () {
    getLeaderboard(groupId, 1);
    $(".header").load("topbar.html", function () {
        document.getElementById("profile-image").src = img_info()
        document.getElementById("name").innerHTML = getName();
    });
});

// Handling dropdown-content display and hiding
$(document).on("click", "#type-button", () => {
    $("#filter-content").css("visibility", "hidden");
    const obj = $("#type-content");
    obj.css("visibility") === "hidden"
        ? obj.css("visibility", "visible")
        : obj.css("visibility", "hidden");
});

// For changing of dropdown: Type
const onChangeType = (type = 1) => {
    getLeaderboard(groupId, type);
    $("#type-content").css("visibility", "hidden");

    const icon = '<i class="fas fa-angle-down right"></i>';
    $("#type-button").html(
        type === 1
            ? `Average Score ${icon}`
            : type === 2
            ? `Average Time Taken ${icon}`
            : `Quizzes Attempted ${icon}`
    );
};

/* API CALLS */
function getLeaderboard(groupId, sort) {
    $.ajax({
        url: `/group/leaderboard?sort=${sort}&groupId=${groupId}`,
        method: "POST",
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            console.log(data);
            displayLeaderboard(data.leaderboard, parseInt(sort));
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
}

/* DISPLAY DATA */
function displayLeaderboard(data, type) {
    let leaderboard = document.querySelector("#leaderboard");
    let top3 = document.querySelector("#top-3");

    leaderboard.innerHTML = "";
    top3.innerHTML = "";
    document.getElementById("noresult").style.display = "none";

    var ordinal = "";

    if (data.length >= 1) {
        $("#type-button").css("visibility", "visible");
        $(".type-dropdown").css("visibility", "visible");
        $("#filter-button").css("visibility", "visible");

        $("#leaderboard").prepend(`
        <table class="table">
            <thead>
                <tr class="heading">
                    <th class="col-1 center">Rank</th>
                    <th class="col-3">Name</th>
                    <th class="col-4">School</th>
                    <th class="col-2 center">Level</th>
                    <th class="col-2 center">${
                        type === 1
                            ? "Avg Score"
                            : type === 2
                            ? "Avg Time Taken"
                            : "Quiz Attempted"
                    }</th>
                </tr>
            </thead>
        <tbody id="lb-tb">
    `);

        for (var i = 0; i < data.length; i++) {
            const {
                _id,
                average_score,
                num_of_quiz,
                average_time_taken,
                first_name,
                last_name,
                school,
                grade,
                pfp,
            } = data[i];

            const school_proper = school
                .split(" ")
                .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
                .join(" ");

            const grade_formatted =
                grade > 6 ? `Secondary ${grade - 6}` : `Primary ${grade}`;

            const short_grade = grade > 6 ? `S${grade - 6}` : `P${grade}`;

            // assign ordinal (st, th, nd) to number
            if ((i + 1) % 10 == 1 && i / 10 != 1) ordinal = "st";
            else if ((i + 1) % 10 == 2) ordinal = "nd";
            else if ((i + 1) % 10 == 3) ordinal = "rd";
            else ordinal = "th";

            // if leaderboard has at least 3 ppl
            if (i >= 0 && i <= 2 && data.length >= 3) {
                top3.innerHTML += `
                    <div class="top-rank ${
                        i == 0 ? "first" : i == 1 ? "second" : "third"
                    }">
                        <span class="top-rank-num">${i + 1}${ordinal}</span>
                        <img class="pfp" src="${
                            pfp ? pfp : "./avatars/lion.png"
                        }"/>
                        <span class="top-name">${first_name} ${last_name}</span>
                        <span class="top-grade">${grade_formatted}</span>
                        <span class="top-school">${school_proper}</span>
                        <div class="stats">
                            <span class="top-avg-score-header">${
                                type === 1
                                    ? "Avg Score"
                                    : type === 2
                                    ? "Avg Time Taken"
                                    : "Quiz Attempted"
                            }</span><br>
                            <span class="top-avg-score">${
                                type === 1
                                    ? average_score.toFixed(0)
                                    : type === 2
                                    ? average_time_taken.toFixed(2) + " min(s)"
                                    : num_of_quiz
                            }</span>
                        <div />
                    </div>
                `;
            } else if (i <= 9 || _id === userInfo._id) {
                $("#lb-tb").append(`
                    <tr class="student-row">
                        <td class="center">${i + 1}</td>
                        <td>${`${first_name} ${last_name}`}</td>
                        <td>${school_proper}</td>
                        <td class="center">${short_grade}</td>
                        <td class="center">${
                            type === 1
                                ? average_score.toFixed(0)
                                : type === 2
                                ? average_time_taken.toFixed(2) + " min(s)"
                                : num_of_quiz
                        }</td>
                    </tr>
                `);
            }
        }

        $("#leaderboard").append(`
                </tbody>
            </table>
        `);

        // This is to render the user's placement in the leaderboard
        html += ""; // To be added in once the group leaderboard API is recreated
    } else {
        document.getElementById("noresult").style.display = "flex";
    }
}
