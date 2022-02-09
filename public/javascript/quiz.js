var intervalId,
    countdown,
    quizData,
    questionArray = [];
let subtopicname = "";
/* EVENT LISTENER */
$(document).ready(function () {
    // Facebook Sharing setup
    $.ajaxSetup({ cache: true });
    $.getScript("https://connect.facebook.net/en_US/sdk.js", function () {
        FB.init({
            appId: "3175042339451827",
            autoLogAppEvents: true,
            xfbml: true,
            version: "v12.0",
        });

        window.fb_share = async () => {
            // facebook share dialog
            const uploadImage = () => {
                return new Promise((resolve, reject) => {
                    domtoimage
                        .toPng(document.body)
                        .then((dataUrl) => {
                            console.log("Uploading share image");
                            $.ajax({
                                url: `/share`,
                                method: "POST",
                                data: { dataUrl: dataUrl },
                                success: (data) => resolve(data),
                                error: (err) => reject(err),
                            });
                        })
                        .catch((e) => console.log(e));
                });
            };
            const { url } = await uploadImage();
            console.log(url);
            FB.ui({
                method: "feed",
                name: "image-PSLE",
                picture: url,
            });
        };
    });

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    let path = "level";
    let id = "";

    $(".header").load("topbar.html", function () {
        if (document.getElementById("profile-image"))
            document.getElementById("profile-image").src = img_info();
        if (document.getElementById("name"))
            document.getElementById("name").innerHTML = getName();
    });

    if (window.location.toString().includes("ongoing")) {
        location.href = "404.html";
    }

    if (params != null) {
        for (key in params) {
            if (
                params[key] != "" &&
                params[key] != undefined &&
                params[key] != null
            ) {
                if (key != "assignment") {
                    path = key;
                    id = params[key];
                }
            } else {
                alert("ERROR!");
                location.href = "quiz.html";
            }
        }
    }
    getQuizAjax(path, id);
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.innerHTML);
    ev.dataTransfer.setData(
        "id",
        ev.target.parentElement.parentElement.parentElement.id
    );
    ev.dataTransfer.setData("optionId", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();

    var originalElementText = ev.dataTransfer.getData("text");
    var originalElementId = ev.dataTransfer.getData("id");
    var originalElement = document.getElementById(originalElementId);
    var optionId = ev.dataTransfer.getData("optionId");
    var targetInnerHTML = ev.currentTarget.children[0].innerHTML;

    // Swap values if drag and drop in the same question
    if (ev.currentTarget.parentElement.parentElement.id == originalElement.id) {
        ev.currentTarget.children[0].innerHTML = originalElementText;
        var originalElementText =
            originalElement.children[1].children[
                parseInt(optionId.charAt(3)) - 1
            ];
        originalElementText.children[0].innerHTML = targetInnerHTML;
    }
}

//On back press
window.onpopstate = function (e) {
    //Clear timer
    clearInterval(intervalId);

    //Checking for history state
    if (e.state != null) {
        let path = e.state.path;
        let id = e.state.id;

        getQuizAjax(path, id);
    } else {
        getQuizAjax("level", "");
    }
};

$(document).on("click", ".dropDownOptions", function () {
    let path;
    let id = this.id;
    let array = ["level", "topic", "skill"];

    for (let i = 0; i < array.length; i++) {
        // let check = $(".dropDownOptions").hasClass(`${array[i]}`);
        // if (check == true) {
        path = array[i];
        break;
        // }
    }
    console.log(path);
    if (path != null || path != undefined) {
        path = "trial";
        if (window.location.toString().includes("quiz")) {
            path = "quiz";
        }
        window.open(`${path}.html?skill=${id}`);
    } else {
        alert("ERROR!");
    }
});

$(document).on("click", "#dropdownMenuLink", function () {
    $(".levelNo").css({ minWidth: $("#dropdownMenuLink").innerWidth() });
});

$(document).on("click", "#secondaryDropDown", function () {
    $(".secondaryLvlNo").width($("#secondaryDropDown").innerWidth());
});

$(document).on("click", ".form-check-inline .form-check-input", function () {
    var id = this.id;

    if (id == 4) {
        for (var i = 0; i < 4; i++) {
            this.parentElement.parentElement.children[
                i
            ].children[0].checked = false;
        }
    } else {
        this.parentElement.parentElement.children[4].children[0].checked = false;
    }
});

$(document).on("click", ".cancelBtn", function () {
    window.location.href = "/overview.html";
});

$(document).on("click", ".click", function () {
    let id = this.id;

    if (id == "beginBtn") {
        //Start quiz
        questionArray = [];
        funcs[quizData.topic_name].generateQuestion(quizData);
        console.log(questionArray)
        displayQuestion();
    } else {
        // Submit quiz
        let id;
        let isFill = true;
        let isNumber = true;

        //Checking for empty field
        $("input").each(function () {
            if (
                $.trim($(this).val()) == "" &&
                quizData.topic_name != "Real Numbers" &&
                quizData.topic_name != "Algebra"
            ) {
                id = this.id;
                isFill = false;

                return false;
            }
            //Checking for invalid input
            if (
                isNaN($(this).val()) &&
                quizData.topic_name != "Real Numbers" &&
                quizData.topic_name != "Algebra"
            ) {
                id = this.id;
                isNumber = false;

                return false;
            }
        });

        if ((isFill && isNumber) || countdown < 1) {
            // var c = document.getElementById('the_canvas_element_id');
            // var t = c.getContext('2d');
            //Stop the timer
            clearInterval(intervalId);

            //Calculating time taken
            let timeTaken = quizData.duration * 60 - countdown;
            let time =
                Math.floor(timeTaken / 60) +
                "." +
                (timeTaken - Math.floor(timeTaken / 60) * 60);

            //Marking quiz
            let result = funcs[quizData.topic_name].markQuiz(
                quizData,
                questionArray
            );
            let user = JSON.parse(localStorage.getItem("userInfo"));
            let quizMessage;
            let status;
            if (result[1].total >= 90) {
                quizMessage = "Congratulations!";
                status =
                    "Now try more quizzes to boost your ranking on the leaderboard!";
            } else if (result[1].total >= 60) {
                quizMessage = "Good Work!";
                status =
                    "Review your mistakes below and try again! Aim for perfection!";
            } else {
                quizMessage = "You can do better!";
                status = "Review your mistakes below and try again!";
            }
            // let status = (result[1].total >= 50) ? 'pass' : 'fail';
            //Displaying results
            let skillID = new URLSearchParams(window.location.search).get(
                "skill"
            );
            $("#skillName").remove();
            $("#skillLevel").remove();
            $(".cancelBtn").remove();
            $("#support").before(
                `
                <h2 class="text-center mt-4 mb-2" id="quizMessage">${quizMessage}</h2>
                <div class="row justify-content-center align-items-center text-center">
                    <div class="col-12 px-3">
                        <h6 id="scoreMessage">Your score is <b>${Math.round(
                            result[1].total
                        )}%</b>!</h6>
                        <br>
                        <h5 class="text-center" id="statusMessage">${status}</h5>
                    </div>                    
                </div>
                <div class="container">
                    <div class="row justify-content ">
                        <div class="col d-flex justify-content-end">
                            <a class="my-3" href="overview.html"><button class="btn btn-lg text-light ml-4 quiz-navigation-btn" id="returnBtn">Return to homepage</button></a>
                        </div>
                        <div class="col d-flex justify-content-end">
                            <a class="my-3" href="quiz.html"><button class="btn btn-lg text-light ml-4 quiz-navigation-btn">Return to quizpage</button></a>
                        </div>
                        <div class="col d-flex justify-content-end">
                            <a class="my-3" href="quiz.html?skill=${skillID}"><button class="btn btn-lg text-light ml-4 quiz-navigation-btn">Try quiz again</button></a>
                        </div>
                        <div class="col d-flex ">                                             
                            <a class="my-3 share-btn" onclick="window.fb_share()" href="#"><button class="btn btn-lg text-light" id="facebook"><i class="fab fa-facebook"></i> Share Facebook</button></a><br>
                        </div>
                    </div>
                </div>
                <br>
                <div class="text-center" id="progressText"> Take a look at your progress:</div>
                `
            );
            // <i class="col-2 fas fa-glass-cheers fa-4x"></i>

            //Creating canvas
            subtopicname = quizData.skill_name;
            createCanvas2(2, ["Score", "Time Taken"], "support");

            //Check if its trial
            if (!window.location.toString().includes("trial")) {
                //Preparing data for posting quiz
                const data = {
                    skill_id: quizData.skillId,
                    level: quizData.level,
                    skill_name: quizData.skill_name,
                    topic_name: quizData.topic_name,
                    done_by: user._id,
                    score: result[1],
                    questions: result[0],
                    num_of_qn: quizData.num_of_qn,
                    percent_difficulty: quizData.percent_difficulty,
                    time_taken: time,
                    isCompleted: true,
                    created_at: Date.now,
                };
                var urlSearchParams = new URLSearchParams(
                    window.location.search
                );
                var assignment_id = urlSearchParams.get("assignment");
                if (assignment_id != null && assignment_id != undefined) {
                    data.assignment_id = assignment_id;
                }
                submitQuiz(data);

                updateUserInfo(result[2]);
                updateGameInfo(result[2]);
            } else {
                for (let i = 0; i < 2; i++) {
                    displayChart([50, 60, 10], i);
                }

                // //Prompt user to signup for more
                let modalHtml = `<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                            <div class="modal-body text-center mb-3">
                                <h5 class="modal-title my-3" id="staticBackdropLabel">Want more? Sign up now for Free!!</h5>
                                <a href="signup.html"><button class="btn btn-outline-primary">Sign up!</button></a>
                                <a href="index.html"><button class="btn btn-outline-primary">Return to index</button></a>
                            </div>
                            </div>
                        </div>
                    </div>`;
                $("body").append(modalHtml);
                $(".modal").modal("show");

                //Bluring out contetnt
                $("body>*:not(.modal)").css("filter", "blur(10px)");
            }
            window.scrollTo(0, 0);
        } else {
            let err = "Complete the quiz!";
            if (isFill == true) err = "Numbers only!";

            //Focusing on field input
            document.getElementById(id).focus();

            //Showing alerts
            $.alert({
                icon: "fas fa-exclamation-triangle",
                type: "red",
                title: "Alert!",
                content: err,
            });
        }
    }
});

$(document).on("click", ".returnBtn", function () {
    $.confirm({
        icon: "fas fa-exclamation-triangle",
        title: "Are you sure?",
        content: "This quiz will not be saved and the action cannot be undone.",
        type: "red",
        buttons: {
            ok: {
                text: "Confirm",
                btnClass: "btn-outline-danger",
                keys: ["enter"],
                action: function () {
                    window.close();
                },
            },
            cancel: function () {},
        },
    });
});

/* API CALLS */
function getQuizAjax(path, id) {
    $.ajax({
        url: `${path}/${id}`,
        dataType: "JSON",
        success: function (data, textStatus, xhr) {
            if (id == "") {
                path = "alevel";
                url = "/quiz";
            }
            after(path, data);
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("ERROR!");
            location.href = "404.html";
        },
    });
}

function submitQuiz(newQuiz) {
    console.log("welp");
    console.log(newQuiz);
    $.ajax({
        url: `quiz`,
        type: "POST",
        data: JSON.stringify(newQuiz),
        contentType: "application/json",
        success: function (data, textStatus, xhr) {
            $(".submitBtn").remove();
            $(".returnBtn").remove();

            getDetailedBenchmark4(subtopicname, "support");
            createCanvas2(2, ["Score", "Time Taken"], "support");

            let container = document.getElementById("support");

            container.className = "row m-0 m-auto justify-content-center";
            $(container).after(
                '<h4 class="my-5 text-center" id="reviewQuiz">Review Quiz</h4>'
            );

            if (newQuiz.score.total >= 80) {
                // add animation
                confetti();

                setTimeout(() => {
                    confetti.reset();
                }, 40000);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log("fail quiz");
        },
    });
}
function updateUserInfo(points) {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo.exp_points < 0) {
        userInfo.exp_points = 0;
    }

    let data = {
        exp_points: points + userInfo.exp_points,
    };

    userInfo.exp_points = data.exp_points;

    if (userInfo.exp_points >= 100) {
        userInfo.rank_level += Math.floor(userInfo.exp_points / 100);
        userInfo.exp_points -= Math.floor(userInfo.exp_points / 100) * 100;
    }

    // userInfo.rank_level = final;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    data["rank_level"] = userInfo.rank_level;

    $.ajax({
        url: `/user/${userInfo._id}`,
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data, textStatus, xhr) {
            console.log(data);
            // localStorage.setItem('userInfo', JSON.stringify(data.result));
            console.log("Successfully Updated User Info");
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
        },
    });
}

function updateGameInfo(points) {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));

    $.ajax({
        url: `/game?user_id=${userInfo._id}`,
        type: "GET",
        success: function (data, textStatus, xhr) {
            points += data.points;

            let updated = {
                points: points,
            };

            $.ajax({
                url: `/game?user_id=${userInfo._id}`,
                type: "PUT",
                data: updated,
                dataType: "JSON",
                success: function (data, textStatus, xhr) {
                    console.log("Successfully Updated Game Info");
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log("Error!");
                },
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(xhr);
        },
    });
}

function after(path, data) {
    let vname;
    let head = "";
    let notes = [];
    let end = "_name";
    let level = "";
    if (path != "skill") {
        if (path == "level") {
            data = data.topics;
            vname = "topic";
        } else if (path == "topic") {
            data = data.skills;
            vname = "skill";
        } else {
            vname = "level";
            end = "";
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].level > 0 && data[i].level < 7) {
                head = "Primary ";
            } else {
                head = "Secondary ";
            }

            notes.push({
                id: data[i]._id,
                display: head + data[i][vname + end],
                topic: data[i].topics,
                // "skill": data[i].topics[0]
            });
        }

        displayCard(notes, vname);
    } else {
        if (data.level > 0 && data.level < 7) {
            head = "Primary ";
            level = data.level;
        } else {
            head = "Secondary ";
            level = data.level - 6;
        }

        $("body").html(
            `<div class="row justify-content-center m-2">
                <div  class="d-flex justify-content-center">
                   <img src="images/Psleonline_logo_transparent.png" alt="Logo" style="width: 35%">
                </div>
                <div class="col-12 col-sm-10 " id="content">
                    <div class="row flex-nowrap noBar justify-content-center">
                        <div class="d-flex flex-column justify-content-center align-items-center py-5 px-3 p-sm-5" ">       
                            <h4 class="text-center" id="levelTxt">${head} ${level}</h4>
                            <h1 class="text-center" id="skillTxt">${data.skill_name}</h4>
                            <h5 class="text-center" id="durationTxt"><i class="fas fa-clock"></i> Time Limit: ${data.duration} Minutes</h4><br/>
                            <div class="col-6 border p-sm-5 p-3 mt-2" style="border-radius:15px;" id="instructionsBox">
                                <div class="pl-5">
                                    <p class="h5 text-center mb-5" id="instructionsHeader">Instructions</p>
                                    <p class="text-center" id="instructionsTxt">Test will be saved and submit automatically when timer is up</p>
                                    <p class="m-1 text-center" id="instructionsTxt">You are required to finish the test in one sitting</p>
                                    <br/><br/>
                                    <p class="text-center" id="instructionsTxt">There are a total of ${data.num_of_qn} questions in the quiz</p>
                                    <p class="text-center" id="instructionsTxt">Answer all of the questions</p>
                                </div>
                            </div>
                            <div class="text-end mt-5">
                                <button class="btn btn-lg btn-primary click" id="beginBtn">Begin Quiz</button>
                            </div>
                        </div>
                    </div>
                </div>`
        );
        quizData = data;
    }
}

// Display Data
function displayQuestion() {
    let container = document.getElementById("content");
    let head = "";
    let level = "";
    if (quizData.level > 0 && quizData.level < 7) {
        head = "Primary ";
        level = quizData.level;
    } else {
        head = "Secondary ";
        level = quizData.level - 6;
    }
    container.innerHTML = `
        <div class="h5 text-center my-3" id="skillLevel">${head} ${level}</div>
        <div class="h4 text-center my-3" id="skillName">${quizData.skill_name}</div>
            <div class="container row m-auto">
                <div class="col-10 container m-auto justify-content-center" id="support">
                    <div class="row align-items-center">
                        <div class="col-2 text-end">
                            <i class="fas fa-stopwatch fa-lg"></i>
                        </div>
                        <div class="progress col-10 p-0">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" id="timebar"></div>
                        </div>
                    </div>
                    <p class="text-center" style="font-family: Roboto">Remaining Time <span id='time' class='text-center'> ${quizData.duration}:00</span></p>
                </div>
            </div>
       `;

    let content = funcs[quizData.topic_name].arrangeQuestion(
        quizData,
        questionArray
    );
    container.innerHTML +=
        content +
        '</div><br><br><div class=" justify-content-center d-flex text-center mb-3"><button class="btn btn btn-lg cancelBtn me-2">Cancel</button><button class="btn btn btn-lg click submitBtn">Submit</button></div>';
    $(".reviewClass").css("display", "none");

    var MQ = MathQuill.getInterface(2);

    $("span.static-math").each((index, element) => {
        MQ.StaticMath(element);
    });

    $("span.math-field").each((index, element) => {
        MQ.MathField(element);
    });

    //Starting timer
    startCountdown();
}

function displayCard(data, name) {
    let primaryContainer = document.getElementById("container");
    let secondaryContainer = document.getElementById("container2");
    let lvlName = "";
    let lvl = 0;
    primaryContainer.innerHTML = "";
    //Checking if quiz is available
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            lvl = (
                data[i].display.charAt(data[i].display.length - 2) +
                data[i].display.charAt(data[i].display.length - 1)
            ).trim();

            if (lvl > 0 && lvl < 7) {
                lvlName = "Primary " + lvl;
            } else {
                lvlName = "Secondary " + (lvl - 6);
            }

            let content = `
                <div class="row p-0">
                    <a class="btn btn-block dropdown mt-2" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false" >
                        ${lvlName}<i class="fas fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu ${name} levelNo" aria-labelledby="dropdownMenuLink">`;
            var topics = "";
            if (data[i].topic.length <= 0) {
                topics += `
                    <li><a class="dropdown-item dropDownOptions disabled" href="">No Topics Available</a></li>
                    `;
            } else {
                for (x = 0; x < data[i].topic.length; x++) {
                    console.log(data[i].topic[x].skills);
                    if (data[i].topic[x].skills.length <= 0) {
                        topics += `
                            <li><a class="dropdown-item dropDownOptions disabled">No Topics Available</a></li>
                            `;
                        continue;
                    }
                    for (y = 0; y < data[i].topic[x].skills.length; y++) {
                        topics += `
                        <li><a class="dropdown-item dropDownOptions" id = ${data[i].topic[x].skills[y]._id} href="">${data[i].topic[x].skills[y].skill_name}</a></li>
                        `;
                    }
                }
            }
            content += topics;
            content += "</ul></div></div>";

            if (lvl > 0 && lvl < 7) {
                primaryContainer.innerHTML += content;
            } else {
                secondaryContainer.innerHTML += content;
            }
        }
    } else {
        primaryContainer.innerHTML = `<div class='d-flex flex-column align-items-center justify-content-center notAvailable'>
                <i class="icon-blue fas fa-atom fa-4x"></i>
                <p class="h5 mt-3">No Quiz Available!</p>
            </div>`;
    }
}

//Function for countdown
function startCountdown() {
    let seconds;
    let minutes;
    let duration = 60 * quizData.duration - 1; //Duration in seconds

    displayCountdown = document.getElementById("time");
    displayTimebar = document.getElementById("timebar");

    countdown = duration;

    intervalId = setInterval(function () {
        minutes = parseInt(countdown / 60, 10);
        seconds = parseInt(countdown % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        //Display countdown in html
        displayCountdown.innerHTML = minutes + ":" + seconds;
        displayTimebar.style.width =
            ((duration - countdown) / duration) * 100 + "%";

        //When timer reaches 0
        if (--countdown < 0) {
            clearInterval(intervalId); //Stop countdown
            $(".submitBtn").trigger("click"); //Trigger submit
        }
    }, 1000);
}

// Function to generated number between min and max (both included)
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generated decimal between min, max and precision (both included)
function generateRandomDecimal(min, max, precision) {
    var value = Math.random() * (max - min + 1) + min;

    return value.toFixed(precision);
}

function generateRandomString(array) {
    var value = array[generateRandomNumber(0, array.length - 1)];

    return value;
}

//Decimal
const decimal = {
    stringQuestion: (question) => {
        let result;

        if (quizData.skill_code == "DECIMAL_ROUNDING_OFF") {
            result = question.qn;
        } else if (quizData.skill_code == "DECIMAL_ADDITION_SUBTRACTION") {
            if (question.type == "hard") {
                result = question.qnA + "-" + question.qnB;
            } else {
                result = question.qnA + "+" + question.qnB;
            }
        } else if (quizData.skill_code == "DECIMAL_MULTIPLICATION") {
            result = question.qnA + "x" + question.qnB;
        } else if (quizData.skill_code == "DECIMAL_DIVISION") {
            result = question.qnA + "÷" + question.qnB;
        }

        return result;
    },
    stringAnswer: (answer) => {
        let result;

        if ("ansA" in answer) {
            "ans" in answer
                ? (result = answer.ans + " " + answer.ansA + "/" + answer.ansB)
                : (result = answer.ansA + "/" + answer.ansB);
        } else {
            result = answer.ans;
        }

        return result;
    },
    generateQuestion: (quizData) => {
        //output 0: {a: 6, b: 2, ans: 3}
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);
        const numOfHard = numOfQ * (percentDifficulty[2] / 100);

        if (quizData.skill_code == "DECIMAL_ROUNDING_OFF") {
            for (var i = 0; i < numOfEasy; i++) {
                const randomDecimal = parseFloat(
                    (Math.random() * 99 + 0).toFixed(7)
                );
                const ansDecimal = Math.round(randomDecimal * 1) / 1;
                let decimalQn = {
                    qn: randomDecimal,
                    ans: ansDecimal,
                    type: "easy",
                };
                questionArray.push(decimalQn);
            }

            for (var i = 0; i < numOfMedium; i++) {
                const randomDecimal = parseFloat(
                    (Math.random() * 99 + 0).toFixed(7)
                );
                const ansDecimal = Math.round(randomDecimal * 10) / 10;
                let decimalQn = {
                    qn: randomDecimal,
                    ans: ansDecimal,
                    type: "medium",
                };
                questionArray.push(decimalQn);
            }
            //difficult_values
            for (var i = 0; i < numOfHard; i++) {
                const randomDecimal = parseFloat(
                    (Math.random() * 99 + 0).toFixed(7)
                );
                const ansDecimal = Math.round(randomDecimal * 100) / 100;
                let decimalQn = {
                    qn: randomDecimal,
                    ans: ansDecimal,
                    type: "hard",
                };
                questionArray.push(decimalQn);
            }
        } else if (quizData.skill_code == "DECIMAL_ADDITION_SUBTRACTION") {
            for (var i = 0; i < numOfEasy; i++) {
                const randomDecimal1 = parseFloat(
                    (Math.random() * 20 + 0).toFixed(1)
                );
                const randomDecimal2 = parseFloat(
                    (Math.random() * 20 + 0).toFixed(1)
                );
                const ansDecimal = (randomDecimal1 + randomDecimal2).toFixed(1);
                let decimalQn = {
                    qnA: randomDecimal1,
                    qnB: randomDecimal2,
                    ans: ansDecimal,
                    type: "easy",
                };
                questionArray.push(decimalQn);
            }

            for (var i = 0; i < numOfMedium; i++) {
                const randomDecimal1 = parseFloat(
                    (Math.random() * 50 + 0).toFixed(2)
                );
                const randomDecimal2 = parseFloat(
                    (Math.random() * 50 + 0).toFixed(2)
                );
                const ansDecimal = (randomDecimal1 + randomDecimal2).toFixed(2);
                let decimalQn = {
                    qnA: randomDecimal1,
                    qnB: randomDecimal2,
                    ans: ansDecimal,
                    type: "medium",
                };
                questionArray.push(decimalQn);
            }
            //difficult_values
            for (var i = 0; i < numOfHard; i++) {
                const randomDecimal1 = parseFloat(
                    (Math.random() * 99 + 0).toFixed(2)
                );
                const randomDecimal2 = parseFloat(
                    (Math.random() * 99 + 0).toFixed(2)
                );
                let bigNum = 0;
                let smallNum = 0;
                if (randomDecimal1 > randomDecimal2) {
                    bigNum = randomDecimal1;
                    smallNum = randomDecimal2;
                } else {
                    bigNum = randomDecimal2;
                    smallNum = randomDecimal1;
                }
                const ansDecimal = (bigNum - smallNum).toFixed(2);
                let decimalQn = {
                    qnA: bigNum,
                    qnB: smallNum,
                    ans: ansDecimal,
                    type: "hard",
                };
                questionArray.push(decimalQn);
            }
        } else if (quizData.skill_code == "DECIMAL_MULTIPLICATION") {
            for (var i = 0; i < numOfEasy; i++) {
                const randomDecimal1 = parseFloat(
                    (Math.random() * 20 + 0).toFixed(1)
                );
                const randomDecimal2 = parseFloat(
                    (Math.floor(Math.random() * 20) + 0).toFixed(1)
                );
                const ansDecimal = (randomDecimal1 * randomDecimal2).toFixed(1);
                let decimalQn = {
                    qnA: randomDecimal1,
                    qnB: randomDecimal2,
                    ans: ansDecimal,
                    type: "easy",
                };
                questionArray.push(decimalQn);
            }

            for (var i = 0; i < numOfMedium; i++) {
                const randomDecimal1 = parseFloat(
                    (Math.random() * 50 + 0).toFixed(2)
                );
                const randomDecimal2 = parseFloat(
                    (Math.floor(Math.random() * 50) + 0).toFixed(2)
                );
                const ansDecimal = (randomDecimal1 * randomDecimal2).toFixed(2);
                let decimalQn = {
                    qnA: randomDecimal1,
                    qnB: randomDecimal2,
                    ans: ansDecimal,
                    type: "medium",
                };
                questionArray.push(decimalQn);
            }
            for (var i = 0; i < numOfHard; i++) {
                const randomDecimal1 = parseFloat(
                    (Math.random() * 99 + 0).toFixed(3)
                );
                const randomDecimal2 = parseFloat(
                    (Math.floor(Math.random() * 99) + 0).toFixed(3)
                );
                const ansDecimal = (randomDecimal1 * randomDecimal2).toFixed(3);
                let decimalQn = {
                    qnA: randomDecimal1,
                    qnB: randomDecimal2,
                    ans: ansDecimal,
                    type: "hard",
                };
                questionArray.push(decimalQn);
            }
        } else if (quizData.skill_code == "DECIMAL_DIVISION") {
            for (var i = 0; i < numOfEasy; i++) {
                const randomDecimal1 = parseFloat(
                    (Math.random() * 20 + 0).toFixed(1)
                );
                const randomDecimal2 = parseFloat(
                    (Math.floor(Math.random() * 20) + 0).toFixed(1)
                );
                const ansDecimal = (randomDecimal1 / randomDecimal2).toFixed(1);
                let decimalQn = {
                    qnA: randomDecimal1,
                    qnB: randomDecimal2,
                    ans: ansDecimal,
                    type: "easy",
                };
                questionArray.push(decimalQn);
            }

            for (var i = 0; i < numOfMedium; i++) {
                const randomDecimal1 = parseFloat(
                    (Math.random() * 50 + 0).toFixed(2)
                );
                const randomDecimal2 = parseFloat(
                    (Math.floor(Math.random() * 50) + 0).toFixed(2)
                );
                const ansDecimal = (randomDecimal1 / randomDecimal2).toFixed(2);
                let decimalQn = {
                    qnA: randomDecimal1,
                    qnB: randomDecimal2,
                    ans: ansDecimal,
                    type: "medium",
                };
                questionArray.push(decimalQn);
            }
            for (var i = 0; i < numOfHard; i++) {
                const randomDecimal1 = parseFloat(
                    (Math.random() * 99 + 0).toFixed(3)
                );
                const randomDecimal2 = parseFloat(
                    (Math.floor(Math.random() * 99) + 0).toFixed(3)
                );
                const ansDecimal = (randomDecimal1 / randomDecimal2).toFixed(3);
                let decimalQn = {
                    qnA: randomDecimal1,
                    qnB: randomDecimal2,
                    ans: ansDecimal,
                    type: "hard",
                };
                questionArray.push(decimalQn);
            }
        }
    },
    arrangeQuestion: () => {
        let content = "";
        let questionLine = "";
        let questionLine2 = "";
        if (quizData.skill_code == "DECIMAL_ROUNDING_OFF") {
            for (let i = 0; i < questionArray.length; i++) {
                content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5"><div class="small col-md-2">Question ${
                    i + 1
                }</div>`;
                if (questionArray[i].type == "easy") {
                    questionLine = "the nearest whole number";
                } else if (questionArray[i].type == "medium") {
                    questionLine = "the 1 decimal place";
                } else if (questionArray[i].type == "hard") {
                    questionLine = "the 2 decimal place";
                }
                content +=
                    `<div class="row col-md-6 align-items-center">Round off ` +
                    questionArray[i].qn +
                    ` to ` +
                    questionLine +
                    `</div><br><br> <div align-items-center>Answer: <input class="text-center" size = "1" id='input${i}'></div>`;

                content += `<div class='col-md-2 reviewClass'><span id='review${i}'></span></div></div>`;
            }
        } else if (quizData.skill_code == "DECIMAL_ADDITION_SUBTRACTION") {
            for (let i = 0; i < questionArray.length; i++) {
                content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5"><div class="small col-md-2">Question ${
                    i + 1
                }</div>`;
                if (questionArray[i].type == "easy") {
                    questionLine = "1 decimal place";
                    questionLine2 = "+";
                } else if (questionArray[i].type == "medium") {
                    questionLine = "2 decimal place";
                    questionLine2 = "+";
                } else if (questionArray[i].type == "hard") {
                    questionLine = "2 decimal place";
                    questionLine2 = "-";
                }
                content +=
                    `<div class="row col-md-8 align-items-center">Evaluate ` +
                    questionArray[i].qnA +
                    " " +
                    questionLine2 +
                    " " +
                    questionArray[i].qnB +
                    `. Enter the answer in ` +
                    questionLine +
                    `.</div><br><br> <div align-items-center>Answer: <input class="text-center" size = "1" id='input${i}'></div>`;

                content += `<div class='col-md-2 reviewClass'><span id='review${i}'></span></div></div>`;
            }
        } else if (
            quizData.skill_code == "DECIMAL_MULTIPLICATION" ||
            quizData.skill_code == "DECIMAL_DIVISION"
        ) {
            for (let i = 0; i < questionArray.length; i++) {
                content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5"><div class="small col-md-2">Question ${
                    i + 1
                }</div>`;
                if (questionArray[i].type == "easy") {
                    questionLine = "1 decimal place";
                } else if (questionArray[i].type == "medium") {
                    questionLine = "2 decimal place";
                } else if (questionArray[i].type == "hard") {
                    questionLine = "3 decimal place";
                }
                if (quizData.skill_code == "DECIMAL_MULTIPLICATION") {
                    questionLine2 = "x";
                } else if (quizData.skill_code == "DECIMAL_DIVISION") {
                    questionLine2 = "÷";
                }
                content +=
                    `<div class="row col-md-8 align-items-center">Evaluate ` +
                    questionArray[i].qnA +
                    " " +
                    questionLine2 +
                    " " +
                    questionArray[i].qnB +
                    `. Enter the answer in ` +
                    questionLine +
                    `.</div><br><br> <div align-items-center>Answer: <input class="text-center" size = "1" id='input${i}'></div>`;

                content += `<div class='col-md-2 reviewClass'><span id='review${i}'></span></div></div>`;
            }
        }
        return content;
    },
    markQuiz: () => {
        let score;
        let easy = 0;
        let medium = 0;
        let difficult = 0;
        let questions = [];

        const numOfQ = quizData.num_of_qn,
            percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);
        const numOfDifficult = numOfQ * (percentDifficulty[2] / 100);

        for (let i = 0; i < numOfQ; i++) {
            let review = '<i class="fas fa-check"></i>';
            let difficulty = "difficult";
            let isCorrect = false;
            let studentAns = {};

            let input =
                "ans" in questionArray[i] ? $(`#input${i}`).val() : undefined;
            let inputA =
                "ansA" in questionArray[i] ? $(`#inputA${i}`).val() : undefined;
            let inputB =
                "ansB" in questionArray[i] ? $(`#inputB${i}`).val() : undefined;

            if (input != undefined) studentAns["ans"] = input;
            if (inputA != undefined) studentAns["ansA"] = inputA;
            if (inputB != undefined) studentAns["ansB"] = inputB;

            $(".reviewClass").css("display", "block");

            if (
                inputA == questionArray[i].ansA &&
                inputB == questionArray[i].ansB &&
                input == questionArray[i].ans
            ) {
                if (i < numOfEasy) {
                    difficulty = "easy";
                    easy++;
                } else if (i < numOfEasy + numOfMedium) {
                    difficulty = "medium";
                    medium++;
                } else {
                    difficult++;
                }
                isCorrect = true;
            } else {
                review = '<i class="fas fa-times"></i>  Ans: ';

                if ("ans" in questionArray[i])
                    review += `${questionArray[i].ans}`;
                if ("ansA" in questionArray[i])
                    review += `<sup>${questionArray[i].ansA}</sup>&frasl;<sub>${questionArray[i].ansB}</sub>`;
            }
            document.getElementById(`review${i}`).innerHTML = review;

            questions.push({
                skill_id: quizData.skillId,
                question_number: i + 1,
                question: decimal.stringQuestion(questionArray[i]),
                answer: decimal.stringAnswer(studentAns),
                correct_answer: decimal.stringAnswer(questionArray[i]),
                isCorrect: isCorrect,
                difficulty: difficulty,
            });
        }

        score = {
            easy: (easy / numOfEasy) * 100,
            medium: (medium / numOfMedium) * 100,
            difficult: (difficult / numOfDifficult) * 100,
        };
        score["total"] =
            (((score.easy / 100) * numOfEasy +
                (score.medium / 100) * numOfMedium +
                (score.difficult / 100) * numOfDifficult) /
                numOfQ) *
            100;

        let points = easy * 5 + medium * 10 + difficult * 15;
        return [questions, score, points];
    },
};

//Algebra
const algebra2 = {
    gcd: (number1, number2) => {
        if (number2 == 0) {
            return number1;
        } else {
            var remainder = number1 % number2;
            return algebra2.gcd(number2, remainder);
        }
    },
    stringQuestion: (question) => {
        let result;

        if (
            quizData.skill_code == "ALGEBRA_ADDITION" ||
            quizData.skill_code == "ALGEBRA_MULTIPLICATION" ||
            quizData.skill_code == "ALGEBRA_DIVISION" ||
            quizData.skill_code == "ALGEBRA_EXPANSION" ||
            quizData.skill_code == "ALGEBRA_LINEAR_EQUATION"
        ) {
            result = question.qn;
        }

        return result;
    },
    stringAnswer: (answer) => {
        let result;

        if ("ansA" in answer) {
            "ans" in answer
                ? (result = answer.ans + " " + answer.ansA + "/" + answer.ansB)
                : (result = answer.ansA + "/" + answer.ansB);
        } else {
            result = answer.ans;
        }

        return result;
    },
    generateQuestion: (quizData) => {
        //output 0: {a: 6, b: 2, ans: 3}
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);
        const numOfHard = numOfQ * (percentDifficulty[2] / 100);

        if (quizData.skill_code == "ALGEBRA_ADDITION") {
            for (var i = 0; i < numOfEasy; i++) {
                var alphabet = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

                const firstNumber = parseFloat(
                    (Math.random() * 20 + 1).toFixed(0)
                );
                const secondNumber = parseFloat(
                    (Math.random() * 20 + 1).toFixed(0)
                );
                const qnTerms =
                    firstNumber + alphabet + "+" + secondNumber + alphabet;
                const ansNumber = firstNumber + secondNumber;
                const ansTerm = ansNumber + alphabet;
                let algebraQn = { qn: qnTerms, ans: ansTerm, type: "easy" };
                questionArray.push(algebraQn);
            }

            for (var i = 0; i < numOfMedium; i++) {
                var alphabet = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

                const firstNumber = parseFloat(
                    (Math.random() * 20 + 1).toFixed(0)
                );
                const secondNumber = parseFloat(
                    (Math.random() * 20 + 1).toFixed(0)
                );
                const thirdNumber = parseFloat(
                    (Math.random() * 20 + 1).toFixed(0)
                );

                const qnTerms =
                    firstNumber +
                    alphabet +
                    "+" +
                    secondNumber +
                    alphabet +
                    "+" +
                    thirdNumber +
                    alphabet;
                const ansNumber = firstNumber + secondNumber + thirdNumber;
                const ansTerm = ansNumber + alphabet;

                let algebraQn = { qn: qnTerms, ans: ansTerm, type: "medium" };
                questionArray.push(algebraQn);
            }
            //difficult_values
            for (var i = 0; i < numOfHard; i++) {
                var alphabet1 = "";
                var alphabet2 = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet1 += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );
                var possible2 = possible.replace(alphabet1, "");
                alphabet2 += possible2.charAt(
                    Math.floor(Math.random() * possible2.length)
                );

                const firstNumber = parseFloat(
                    (Math.random() * 20 + 1).toFixed(0)
                );
                const secondNumber = parseFloat(
                    (Math.random() * 20 + 1).toFixed(0)
                );
                const thirdNumber = parseFloat(
                    (Math.random() * 20 + 1).toFixed(0)
                );

                const patternNumber = Math.floor(Math.random() * 3 + 1);
                if (patternNumber == 1) {
                    console.log("1");
                    const qnTerms =
                        firstNumber +
                        alphabet1 +
                        "+" +
                        secondNumber +
                        alphabet1 +
                        "+" +
                        thirdNumber +
                        alphabet2;
                    const ansNumber = firstNumber + secondNumber;
                    const ansTerm =
                        ansNumber + alphabet1 + "+" + thirdNumber + alphabet2;
                    const ansTerm2 =
                        thirdNumber + alphabet2 + "+" + ansNumber + alphabet1;
                    let algebraQn = {
                        qn: qnTerms,
                        ans: ansTerm,
                        ans2: ansTerm2,
                        type: "hardv2",
                    };
                    questionArray.push(algebraQn);
                } else if (patternNumber == 2) {
                    console.log("2");
                    const qnTerms =
                        firstNumber +
                        alphabet1 +
                        "+" +
                        secondNumber +
                        alphabet2 +
                        "+" +
                        thirdNumber +
                        alphabet2;
                    const ansNumber = secondNumber + thirdNumber;
                    const ansTerm =
                        firstNumber + alphabet1 + "+" + ansNumber + alphabet2;
                    const ansTerm2 =
                        ansNumber + alphabet2 + "+" + firstNumber + alphabet1;
                    let algebraQn = {
                        qn: qnTerms,
                        ans: ansTerm,
                        ans2: ansTerm2,
                        type: "hardv2",
                    };
                    questionArray.push(algebraQn);
                } else if (patternNumber == 3) {
                    console.log("3");
                    const qnTerms =
                        firstNumber +
                        alphabet1 +
                        "+" +
                        secondNumber +
                        alphabet2 +
                        "+" +
                        thirdNumber +
                        alphabet1;
                    const ansNumber = firstNumber + thirdNumber;
                    const ansTerm =
                        secondNumber + alphabet2 + "+" + ansNumber + alphabet1;
                    const ansTerm2 =
                        ansNumber + alphabet1 + "+" + secondNumber + alphabet2;
                    let algebraQn = {
                        qn: qnTerms,
                        ans: ansTerm,
                        ans2: ansTerm2,
                        type: "hardv2",
                    };
                    questionArray.push(algebraQn);
                }
            }
        } else if (quizData.skill_code == "ALGEBRA_MULTIPLICATION") {
            for (var i = 0; i < numOfEasy; i++) {
                var alphabet = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

                let firstNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let firstpower = Math.floor(Math.random() * 9) + 1;
                let secondpower = Math.floor(Math.random() * 9) + 1;

                if (firstNumber == 0) {
                    firstNumber = 2;
                }
                if (firstNumber == 1) {
                    firstNumber = 3;
                }

                if (secondNumber == 0) {
                    secondNumber = 2;
                }
                if (secondNumber == 1) {
                    secondNumber = 3;
                }
                if (firstpower == 1) {
                    firstpower = 3;
                }

                if (secondpower == 1) {
                    secondpower = 3;
                }

                let ansTerm;

                let ansFirstTermForFrontend;
                let ansFirstPowerForFrontend;

                if (firstpower + secondpower == 0) {
                    ansTerm = firstNumber * secondNumber;

                    ansFirstTermForFrontend = firstNumber * secondNumber;
                    ansFirstPowerForFrontend = "";
                } else if (firstpower + secondpower == 1) {
                    ansTerm = firstNumber * secondNumber + alphabet;

                    ansFirstTermForFrontend =
                        firstNumber * secondNumber + alphabet;
                    ansFirstPowerForFrontend = "";
                } else {
                    ansTerm =
                        firstNumber * secondNumber +
                        alphabet +
                        "^" +
                        (firstpower + secondpower);

                    ansFirstTermForFrontend =
                        firstNumber * secondNumber + alphabet;
                    ansFirstPowerForFrontend = firstpower + secondpower;
                }

                let ansTermCheck;
                ansTermCheck = ansTerm.replace("^", "");

                if (firstNumber == -1) {
                    firstNumber = "-";
                }
                if (secondNumber == -1) {
                    secondNumber = "-";
                }

                const qnTerms =
                    firstNumber +
                    alphabet +
                    "^" +
                    firstpower +
                    "." +
                    secondNumber +
                    alphabet +
                    "^" +
                    secondpower;

                let algebraQn = {
                    qn: qnTerms,
                    qnFirstTerm: firstNumber + alphabet,
                    qnFirstPower: firstpower,
                    qnSecondTerm: secondNumber + alphabet,
                    qnSecondPower: secondpower,
                    ans: ansTermCheck,
                    ansDatabase: ansTerm,
                    ansFirstTerm: ansFirstTermForFrontend,
                    ansFirstPower: ansFirstPowerForFrontend,
                    type: "easy",
                };
                questionArray.push(algebraQn);
            }
            for (var i = 0; i < numOfMedium; i++) {
                var alphabet = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

                let firstNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let firstpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);

                if (firstNumber == 0) {
                    firstNumber = 2;
                }
                if (firstNumber == 1) {
                    firstNumber = 3;
                }

                if (secondNumber == 0) {
                    secondNumber = 2;
                }
                if (secondNumber == 1) {
                    secondNumber = 3;
                }

                if (firstpower == 0) {
                    firstpower = 2;
                }
                if (firstpower == 1) {
                    firstpower = 3;
                }

                if (secondpower == 0) {
                    secondpower = 2;
                }
                if (secondpower == 1) {
                    secondpower = 3;
                }

                let ansTerm;

                let ansFirstTermForFrontend;
                let ansFirstPowerForFrontend;

                if (firstpower + secondpower == 0) {
                    ansTerm = firstNumber * secondNumber;

                    ansFirstTermForFrontend = firstNumber * secondNumber;
                    ansFirstPowerForFrontend = "";
                } else if (firstpower + secondpower == 1) {
                    ansTerm = firstNumber * secondNumber + alphabet;

                    ansFirstTermForFrontend =
                        firstNumber * secondNumber + alphabet;
                    ansFirstPowerForFrontend = "";
                } else {
                    ansTerm =
                        firstNumber * secondNumber +
                        alphabet +
                        "^" +
                        (firstpower + secondpower);

                    ansFirstTermForFrontend =
                        firstNumber * secondNumber + alphabet;
                    ansFirstPowerForFrontend = firstpower + secondpower;
                }

                let ansTermCheck;
                ansTermCheck = ansTerm.replace("^", "");

                if (firstNumber == -1) {
                    firstNumber = "-";
                }
                if (secondNumber == -1) {
                    secondNumber = "-";
                }

                const qnTerms =
                    firstNumber +
                    alphabet +
                    "^" +
                    firstpower +
                    "." +
                    secondNumber +
                    alphabet +
                    "^" +
                    secondpower;

                let algebraQn = {
                    qn: qnTerms,
                    qnFirstTerm: firstNumber + alphabet,
                    qnFirstPower: firstpower,
                    qnSecondTerm: secondNumber + alphabet,
                    qnSecondPower: secondpower,
                    ans: ansTermCheck,
                    ansDatabase: ansTerm,
                    ansFirstTerm: ansFirstTermForFrontend,
                    ansFirstPower: ansFirstPowerForFrontend,
                    type: "medium",
                };
                questionArray.push(algebraQn);
            }
            for (var i = 0; i < numOfHard; i++) {
                var alphabet1 = "";
                var alphabet2 = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet1 += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );
                var possible2 = possible.replace(alphabet1, "");
                alphabet2 += possible2.charAt(
                    Math.floor(Math.random() * possible2.length)
                );

                let firstNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let firstpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let thirdpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);

                if (firstNumber == 0) {
                    firstNumber = 2;
                }
                if (firstNumber == 1) {
                    firstNumber = 3;
                }

                if (secondNumber == 0) {
                    secondNumber = 2;
                }
                if (secondNumber == 1) {
                    secondNumber = 3;
                }

                if (firstpower == 0) {
                    firstpower = 2;
                }
                if (firstpower == 1) {
                    firstpower = 3;
                }

                if (secondpower == 0) {
                    secondpower = 2;
                }
                if (secondpower == 1) {
                    secondpower = 3;
                }

                if (thirdpower == 0) {
                    thirdpower = 2;
                }
                if (thirdpower == 1) {
                    thirdpower = 3;
                }

                let ansTerm;
                let ansTerm2;

                let ansTermCheck;
                let ansTermCheck2;
                let typeofQn = "hardv2";

                let ansFirstTermForFrontend;
                let ansFirstPowerForFrontend;
                let ansSecondTermForFrontend;
                let ansSecondPowerForFrontend;

                let ans2FirstTermForFrontend;
                let ans2FirstPowerForFrontend;
                let ans2SecondTermForFrontend;
                let ans2SecondPowerForFrontend;

                if (secondpower + thirdpower == 0) {
                    ansTerm =
                        firstNumber * secondNumber +
                        alphabet1 +
                        "^" +
                        firstpower;
                    typeofQn = "hard";

                    ansTermCheck =
                        firstNumber * secondNumber + alphabet1 + firstpower;

                    ansFirstTermForFrontend =
                        firstNumber * secondNumber + alphabet1;
                    ansFirstPowerForFrontend = firstpower;
                    ansSecondTermForFrontend = "";
                    ansSecondPowerForFrontend = "";

                    ans2FirstTermForFrontend = "";
                    ans2FirstPowerForFrontend = "";
                    ans2SecondTermForFrontend = "";
                    ans2SecondPowerForFrontend = "";
                } else if (secondpower + thirdpower == 1) {
                    ansTerm =
                        firstNumber * secondNumber +
                        alphabet1 +
                        "^" +
                        firstpower +
                        "." +
                        alphabet2;
                    ansTermCheck =
                        firstNumber * secondNumber +
                        alphabet1 +
                        firstpower +
                        alphabet2;

                    ansFirstTermForFrontend =
                        firstNumber * secondNumber + alphabet1;
                    ansFirstPowerForFrontend = firstpower;
                    ansSecondTermForFrontend = alphabet2;
                    ansSecondPowerForFrontend = "";

                    ansTerm2 =
                        firstNumber * secondNumber +
                        alphabet2 +
                        "." +
                        alphabet1 +
                        "^" +
                        firstpower;
                    ansTermCheck2 =
                        firstNumber * secondNumber +
                        alphabet2 +
                        alphabet1 +
                        firstpower;

                    ans2FirstTermForFrontend =
                        firstNumber * secondNumber + alphabet2;
                    ans2FirstPowerForFrontend = "";
                    ans2SecondTermForFrontend = alphabet1;
                    ans2SecondPowerForFrontend = firstpower;
                } else {
                    ansTerm =
                        firstNumber * secondNumber +
                        alphabet1 +
                        "^" +
                        firstpower +
                        "." +
                        alphabet2 +
                        "^" +
                        (secondpower + thirdpower);
                    ansTermCheck =
                        firstNumber * secondNumber +
                        alphabet1 +
                        firstpower +
                        alphabet2 +
                        (secondpower + thirdpower);

                    ansFirstTermForFrontend =
                        firstNumber * secondNumber + alphabet1;
                    ansFirstPowerForFrontend = firstpower;
                    ansSecondTermForFrontend = alphabet2;
                    ansSecondPowerForFrontend = secondpower + thirdpower;

                    ansTerm2 =
                        firstNumber * secondNumber +
                        alphabet2 +
                        "^" +
                        (secondpower + thirdpower) +
                        "." +
                        alphabet1 +
                        "^" +
                        firstpower;
                    ansTermCheck2 =
                        firstNumber * secondNumber +
                        alphabet2 +
                        (secondpower + thirdpower) +
                        alphabet1 +
                        firstpower;
                    ans2FirstTermForFrontend =
                        firstNumber * secondNumber + alphabet2;
                    ans2FirstPowerForFrontend = secondpower + thirdpower;
                    ans2SecondTermForFrontend = alphabet1;
                    ans2SecondPowerForFrontend = firstpower;
                }

                if (firstNumber == -1) {
                    firstNumber = "-";
                }
                if (secondNumber == -1) {
                    secondNumber = "-";
                }

                const qnTerms =
                    firstNumber +
                    alphabet1 +
                    "^" +
                    firstpower +
                    "." +
                    secondNumber +
                    alphabet2 +
                    "^" +
                    secondpower +
                    "." +
                    alphabet2 +
                    "^" +
                    thirdpower;

                let algebraQn = {
                    qn: qnTerms,
                    qnFirstTerm: firstNumber + alphabet1,
                    qnFirstPower: firstpower,
                    qnSecondTerm: secondNumber + alphabet2,
                    qnSecondPower: secondpower,
                    qnThirdTerm: alphabet2,
                    qnThirdPower: thirdpower,
                    ansDatabase: ansTerm,
                    ansDatabase2: ansTerm2,
                    ans: ansTermCheck,
                    ans2: ansTermCheck2,
                    ansFirstTerm: ansFirstTermForFrontend,
                    ansFirstPower: ansFirstPowerForFrontend,
                    ansSecondTerm: ansSecondTermForFrontend,
                    ansSecondPower: ansSecondPowerForFrontend,
                    ans2FirstTerm: ans2FirstTermForFrontend,
                    ans2FirstPower: ans2FirstPowerForFrontend,
                    ans2SecondTerm: ans2SecondTermForFrontend,
                    ans2SecondPower: ans2SecondPowerForFrontend,
                    type: typeofQn,
                };
                questionArray.push(algebraQn);
            }
        } else if (quizData.skill_code == "ALGEBRA_DIVISION") {
            for (var i = 0; i < numOfEasy; i++) {
                var alphabet = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );
               

                let firstNumberqn = Math.floor(Math.random() * 9 + 2);
                let secondNumberqn = Math.floor(Math.random() * 9 + 2);
                let firstpower = Math.floor(Math.random() * 9) + 1;
                let secondpower = Math.floor(Math.random() * 9) + 1;

               

                let firstNumberans;
                let secondNumberans;
                let firstpowerans;
                let secondpowerans;

                let firstNumber = firstNumberqn;
                let secondNumber = secondNumberqn;

                let HCF = algebra2.gcd(firstNumber, secondNumber);

                if (firstpower > secondpower) {
                    firstpowerans = alphabet + "^" + (firstpower - secondpower);
                    secondpowerans = "";
                } else if (secondpower > firstpower) {
                    secondpowerans =
                        alphabet + "^" + (secondpower - firstpower);
                    firstpowerans = "";
                } else if (firstpower == secondpower) {
                    firstpowerans = "";
                    secondpowerans = "";
                }

                firstNumberans = firstNumber / HCF;
                secondNumberans = secondNumber / HCF;

                let qnTerms1 = firstNumber + alphabet + "^" + firstpower;
                let qnTerms2 = secondNumber + alphabet + "^" + secondpower;

                let ansTerm1 = firstNumberans + firstpowerans;
                let ansTerm2 = secondNumberans + secondpowerans;

                let qnNumerator;
                let qnNumeratorPower;

                let qnDenominator;
                let qnDenominatorPower;
                if (firstNumber == 1) {
                    qnNumerator = alphabet;
                } else {
                    qnNumerator = firstNumber + alphabet;
                }
                if (firstpower == 1) {
                    qnNumeratorPower = "";
                } else {
                    qnNumeratorPower = firstpower;
                }

                if (secondNumber == 1) {
                    qnDenominator = alphabet;
                } else {
                    qnDenominator = secondNumber + alphabet;
                }
                if (secondpower == 1) {
                    qnDenominatorPower = "";
                } else {
                    qnDenominatorPower = secondpower;
                }

                qnTerms1 = qnTerms1.replace("^1", "");
                qnTerms2 = qnTerms2.replace("^1", "");
                ansTerm1 = ansTerm1.replace("^1", "");
                ansTerm2 = ansTerm2.replace("^1", "");

                qnTerms1 = qnTerms1.replace("1" + alphabet, alphabet);
                qnTerms2 = qnTerms2.replace("1" + alphabet, alphabet);
                ansTerm1 = ansTerm1.replace("1" + alphabet, alphabet);
                ansTerm2 = ansTerm2.replace("1" + alphabet, alphabet);

                let ansNumerator;
                let ansNumeratorPower;

                let ansDenominator;
                let ansDenominatorPower;

                if (ansTerm1.indexOf("^") == -1) {
                    ansNumerator = ansTerm1;
                    ansNumeratorPower = "";
                } else {
                    ansNumerator = ansTerm1.slice(0, ansTerm1.indexOf("^"));
                    ansNumeratorPower = ansTerm1.slice(
                        ansTerm1.indexOf("^") + 1
                    );
                }

                if (ansTerm2.indexOf("^") == -1) {
                    ansDenominator = ansTerm2;
                    ansDenominatorPower = "";
                } else {
                    ansDenominator = ansTerm2.slice(0, ansTerm2.indexOf("^"));
                    ansDenominatorPower = ansTerm2.slice(
                        ansTerm2.indexOf("^") + 1
                    );
                }

                ansTerm1 = ansTerm1.replace("^", "");
                ansTerm2 = ansTerm2.replace("^", "");

                //answer type 2
                let answer2;
                if(ansTerm1.indexOf(alphabet)!=-1){//alphabet exists in term 1
                    if(ansTerm2==1){
                        answer2=ansTerm1;
                    }else{
                        if(ansTerm1.indexOf(alphabet)!=0){
                            answer2=ansTerm1.slice(0,ansTerm1.indexOf(alphabet))+ "\n" +ansTerm2+ "\n" +ansTerm1.slice(ansTerm1.indexOf(alphabet))
                        }else{
                            answer2=1+"\n"+ansTerm2+"\n"+ansTerm1
                        }
                    }


                }else{//alphabet exists in term 2
                    if(ansTerm2.indexOf(alphabet)!=0){
                        answer2=ansTerm1+ "\n" +ansTerm2.slice(0,ansTerm2.indexOf(alphabet))+ "\n" + (ansTerm2.slice(ansTerm2.indexOf(alphabet))).replace(alphabet,alphabet+"-")

                    }else{
                        if(ansTerm1==1){
                            answer2=(ansTerm2.slice(ansTerm2.indexOf(alphabet))).replace(alphabet,alphabet+"-")
                        }else{
                            answer2=ansTerm1+(ansTerm2.slice(ansTerm2.indexOf(alphabet))).replace(alphabet,alphabet+"-")
                        }

                    }

                }

                //check -1 power
                if(answer2.charAt(answer2.length-1)=="-"){
                    answer2=answer2+"1";
                }

                let algebraQn;
                if (ansTerm2 == 1) {
                    algebraQn = {
                        qn: qnTerms1 + "/" + qnTerms2,
                        ans: ansTerm1,
                        ans2:answer2,
                        alphabetData:alphabet,
                        type: "easy",
                        QnNumerator: qnNumerator,
                        QnNumeratorPower: qnNumeratorPower,
                        QnDenominator: qnDenominator,
                        QnDenominatorPower: qnDenominatorPower,
                        fraction: "No",
                        AnsNumerator: ansNumerator,
                        AnsNumeratorPower: ansNumeratorPower,
                        AnsDenominator: ansDenominator,
                        AnsDenominatorPower: ansDenominatorPower,
                    };
                } else {
                    algebraQn = {
                        qn: qnTerms1 + "/" + qnTerms2,
                        ans: ansTerm1 + "\n" + ansTerm2,
                        ans2:answer2,
                        alphabetData:alphabet,
                        type: "easy",
                        QnNumerator: qnNumerator,
                        QnNumeratorPower: qnNumeratorPower,
                        QnDenominator: qnDenominator,
                        QnDenominatorPower: qnDenominatorPower,
                        fraction: "Yes",
                        AnsNumerator: ansNumerator,
                        AnsNumeratorPower: ansNumeratorPower,
                        AnsDenominator: ansDenominator,
                        AnsDenominatorPower: ansDenominatorPower,
                    };
                }

                questionArray.push(algebraQn);
            }
            for (var i = 0; i < numOfMedium; i++) {
                var alphabet = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

                let firstNumberqn = Math.floor(
                    Math.random() * (9 * 2 + 1) + -9
                );
                let secondNumberqn = Math.floor(
                    Math.random() * (9 * 2 + 1) + -9
                );
                let firstpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);

                let firstNumberans;
                let secondNumberans;
                let firstpowerans;
                let secondpowerans;

                let firstNumber = firstNumberqn;
                let secondNumber = secondNumberqn;

                let firstNegativenumber;
                let secondNegativenumber;

                if (firstNumber == 0) {
                    firstNumber = 2;
                }

                if (secondNumber == 0) {
                    secondNumber = 2;
                }

                if (firstpower == 0) {
                    firstpower = 2;
                }

                if (secondpower == 0) {
                    secondpower = 2;
                }

                if (firstNumber < 0) {
                    firstNegativenumber = true;
                    firstNumber = Math.abs(firstNumber);
                } else {
                    firstNegativenumber = false;
                }
                if (secondNumber < 0) {
                    secondNegativenumber = true;
                    secondNumber = Math.abs(secondNumber);
                } else {
                    secondNegativenumber = false;
                }

                let HCF = algebra2.gcd(firstNumber, secondNumber);

                if (firstpower > secondpower) {
                    firstpowerans = alphabet + "^" + (firstpower - secondpower);
                    secondpowerans = "";
                } else if (secondpower > firstpower) {
                    secondpowerans =
                        alphabet + "^" + (secondpower - firstpower);
                    firstpowerans = "";
                } else if (firstpower == secondpower) {
                    firstpowerans = "";
                    secondpowerans = "";
                }

                firstNumberans = firstNumber / HCF;
                secondNumberans = secondNumber / HCF;
                let qnTerms1;
                let qnTerms2;
                let ansTerm1;
                let ansTerm2;

                let qnNumerator;
                let qnNumeratorPower;

                let qnDenominator;
                let qnDenominatorPower;

                if (
                    firstNegativenumber == true &&
                    secondNegativenumber == true
                ) {
                    qnTerms1 = "-" + firstNumber + alphabet + "^" + firstpower;
                    qnTerms2 =
                        "-" + secondNumber + alphabet + "^" + secondpower;

                    if (firstNumber == 1) {
                        qnNumerator = "-" + alphabet;
                    } else {
                        qnNumerator = "-" + firstNumber + alphabet;
                    }
                    if (firstpower == 1) {
                        qnNumeratorPower = "";
                    } else {
                        qnNumeratorPower = firstpower;
                    }

                    if (secondNumber == 1) {
                        qnDenominator = "-" + alphabet;
                    } else {
                        qnDenominator = "-" + secondNumber + alphabet;
                    }
                    if (secondpower == 1) {
                        qnDenominatorPower = "";
                    } else {
                        qnDenominatorPower = secondpower;
                    }

                    ansTerm1 = firstNumberans + firstpowerans;
                    ansTerm2 = secondNumberans + secondpowerans;
                } else if (
                    firstNegativenumber == false &&
                    secondNegativenumber == false
                ) {
                    qnTerms1 = firstNumber + alphabet + "^" + firstpower;
                    qnTerms2 = secondNumber + alphabet + "^" + secondpower;

                    if (firstNumber == 1) {
                        qnNumerator = alphabet;
                    } else {
                        qnNumerator = firstNumber + alphabet;
                    }
                    if (firstpower == 1) {
                        qnNumeratorPower = "";
                    } else {
                        qnNumeratorPower = firstpower;
                    }

                    if (secondNumber == 1) {
                        qnDenominator = alphabet;
                    } else {
                        qnDenominator = secondNumber + alphabet;
                    }
                    if (secondpower == 1) {
                        qnDenominatorPower = "";
                    } else {
                        qnDenominatorPower = secondpower;
                    }

                    ansTerm1 = firstNumberans + firstpowerans;
                    ansTerm2 = secondNumberans + secondpowerans;
                } else if (
                    firstNegativenumber == true &&
                    secondNegativenumber == false
                ) {
                    qnTerms1 = "-" + firstNumber + alphabet + "^" + firstpower;
                    qnTerms2 = secondNumber + alphabet + "^" + secondpower;

                    if (firstNumber == 1) {
                        qnNumerator = "-" + alphabet;
                    } else {
                        qnNumerator = "-" + firstNumber + alphabet;
                    }
                    if (firstpower == 1) {
                        qnNumeratorPower = "";
                    } else {
                        qnNumeratorPower = firstpower;
                    }

                    if (secondNumber == 1) {
                        qnDenominator = alphabet;
                    } else {
                        qnDenominator = secondNumber + alphabet;
                    }
                    if (secondpower == 1) {
                        qnDenominatorPower = "";
                    } else {
                        qnDenominatorPower = secondpower;
                    }

                    ansTerm1 = "-" + firstNumberans + firstpowerans;
                    ansTerm2 = secondNumberans + secondpowerans;
                } else if (
                    firstNegativenumber == false &&
                    secondNegativenumber == true
                ) {
                    qnTerms1 = firstNumber + alphabet + "^" + firstpower;
                    qnTerms2 =
                        "-" + secondNumber + alphabet + "^" + secondpower;

                    if (firstNumber == 1) {
                        qnNumerator = alphabet;
                    } else {
                        qnNumerator = firstNumber + alphabet;
                    }
                    if (firstpower == 1) {
                        qnNumeratorPower = "";
                    } else {
                        qnNumeratorPower = firstpower;
                    }

                    if (secondNumber == 1) {
                        qnDenominator = "-" + alphabet;
                    } else {
                        qnDenominator = "-" + secondNumber + alphabet;
                    }
                    if (secondpower == 1) {
                        qnDenominatorPower = "";
                    } else {
                        qnDenominatorPower = secondpower;
                    }

                    ansTerm1 = "-" + firstNumberans + firstpowerans;
                    ansTerm2 = secondNumberans + secondpowerans;
                }

                if (qnTerms1.includes("^1")) {
                    if (
                        qnTerms1.includes("^10") == true ||
                        qnTerms1.includes("^11") == true ||
                        qnTerms1.includes("^12") == true ||
                        qnTerms1.includes("^13") == true ||
                        qnTerms1.includes("^14") == true ||
                        qnTerms1.includes("^15") == true ||
                        qnTerms1.includes("^16") == true ||
                        qnTerms1.includes("^17") == true ||
                        qnTerms1.includes("^18") == true ||
                        qnTerms1.includes("^19") == true
                    ) {
                    } else {
                        qnTerms1 = qnTerms1.replace("^1", "");
                    }
                }

                if (qnTerms2.includes("^1")) {
                    if (
                        qnTerms2.includes("^10") == true ||
                        qnTerms2.includes("^11") == true ||
                        qnTerms2.includes("^12") == true ||
                        qnTerms2.includes("^13") == true ||
                        qnTerms2.includes("^14") == true ||
                        qnTerms2.includes("^15") == true ||
                        qnTerms2.includes("^16") == true ||
                        qnTerms2.includes("^17") == true ||
                        qnTerms2.includes("^18") == true ||
                        qnTerms2.includes("^19") == true
                    ) {
                    } else {
                        qnTerms2 = qnTerms2.replace("^1", "");
                    }
                }

                if (ansTerm1.includes("^1")) {
                    if (
                        ansTerm1.includes("^10") == true ||
                        ansTerm1.includes("^11") == true ||
                        ansTerm1.includes("^12") == true ||
                        ansTerm1.includes("^13") == true ||
                        ansTerm1.includes("^14") == true ||
                        ansTerm1.includes("^15") == true ||
                        ansTerm1.includes("^16") == true ||
                        ansTerm1.includes("^17") == true ||
                        ansTerm1.includes("^18") == true ||
                        ansTerm1.includes("^19") == true
                    ) {
                    } else {
                        ansTerm1 = ansTerm1.replace("^1", "");
                    }
                }

                if (ansTerm2.includes("^1")) {
                    if (
                        ansTerm2.includes("^10") == true ||
                        ansTerm2.includes("^11") == true ||
                        ansTerm2.includes("^12") == true ||
                        ansTerm2.includes("^13") == true ||
                        ansTerm2.includes("^14") == true ||
                        ansTerm2.includes("^15") == true ||
                        ansTerm2.includes("^16") == true ||
                        ansTerm2.includes("^17") == true ||
                        ansTerm2.includes("^18") == true ||
                        ansTerm2.includes("^19") == true
                    ) {
                    } else {
                        ansTerm2 = ansTerm2.replace("^1", "");
                    }
                }

                qnTerms1 = qnTerms1.replace("1" + alphabet, alphabet);
                qnTerms2 = qnTerms2.replace("1" + alphabet, alphabet);
                ansTerm1 = ansTerm1.replace("1" + alphabet, alphabet);
                ansTerm2 = ansTerm2.replace("1" + alphabet, alphabet);

                let ansNumerator;
                let ansNumeratorPower;

                let ansDenominator;
                let ansDenominatorPower;

                if (ansTerm1.indexOf("^") == -1) {
                    ansNumerator = ansTerm1;
                    ansNumeratorPower = "";
                } else {
                    ansNumerator = ansTerm1.slice(0, ansTerm1.indexOf("^"));
                    ansNumeratorPower = ansTerm1.slice(
                        ansTerm1.indexOf("^") + 1
                    );
                }

                if (ansTerm2.indexOf("^") == -1) {
                    ansDenominator = ansTerm2;
                    ansDenominatorPower = "";
                } else {
                    ansDenominator = ansTerm2.slice(0, ansTerm2.indexOf("^"));
                    ansDenominatorPower = ansTerm2.slice(
                        ansTerm2.indexOf("^") + 1
                    );
                }

                ansTerm1 = ansTerm1.replace("^", "");
                ansTerm2 = ansTerm2.replace("^", "");




                 //answer type 2
                 let answer2;
                 if(ansTerm1.indexOf(alphabet)!=-1){//alphabet exists in term 1
                     if(ansTerm2==1){
                         answer2=ansTerm1;
                     }else{
                         if(ansTerm1.indexOf(alphabet)!=0){
                             answer2=ansTerm1.slice(0,ansTerm1.indexOf(alphabet))+ "\n" +ansTerm2+ "\n" +ansTerm1.slice(ansTerm1.indexOf(alphabet))
                         }else{
                             answer2=1+"\n"+ansTerm2+"\n"+ansTerm1
                         }
                     }
 
 
                 }else{//alphabet exists in term 2
                     if(ansTerm2.indexOf(alphabet)!=0){
                         answer2=ansTerm1+ "\n" +ansTerm2.slice(0,ansTerm2.indexOf(alphabet))+ "\n" + (ansTerm2.slice(ansTerm2.indexOf(alphabet))).replace(alphabet,alphabet+"-")
 
                     }else{
                         if(ansTerm1==1){
                             answer2=(ansTerm2.slice(ansTerm2.indexOf(alphabet))).replace(alphabet,alphabet+"-")
                         }else{
                             answer2=ansTerm1+(ansTerm2.slice(ansTerm2.indexOf(alphabet))).replace(alphabet,alphabet+"-")
                         }
 
                     }
 
                 }
 
                 //check -1 power
                 if(answer2.charAt(answer2.length-1)=="-"){
                     answer2=answer2+"1";
                 }
                 answer2=answer2.replace("-1"+alphabet,"-"+alphabet)

                 //add 1 to -1
                 answer2=answer2.replace("-\n","-1\n")

                let algebraQn;
                if (ansTerm2 == 1) {
                    algebraQn = {
                        qn: qnTerms1 + "/" + qnTerms2,
                        ans: ansTerm1,
                        ans2:answer2,
                        alphabetData:alphabet,
                        type: "medium",
                        QnNumerator: qnNumerator,
                        QnNumeratorPower: qnNumeratorPower,
                        QnDenominator: qnDenominator,
                        QnDenominatorPower: qnDenominatorPower,
                        fraction: "No",
                        AnsNumerator: ansNumerator,
                        AnsNumeratorPower: ansNumeratorPower,
                        AnsDenominator: ansDenominator,
                        AnsDenominatorPower: ansDenominatorPower,
                    };
                } else {
                    algebraQn = {
                        qn: qnTerms1 + "/" + qnTerms2,
                        ans: ansTerm1 + "\n" + ansTerm2,
                        ans2:answer2,
                        alphabetData:alphabet,
                        type: "medium",
                        QnNumerator: qnNumerator,
                        QnNumeratorPower: qnNumeratorPower,
                        QnDenominator: qnDenominator,
                        QnDenominatorPower: qnDenominatorPower,
                        fraction: "Yes",
                        AnsNumerator: ansNumerator,
                        AnsNumeratorPower: ansNumeratorPower,
                        AnsDenominator: ansDenominator,
                        AnsDenominatorPower: ansDenominatorPower,
                    };
                }

                questionArray.push(algebraQn);
            }
            for (var i = 0; i < numOfHard; i++) {
                var alphabet = "";
                var alphabet2 = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

                var possible2 = possible.replace(alphabet, "");
                alphabet2 += possible2.charAt(
                    Math.floor(Math.random() * possible2.length)
                );

                let firstNumberqn = Math.floor(
                    Math.random() * (9 * 2 + 1) + -9
                );
                let secondNumberqn = Math.floor(
                    Math.random() * (9 * 2 + 1) + -9
                );
                let firstpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);

                let thirdpower = Math.floor(Math.random() * (9 * 2 + 1) + -9);

                let firstNumberans;
                let secondNumberans;
                let firstpowerans;
                let secondpowerans;

                let firstNumber = firstNumberqn;
                let secondNumber = secondNumberqn;

                let firstNegativenumber;
                let secondNegativenumber;

                if (firstNumber == 0) {
                    firstNumber = 2;
                }

                if (secondNumber == 0) {
                    secondNumber = 2;
                }

                if (firstpower == 0) {
                    firstpower = 2;
                }

                if (secondpower == 0) {
                    secondpower = 2;
                }

                if (thirdpower == 0) {
                    thirdpower = 2;
                }

                if (firstNumber < 0) {
                    firstNegativenumber = true;
                    firstNumber = Math.abs(firstNumber);
                } else {
                    firstNegativenumber = false;
                }
                if (secondNumber < 0) {
                    secondNegativenumber = true;
                    secondNumber = Math.abs(secondNumber);
                } else {
                    secondNegativenumber = false;
                }

                let HCF = algebra2.gcd(firstNumber, secondNumber);

                if (firstpower > secondpower) {
                    firstpowerans = alphabet + "^" + (firstpower - secondpower);
                    secondpowerans = "";
                } else if (secondpower > firstpower) {
                    secondpowerans =
                        alphabet + "^" + (secondpower - firstpower);
                    firstpowerans = "";
                } else if (firstpower == secondpower) {
                    firstpowerans = "";
                    secondpowerans = "";
                }

                firstNumberans = firstNumber / HCF;
                secondNumberans = secondNumber / HCF;
                let qnTerms1;
                let qnTerms2;
                let ansTerm1;
                let ansTerm2;

                if (
                    firstNegativenumber == true &&
                    secondNegativenumber == true
                ) {
                    qnTerms1 =
                        "-" +
                        firstNumber +
                        alphabet +
                        "^" +
                        firstpower +
                        "." +
                        alphabet2 +
                        "^" +
                        thirdpower;
                    qnTerms2 =
                        "-" + secondNumber + alphabet + "^" + secondpower;
                    //frontend qn terms

                    //Numerator
                    if (firstNumber == 1) {
                        qnNumerator = "-" + alphabet;
                        qnNumerator2 = alphabet2;
                    } else {
                        qnNumerator = "-" + firstNumber + alphabet;
                        qnNumerator2 = alphabet2;
                    }
                    if (firstpower == 1) {
                        qnNumeratorPower = "";
                        if (thirdpower == 1) {
                            qnNumeratorPower2 = "";
                        } else {
                            qnNumeratorPower2 = thirdpower;
                        }
                    } else {
                        qnNumeratorPower = firstpower;
                        if (thirdpower == 1) {
                            qnNumeratorPower2 = "";
                        } else {
                            qnNumeratorPower2 = thirdpower;
                        }
                    }

                    //Denominator
                    if (secondNumber == 1) {
                        qnDenominator = "-" + alphabet;
                    } else {
                        qnDenominator = "-" + secondNumber + alphabet;
                    }
                    if (secondpower == 1) {
                        qnDenominatorPower = "";
                    } else {
                        qnDenominatorPower = secondpower;
                    }
                    //end of frontend qn terms
                    if (firstpowerans == "") {
                        ansTerm1 =
                            firstNumberans +
                            firstpowerans +
                            alphabet2 +
                            "^" +
                            thirdpower;
                    } else {
                        ansTerm1 =
                            firstNumberans +
                            firstpowerans +
                            "." +
                            alphabet2 +
                            "^" +
                            thirdpower;
                    }

                    ansTerm2 = secondNumberans + secondpowerans;
                } else if (
                    firstNegativenumber == false &&
                    secondNegativenumber == false
                ) {
                    qnTerms1 =
                        firstNumber +
                        alphabet +
                        "^" +
                        firstpower +
                        "." +
                        alphabet2 +
                        "^" +
                        thirdpower;
                    qnTerms2 = secondNumber + alphabet + "^" + secondpower;

                    //frontend qn terms

                    //Numerator
                    if (firstNumber == 1) {
                        qnNumerator = alphabet;
                        qnNumerator2 = alphabet2;
                    } else {
                        qnNumerator = firstNumber + alphabet;
                        qnNumerator2 = alphabet2;
                    }
                    if (firstpower == 1) {
                        qnNumeratorPower = "";
                        if (thirdpower == 1) {
                            qnNumeratorPower2 = "";
                        } else {
                            qnNumeratorPower2 = thirdpower;
                        }
                    } else {
                        qnNumeratorPower = firstpower;
                        if (thirdpower == 1) {
                            qnNumeratorPower2 = "";
                        } else {
                            qnNumeratorPower2 = thirdpower;
                        }
                    }

                    //Denominator
                    if (secondNumber == 1) {
                        qnDenominator = alphabet;
                    } else {
                        qnDenominator = secondNumber + alphabet;
                    }
                    if (secondpower == 1) {
                        qnDenominatorPower = "";
                    } else {
                        qnDenominatorPower = secondpower;
                    }
                    //end of frontend qn terms

                    if (firstpowerans == "") {
                        ansTerm1 =
                            firstNumberans +
                            firstpowerans +
                            alphabet2 +
                            "^" +
                            thirdpower;
                    } else {
                        ansTerm1 =
                            firstNumberans +
                            firstpowerans +
                            "." +
                            alphabet2 +
                            "^" +
                            thirdpower;
                    }
                    ansTerm2 = secondNumberans + secondpowerans;
                } else if (
                    firstNegativenumber == true &&
                    secondNegativenumber == false
                ) {
                    qnTerms1 =
                        "-" +
                        firstNumber +
                        alphabet +
                        "^" +
                        firstpower +
                        "." +
                        alphabet2 +
                        "^" +
                        thirdpower;
                    qnTerms2 = secondNumber + alphabet + "^" + secondpower;

                    //frontend qn terms

                    //Numerator
                    if (firstNumber == 1) {
                        qnNumerator = "-" + alphabet;
                        qnNumerator2 = alphabet2;
                    } else {
                        qnNumerator = "-" + firstNumber + alphabet;
                        qnNumerator2 = alphabet2;
                    }
                    if (firstpower == 1) {
                        qnNumeratorPower = "";
                        if (thirdpower == 1) {
                            qnNumeratorPower2 = "";
                        } else {
                            qnNumeratorPower2 = thirdpower;
                        }
                    } else {
                        qnNumeratorPower = firstpower;
                        if (thirdpower == 1) {
                            qnNumeratorPower2 = "";
                        } else {
                            qnNumeratorPower2 = thirdpower;
                        }
                    }

                    //Denominator
                    if (secondNumber == 1) {
                        qnDenominator = alphabet;
                    } else {
                        qnDenominator = secondNumber + alphabet;
                    }
                    if (secondpower == 1) {
                        qnDenominatorPower = "";
                    } else {
                        qnDenominatorPower = secondpower;
                    }

                    if (firstpowerans == "") {
                        ansTerm1 =
                            "-" +
                            firstNumberans +
                            firstpowerans +
                            alphabet2 +
                            "^" +
                            thirdpower;
                    } else {
                        ansTerm1 =
                            "-" +
                            firstNumberans +
                            firstpowerans +
                            "." +
                            alphabet2 +
                            "^" +
                            thirdpower;
                    }
                    ansTerm2 = secondNumberans + secondpowerans;
                } else if (
                    firstNegativenumber == false &&
                    secondNegativenumber == true
                ) {
                    qnTerms1 =
                        firstNumber +
                        alphabet +
                        "^" +
                        firstpower +
                        "." +
                        alphabet2 +
                        "^" +
                        thirdpower;
                    qnTerms2 =
                        "-" + secondNumber + alphabet + "^" + secondpower;

                    //frontend qn terms

                    //Numerator
                    if (firstNumber == 1) {
                        qnNumerator = alphabet;
                        qnNumerator2 = alphabet2;
                    } else {
                        qnNumerator = firstNumber + alphabet;
                        qnNumerator2 = alphabet2;
                    }
                    if (firstpower == 1) {
                        qnNumeratorPower = "";
                        if (thirdpower == 1) {
                            qnNumeratorPower2 = "";
                        } else {
                            qnNumeratorPower2 = thirdpower;
                        }
                    } else {
                        qnNumeratorPower = firstpower;
                        if (thirdpower == 1) {
                            qnNumeratorPower2 = "";
                        } else {
                            qnNumeratorPower2 = thirdpower;
                        }
                    }

                    //Denominator
                    if (secondNumber == 1) {
                        qnDenominator = "-" + alphabet;
                    } else {
                        qnDenominator = "-" + secondNumber + alphabet;
                    }
                    if (secondpower == 1) {
                        qnDenominatorPower = "";
                    } else {
                        qnDenominatorPower = secondpower;
                    }

                    if (firstpowerans == "") {
                        ansTerm1 =
                            "-" +
                            firstNumberans +
                            firstpowerans +
                            alphabet2 +
                            "^" +
                            thirdpower;
                    } else {
                        ansTerm1 =
                            "-" +
                            firstNumberans +
                            firstpowerans +
                            "." +
                            alphabet2 +
                            "^" +
                            thirdpower;
                    }
                    ansTerm2 = secondNumberans + secondpowerans;
                }

                if (qnTerms1.includes("^1")) {
                    if (
                        qnTerms1.includes("^10") == true ||
                        qnTerms1.includes("^11") == true ||
                        qnTerms1.includes("^12") == true ||
                        qnTerms1.includes("^13") == true ||
                        qnTerms1.includes("^14") == true ||
                        qnTerms1.includes("^15") == true ||
                        qnTerms1.includes("^16") == true ||
                        qnTerms1.includes("^17") == true ||
                        qnTerms1.includes("^18") == true ||
                        qnTerms1.includes("^19") == true
                    ) {
                    } else {
                        qnTerms1 = qnTerms1.replace("^1", "");
                    }
                }

                if (qnTerms2.includes("^1")) {
                    if (
                        qnTerms2.includes("^10") == true ||
                        qnTerms2.includes("^11") == true ||
                        qnTerms2.includes("^12") == true ||
                        qnTerms2.includes("^13") == true ||
                        qnTerms2.includes("^14") == true ||
                        qnTerms2.includes("^15") == true ||
                        qnTerms2.includes("^16") == true ||
                        qnTerms2.includes("^17") == true ||
                        qnTerms2.includes("^18") == true ||
                        qnTerms2.includes("^19") == true
                    ) {
                    } else {
                        qnTerms2 = qnTerms2.replace("^1", "");
                    }
                }

                if (ansTerm1.includes("^1")) {
                    if (
                        ansTerm1.includes("^10") == true ||
                        ansTerm1.includes("^11") == true ||
                        ansTerm1.includes("^12") == true ||
                        ansTerm1.includes("^13") == true ||
                        ansTerm1.includes("^14") == true ||
                        ansTerm1.includes("^15") == true ||
                        ansTerm1.includes("^16") == true ||
                        ansTerm1.includes("^17") == true ||
                        ansTerm1.includes("^18") == true ||
                        ansTerm1.includes("^19") == true
                    ) {
                    } else {
                        ansTerm1 = ansTerm1.replace("^1", "");
                    }
                }

                if (ansTerm2.includes("^1")) {
                    if (
                        ansTerm2.includes("^10") == true ||
                        ansTerm2.includes("^11") == true ||
                        ansTerm2.includes("^12") == true ||
                        ansTerm2.includes("^13") == true ||
                        ansTerm2.includes("^14") == true ||
                        ansTerm2.includes("^15") == true ||
                        ansTerm2.includes("^16") == true ||
                        ansTerm2.includes("^17") == true ||
                        ansTerm2.includes("^18") == true ||
                        ansTerm2.includes("^19") == true
                    ) {
                    } else {
                        ansTerm2 = ansTerm2.replace("^1", "");
                    }
                }

                qnTerms1 = qnTerms1.replace("1" + alphabet, alphabet);
                qnTerms2 = qnTerms2.replace("1" + alphabet, alphabet);
                ansTerm1 = ansTerm1.replace("1" + alphabet, alphabet);
                ansTerm2 = ansTerm2.replace("1" + alphabet, alphabet);
                ansTerm1 = ansTerm1.replace("1" + alphabet, alphabet);
                ansTerm2 = ansTerm2.replace("1" + alphabet, alphabet);
                ansTerm1 = ansTerm1.replace("1" + alphabet, alphabet);
                ansTerm2 = ansTerm2.replace("1" + alphabet, alphabet);

                ansTerm1 = ansTerm1.replace("1" + alphabet2, alphabet2);
                ansTerm2 = ansTerm2.replace("1" + alphabet2, alphabet2);
                ansTerm1 = ansTerm1.replace("1" + alphabet2, alphabet2);
                ansTerm2 = ansTerm2.replace("1" + alphabet2, alphabet2);
                ansTerm1 = ansTerm1.replace("1" + alphabet2, alphabet2);
                ansTerm2 = ansTerm2.replace("1" + alphabet2, alphabet2);

                let ansNumerator;
                let ansNumeratorPower;
                let ansNumerator2 = "";
                let ansNumeratorPower2 = "";

                let ansDenominator;
                let ansDenominatorPower;

                let firstTerma;
                let secondTermb;

                if (ansTerm1.indexOf(".") != -1) {
                    //a.b
                    //a^2.b
                    //a.b^2
                    //a^2.b^2

                    //first term(a)
                    firstTerma = ansTerm1.slice(0, ansTerm1.indexOf("."));
                    console.log(firstTerma);
                    if (firstTerma.indexOf("^") == -1) {
                        ansNumerator = firstTerma;
                        ansNumeratorPower = "";
                    } else {
                        ansNumerator = firstTerma.slice(
                            0,
                            firstTerma.indexOf("^")
                        );
                        ansNumeratorPower = firstTerma.slice(
                            firstTerma.indexOf("^") + 1
                        );
                    }

                    //second term(b)
                    secondTermb = ansTerm1.slice(ansTerm1.indexOf(".") + 1);
                    console.log(secondTermb);
                    if (secondTermb.indexOf("^") == -1) {
                        ansNumerator2 = secondTermb;
                        ansNumeratorPower2 = "";
                    } else {
                        ansNumerator2 = secondTermb.slice(
                            0,
                            secondTermb.indexOf("^")
                        );
                        ansNumeratorPower2 = secondTermb.slice(
                            secondTermb.indexOf("^") + 1
                        );
                        console.log(ansNumerator2);
                        console.log(ansNumeratorPower2);
                    }
                } else {
                    if (ansTerm1.indexOf("^") == -1) {
                        ansNumerator = ansTerm1;
                        ansNumeratorPower = "";
                    } else {
                        ansNumerator = ansTerm1.slice(0, ansTerm1.indexOf("^"));
                        ansNumeratorPower = ansTerm1.slice(
                            ansTerm1.indexOf("^") + 1
                        );
                    }
                }

                if (ansTerm2.indexOf("^") == -1) {
                    ansDenominator = ansTerm2;
                    ansDenominatorPower = "";
                } else {
                    ansDenominator = ansTerm2.slice(0, ansTerm2.indexOf("^"));
                    ansDenominatorPower = ansTerm2.slice(
                        ansTerm2.indexOf("^") + 1
                    );
                }

                ansTerm1 = ansTerm1.replace("^", "");
                ansTerm1 = ansTerm1.replace("^", "");
                ansTerm1 = ansTerm1.replace(".", "");
                ansTerm2 = ansTerm2.replace("^", "");
                let algebraQn;
                if (ansTerm2 == 1) {
                    algebraQn = {
                        qn: qnTerms1 + "/" + qnTerms2,
                        ans: ansTerm1,
                        type: "hard",
                        QnNumerator: qnNumerator,
                        QnNumeratorPower: qnNumeratorPower,
                        QnDenominator: qnDenominator,
                        QnDenominatorPower: qnDenominatorPower,
                        QnNumerator2: qnNumerator2,
                        QnNumeratorPower2: qnNumeratorPower2,
                        fraction: "No",
                        AnsNumerator: ansNumerator,
                        AnsNumeratorPower: ansNumeratorPower,
                        AnsDenominator: ansDenominator,
                        AnsDenominatorPower: ansDenominatorPower,
                        AnsNumerator2: ansNumerator2,
                        AnsNumeratorPower2: ansNumeratorPower2,
                    };
                } else {
                    algebraQn = {
                        qn: qnTerms1 + "/" + qnTerms2,
                        ans: ansTerm1 + "\n" + ansTerm2,
                        type: "hard",
                        QnNumerator: qnNumerator,
                        QnNumeratorPower: qnNumeratorPower,
                        QnDenominator: qnDenominator,
                        QnDenominatorPower: qnDenominatorPower,
                        QnNumerator2: qnNumerator2,
                        QnNumeratorPower2: qnNumeratorPower2,
                        fraction: "Yes",
                        AnsNumerator: ansNumerator,
                        AnsNumeratorPower: ansNumeratorPower,
                        AnsDenominator: ansDenominator,
                        AnsDenominatorPower: ansDenominatorPower,
                        AnsNumerator2: ansNumerator2,
                        AnsNumeratorPower2: ansNumeratorPower2,
                    };
                }

                questionArray.push(algebraQn);
            }
        } else if (quizData.skill_code == "ALGEBRA_EXPANSION") {
            for (var i = 0; i < numOfEasy; i++) {
                var alphabet = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

                let firstNumber = Math.floor(Math.random() * 9 + 2);
                let secondNumber = Math.floor(Math.random() * 9 + 2);

                const qnTerms =
                    firstNumber + "(" + alphabet + "+" + secondNumber + ")";
                let ansTerm =
                    firstNumber + alphabet + "+" + firstNumber * secondNumber;
                let ans2Term =
                    firstNumber * secondNumber + "+" + firstNumber + alphabet;

                let algebraQn = {
                    qn: qnTerms,
                    ans: ansTerm,
                    ans2: ans2Term,
                    type: "easyv2",
                };
                questionArray.push(algebraQn);
            }
            for (var i = 0; i < numOfMedium; i++) {
                var alphabet = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

                let firstNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondnumberisNegative;

                if (firstNumber == 0) {
                    firstNumber = 2;
                }
                if (firstNumber == 1) {
                    firstNumber = 3;
                }
                if (firstNumber == -1) {
                    firstNumber = -2;
                }

                if (secondNumber == 0) {
                    secondNumber = 2;
                }
                if (secondNumber == 1) {
                    secondNumber = 3;
                }
                if (secondNumber == -1) {
                    secondNumber = -2;
                }
                if (secondNumber < 0) {
                    secondnumberisNegative = true;
                } else {
                    secondnumberisNegative = false;
                }

                let pattern = Math.floor(Math.random() * 2 + 1);
                let qnTerms;
                let ansTerm;
                if (pattern == 1) {
                    if (secondnumberisNegative == true) {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "+(" +
                            secondNumber +
                            "))"; //2(a+(-3)) or -2(a+(-3)) checked

                        if (firstNumber * secondNumber < 0) {
                            ansTerm =
                                firstNumber +
                                alphabet +
                                "-" +
                                Math.abs(firstNumber * secondNumber);
                            ans2Term =
                                "-" +
                                Math.abs(firstNumber * secondNumber) +
                                "+" +
                                firstNumber +
                                alphabet;
                        } else {
                            ansTerm =
                                firstNumber +
                                alphabet +
                                "+" +
                                firstNumber * secondNumber;
                            ans2Term =
                                firstNumber * secondNumber +
                                "+" +
                                firstNumber +
                                alphabet;
                        }
                    } else {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "+" +
                            secondNumber +
                            ")"; //2(a+3) or -2(a+3) checked
                        if (firstNumber * secondNumber < 0) {
                            ansTerm =
                                firstNumber +
                                alphabet +
                                "-" +
                                Math.abs(firstNumber * secondNumber);
                            ans2Term =
                                "-" +
                                Math.abs(firstNumber * secondNumber) +
                                "+" +
                                firstNumber +
                                alphabet;
                        } else {
                            ansTerm =
                                firstNumber +
                                alphabet +
                                "+" +
                                firstNumber * secondNumber;
                            ans2Term =
                                firstNumber * secondNumber +
                                "+" +
                                firstNumber +
                                alphabet;
                        }
                    }
                } else if (pattern == 2) {
                    if (secondnumberisNegative == true) {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "-(" +
                            secondNumber +
                            "))"; //2(a-(-3)) or -2(a-(-3)) checked
                        if (firstNumber * secondNumber < 0) {
                            ansTerm =
                                firstNumber +
                                alphabet +
                                "+" +
                                Math.abs(firstNumber * secondNumber);
                            ans2Term =
                                "-" +
                                firstNumber * secondNumber +
                                "+" +
                                firstNumber +
                                alphabet;
                        } else {
                            ansTerm =
                                firstNumber +
                                alphabet +
                                "-" +
                                firstNumber * secondNumber;
                            ans2Term =
                                "-" +
                                Math.abs(firstNumber * secondNumber) +
                                "+" +
                                firstNumber +
                                alphabet;
                        }
                    } else {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "-" +
                            secondNumber +
                            ")"; //2(a-3) or -2(a-3) checked
                        if (firstNumber * secondNumber < 0) {
                            ansTerm =
                                firstNumber +
                                alphabet +
                                "+" +
                                Math.abs(firstNumber * secondNumber);
                            ans2Term =
                                "-" +
                                firstNumber * secondNumber +
                                "+" +
                                firstNumber +
                                alphabet;
                        } else {
                            ansTerm =
                                firstNumber +
                                alphabet +
                                "-" +
                                firstNumber * secondNumber;
                            ans2Term =
                                "-" +
                                Math.abs(firstNumber * secondNumber) +
                                "+" +
                                firstNumber +
                                alphabet;
                        }
                    }
                }

                ans2Term = ans2Term.replace("--", "+");
                ans2Term = ans2Term.replace("++", "+");
                ans2Term = ans2Term.replace("+-", "-");
                ans2Term = ans2Term.replace("-+", "-");

                ans2Term = ans2Term.replace("--", "+");
                ans2Term = ans2Term.replace("++", "+");
                ans2Term = ans2Term.replace("+-", "-");
                ans2Term = ans2Term.replace("-+", "-");

                if (ans2Term.charAt(0) == "+") {
                    ans2Term = ans2Term.replace("+", "");
                }

                let algebraQn = {
                    qn: qnTerms,
                    ans: ansTerm,
                    ans2: ans2Term,
                    type: "mediumv2",
                };
                questionArray.push(algebraQn);
            }
            for (var i = 0; i < numOfHard; i++) {
                var alphabet = "";
                var alphabet2 = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                alphabet += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );

                var possible2 = possible.replace(alphabet, "");
                alphabet2 += possible2.charAt(
                    Math.floor(Math.random() * possible2.length)
                );

                let firstNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondnumberisNegative;

                if (firstNumber == 0) {
                    firstNumber = 2;
                }
                if (firstNumber == 1) {
                    firstNumber = 3;
                }
                if (firstNumber == -1) {
                    firstNumber = -2;
                }

                if (secondNumber == 0) {
                    secondNumber = 2;
                }
                if (secondNumber == 1) {
                    secondNumber = 3;
                }
                if (secondNumber == -1) {
                    secondNumber = -2;
                }
                if (secondNumber < 0) {
                    secondnumberisNegative = true;
                } else {
                    secondnumberisNegative = false;
                }

                let pattern = Math.floor(Math.random() * 4 + 1);
                let qnTerms;
                let ansTerm;
                if (pattern == 1) {
                    if (secondnumberisNegative == true) {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "+" +
                            alphabet2 +
                            "+(" +
                            secondNumber +
                            "))";
                        ansTerm1 = "+" + firstNumber + alphabet;
                        ansTerm2 = "+" + firstNumber + alphabet2;
                        ansTerm3 = "+" + firstNumber * secondNumber;
                    } else {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "+" +
                            alphabet2 +
                            "+" +
                            secondNumber +
                            ")";
                        ansTerm1 = "+" + firstNumber + alphabet;
                        ansTerm2 = "+" + firstNumber + alphabet2;
                        ansTerm3 = "+" + firstNumber * secondNumber;
                    }
                } else if (pattern == 2) {
                    if (secondnumberisNegative == true) {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "+" +
                            alphabet2 +
                            "-(" +
                            secondNumber +
                            "))";
                        ansTerm1 = "+" + firstNumber + alphabet;
                        ansTerm2 = "+" + firstNumber + alphabet2;
                        ansTerm3 = "-" + firstNumber * secondNumber;
                    } else {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "+" +
                            alphabet2 +
                            "-" +
                            secondNumber +
                            ")";
                        ansTerm1 = "+" + firstNumber + alphabet;
                        ansTerm2 = "+" + firstNumber + alphabet2;
                        ansTerm3 = "-" + firstNumber * secondNumber;
                    }
                } else if (pattern == 3) {
                    if (secondnumberisNegative == true) {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "-" +
                            alphabet2 +
                            "+(" +
                            secondNumber +
                            "))";
                        ansTerm1 = "+" + firstNumber + alphabet;
                        ansTerm2 = "-" + firstNumber + alphabet2;
                        ansTerm3 = "+" + firstNumber * secondNumber;
                    } else {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "-" +
                            alphabet2 +
                            "+" +
                            secondNumber +
                            ")";
                        ansTerm1 = "+" + firstNumber + alphabet;
                        ansTerm2 = "-" + firstNumber + alphabet2;
                        ansTerm3 = "+" + firstNumber * secondNumber;
                    }
                } else if (pattern == 4) {
                    if (secondnumberisNegative == true) {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "-" +
                            alphabet2 +
                            "-(" +
                            secondNumber +
                            "))";
                        ansTerm1 = "+" + firstNumber + alphabet;
                        ansTerm2 = "-" + firstNumber + alphabet2;
                        ansTerm3 = "-" + firstNumber * secondNumber;
                    } else {
                        qnTerms =
                            firstNumber +
                            "(" +
                            alphabet +
                            "-" +
                            alphabet2 +
                            "-" +
                            secondNumber +
                            ")";
                        ansTerm1 = "+" + firstNumber + alphabet;
                        ansTerm2 = "-" + firstNumber + alphabet2;
                        ansTerm3 = "-" + firstNumber * secondNumber;
                    }
                }

                //answer variation: 123,132,213,231,312,321
                ansTerm = ansTerm1 + ansTerm2 + ansTerm3;

                ansTerm = ansTerm.replace("--", "+");
                ansTerm = ansTerm.replace("++", "+");
                ansTerm = ansTerm.replace("+-", "-");
                ansTerm = ansTerm.replace("-+", "-");

                ansTerm = ansTerm.replace("--", "+");
                ansTerm = ansTerm.replace("++", "+");
                ansTerm = ansTerm.replace("+-", "-");
                ansTerm = ansTerm.replace("-+", "-");

                ansTerm = ansTerm.replace("--", "+");
                ansTerm = ansTerm.replace("++", "+");
                ansTerm = ansTerm.replace("+-", "-");
                ansTerm = ansTerm.replace("-+", "-");

                if (ansTerm.charAt(0) == "+") {
                    ansTerm = ansTerm.replace("+", "");
                }

                ans2Term = ansTerm1 + ansTerm3 + ansTerm2;

                ans2Term = ans2Term.replace("--", "+");
                ans2Term = ans2Term.replace("++", "+");
                ans2Term = ans2Term.replace("+-", "-");
                ans2Term = ans2Term.replace("-+", "-");

                ans2Term = ans2Term.replace("--", "+");
                ans2Term = ans2Term.replace("++", "+");
                ans2Term = ans2Term.replace("+-", "-");
                ans2Term = ans2Term.replace("-+", "-");

                ans2Term = ans2Term.replace("--", "+");
                ans2Term = ans2Term.replace("++", "+");
                ans2Term = ans2Term.replace("+-", "-");
                ans2Term = ans2Term.replace("-+", "-");

                if (ans2Term.charAt(0) == "+") {
                    ans2Term = ans2Term.replace("+", "");
                }

                ans3Term = ansTerm2 + ansTerm1 + ansTerm3;

                ans3Term = ans3Term.replace("--", "+");
                ans3Term = ans3Term.replace("++", "+");
                ans3Term = ans3Term.replace("+-", "-");
                ans3Term = ans3Term.replace("-+", "-");

                ans3Term = ans3Term.replace("--", "+");
                ans3Term = ans3Term.replace("++", "+");
                ans3Term = ans3Term.replace("+-", "-");
                ans3Term = ans3Term.replace("-+", "-");

                ans3Term = ans3Term.replace("--", "+");
                ans3Term = ans3Term.replace("++", "+");
                ans3Term = ans3Term.replace("+-", "-");
                ans3Term = ans3Term.replace("-+", "-");

                if (ans3Term.charAt(0) == "+") {
                    ans3Term = ans3Term.replace("+", "");
                }

                ans4Term = ansTerm2 + ansTerm3 + ansTerm1;

                ans4Term = ans4Term.replace("--", "+");
                ans4Term = ans4Term.replace("++", "+");
                ans4Term = ans4Term.replace("+-", "-");
                ans4Term = ans4Term.replace("-+", "-");

                ans4Term = ans4Term.replace("--", "+");
                ans4Term = ans4Term.replace("++", "+");
                ans4Term = ans4Term.replace("+-", "-");
                ans4Term = ans4Term.replace("-+", "-");

                ans4Term = ans4Term.replace("--", "+");
                ans4Term = ans4Term.replace("++", "+");
                ans4Term = ans4Term.replace("+-", "-");
                ans4Term = ans4Term.replace("-+", "-");

                if (ans4Term.charAt(0) == "+") {
                    ans4Term = ans4Term.replace("+", "");
                }

                ans5Term = ansTerm3 + ansTerm1 + ansTerm2;

                ans5Term = ans5Term.replace("--", "+");
                ans5Term = ans5Term.replace("++", "+");
                ans5Term = ans5Term.replace("+-", "-");
                ans5Term = ans5Term.replace("-+", "-");

                ans5Term = ans5Term.replace("--", "+");
                ans5Term = ans5Term.replace("++", "+");
                ans5Term = ans5Term.replace("+-", "-");
                ans5Term = ans5Term.replace("-+", "-");

                ans5Term = ans5Term.replace("--", "+");
                ans5Term = ans5Term.replace("++", "+");
                ans5Term = ans5Term.replace("+-", "-");
                ans5Term = ans5Term.replace("-+", "-");

                if (ans5Term.charAt(0) == "+") {
                    ans5Term = ans5Term.replace("+", "");
                }

                ans6Term = ansTerm3 + ansTerm2 + ansTerm1;
                ans6Term = ans6Term.replace("--", "+");
                ans6Term = ans6Term.replace("++", "+");
                ans6Term = ans6Term.replace("+-", "-");
                ans6Term = ans6Term.replace("-+", "-");

                ans6Term = ans6Term.replace("--", "+");
                ans6Term = ans6Term.replace("++", "+");
                ans6Term = ans6Term.replace("+-", "-");
                ans6Term = ans6Term.replace("-+", "-");

                ans6Term = ans6Term.replace("--", "+");
                ans6Term = ans6Term.replace("++", "+");
                ans6Term = ans6Term.replace("+-", "-");
                ans6Term = ans6Term.replace("-+", "-");

                if (ans6Term.charAt(0) == "+") {
                    ans6Term = ans6Term.replace("+", "");
                }

                let algebraQn = {
                    qn: qnTerms,
                    ans: ansTerm,
                    ans2: ans2Term,
                    ans3: ans3Term,
                    ans4: ans4Term,
                    ans5: ans5Term,
                    ans6: ans6Term,
                    type: "hardv6",
                };
                questionArray.push(algebraQn);
            }
        } else if (quizData.skill_code == "ALGEBRA_LINEAR_EQUATION") {
            for (var i = 0; i < numOfEasy; i++) {
                let firstNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                if (firstNumber == 0) {
                    firstNumber = 1;
                }

                let qnTerm;
                if (firstNumber >= 0) {
                    //positive
                    qnTerm =
                        "𝑥+" +
                        firstNumber.toString() +
                        "=" +
                        secondNumber.toString();
                } else {
                    qnTerm =
                        "𝑥" +
                        firstNumber.toString() +
                        "=" +
                        secondNumber.toString();
                }

                let algebraQn = {
                    qn: qnTerm,
                    ans: (secondNumber - firstNumber).toString(),
                    type: "easy",
                    fraction: "No",
                };
                questionArray.push(algebraQn);
            }
            for (var i = 0; i < numOfMedium; i++) {
                let firstNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                if (firstNumber == 0) {
                    firstNumber = 1;
                }
                let qnTerm =
                    firstNumber.toString() + "𝑥=" + secondNumber.toString();
                qnTerm.replace("1𝑥", "𝑥");
                qnTerm.replace("-1𝑥", "-𝑥");

                //ans
                let ansTerm;
                let HCF = algebra2.gcd(secondNumber, firstNumber);
                let isFraction = "No";
                let numeratorAns = "NA";
                let denominatorAns = "NA";
                //check if its whole number
                if (
                    Math.floor(secondNumber / firstNumber) ==
                    secondNumber / firstNumber
                ) {
                    ansTerm = (secondNumber / firstNumber).toString();
                } else {
                    //fraction---simplify it

                    firstNumberans = firstNumber / HCF;
                    secondNumberans = secondNumber / HCF;

                    isFraction = "Yes";
                    ansTerm = secondNumberans + "\n" + firstNumberans;
                    numeratorAns = secondNumberans;
                    denominatorAns = firstNumberans;

                    if (firstNumberans < 0) {
                        //negative
                        ansTerm =
                            "-" + secondNumberans + "\n" + firstNumberans * -1;
                        numeratorAns = "-" + secondNumberans;
                        denominatorAns = firstNumberans * -1;
                    }
                }

                let algebraQn = {
                    qn: qnTerm,
                    ans: ansTerm,
                    type: "medium",
                    fraction: isFraction,
                    numerator: numeratorAns,
                    denominator: denominatorAns,
                };
                questionArray.push(algebraQn);
            }
            for (var i = 0; i < numOfHard; i++) {
                let firstNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let secondNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                let thirdNumber = Math.floor(Math.random() * (9 * 2 + 1) + -9);
                if (firstNumber == 0) {
                    firstNumber = 1;
                }
                if (secondNumber == 0) {
                    secondNumber = 1;
                }

                if (secondNumber >= 0) {
                    //positive
                    qnTerm =
                        firstNumber + "𝑥+" + secondNumber + "=" + thirdNumber;
                } else {
                    qnTerm =
                        firstNumber + "𝑥" + secondNumber + "=" + thirdNumber;
                }

                qnTerm.replace("1𝑥", "𝑥");
                qnTerm.replace("-1𝑥", "-𝑥");

                //ans
                secondNumber = thirdNumber - secondNumber;

                //ans
                let ansTerm;
                let HCF = algebra2.gcd(secondNumber, firstNumber);
                let isFraction = "No";
                let numeratorAns = "NA";
                let denominatorAns = "NA";
                //check if its whole number
                if (
                    Math.floor(secondNumber / firstNumber) ==
                    secondNumber / firstNumber
                ) {
                    ansTerm = (secondNumber / firstNumber).toString();
                } else {
                    //fraction---simplify it

                    firstNumberans = firstNumber / HCF;
                    secondNumberans = secondNumber / HCF;

                    isFraction = "Yes";
                    ansTerm = secondNumberans + "\n" + firstNumberans;
                    numeratorAns = secondNumberans;
                    denominatorAns = firstNumberans;

                    if (firstNumberans < 0) {
                        //negative
                        ansTerm =
                            "-" + secondNumberans + "\n" + firstNumberans * -1;
                        numeratorAns = "-" + secondNumberans;
                        denominatorAns = firstNumberans * -1;
                    }
                }

                let algebraQn = {
                    qn: qnTerm,
                    ans: ansTerm,
                    type: "hard",
                    fraction: isFraction,
                    numerator: numeratorAns,
                    denominator: denominatorAns,
                };
                questionArray.push(algebraQn);
            }
        }
    },
    arrangeQuestion: () => {
        //this is where it will be displayed on the frontend.

        let content = "";
        if (quizData.skill_code == "ALGEBRA_ADDITION") {
            for (let i = 0; i < questionArray.length; i++) {
                content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5"><div class="small col-md-4">Question ${
                    i + 1
                }</div>`;

                content +=
                    `<div class="row col-md-6">Simplify ` +
                    questionArray[i].qn +
                    `</div><br><br> <div align-items-center>Answer: <input class="text-center" size = "6" id='input${i}'></div>`;

                content += `<div class='col-md-2 reviewClass'><span id='review${i}'></span></div></div>`;
            }
        }
        if (quizData.skill_code == "ALGEBRA_MULTIPLICATION") {
            for (let i = 0; i < questionArray.length; i++) {
                console.log(questionArray[i].type);
                content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5"><div class="small col-md-4">Question ${
                    i + 1
                }</div>`;
                if (
                    questionArray[i].type == "hardv2" ||
                    questionArray[i].type == "hard"
                ) {
                    content +=
                        `<div>Simplify ` +
                        questionArray[i].qnFirstTerm +
                        `<sup>` +
                        questionArray[i].qnFirstPower +
                        `</sup>` +
                        questionArray[i].qnSecondTerm +
                        `<sup>` +
                        questionArray[i].qnSecondPower +
                        `</sup>` +
                        questionArray[i].qnThirdTerm +
                        `<sup>` +
                        questionArray[i].qnThirdPower +
                        `</sup></div> <div align-items-center>
                 Answer: <span class="math-field" id='input${i}></span>
                 </div>`;
                } else {
                    //easy and medium (two terms)
                    content +=
                        `<div>Simplify ` +
                        questionArray[i].qnFirstTerm +
                        `<sup>` +
                        questionArray[i].qnFirstPower +
                        `</sup>` +
                        questionArray[i].qnSecondTerm +
                        `<sup>` +
                        questionArray[i].qnSecondPower +
                        `</sup></div> <div align-items-center>
             Answer: <span class="math-field" id='input${i}></span>
             </div>`;
                }

                content += `<div class='col-md-2 reviewClass'></div></div>`;
                content += `<div class='col-md-12 reviewClass justify-content-center align-items-center text-center'><span id='review${i}'></span></div></div><br><br>`;
            }
        }

        if (quizData.skill_code == "ALGEBRA_DIVISION") {
            //the test for math input symbol
            for (let i = 0; i < questionArray.length; i++) {
                content += `<div class="row col-10 justify-content-center align-items-center text-center m-auto mb-5"><div class="small col-md-4">Question ${
                    i + 1
                }</div>`;
                if (
                    questionArray[i].type == "hardv2" ||
                    questionArray[i].type == "hard"
                ) {
                    content +=
                        `<div class="small col-md-5">
                 <table><tr>
      
                 
                 <td>
                 <div style="float:left;">Simplify <br></div></td>
                 <td> <div style="float:left">
                             <div style="border-bottom:1px solid;font-size:small;text-align:center;">` +
                        questionArray[i].QnNumerator +
                        `<sup>` +
                        questionArray[i].QnNumeratorPower +
                        `</sup>` +
                        questionArray[i].QnNumerator2 +
                        `<sup>` +
                        questionArray[i].QnNumeratorPower2 +
                        `</sup></div>
                             <div style="font-size:small;text-align:center;">` +
                        questionArray[i].QnDenominator +
                        `<sup>` +
                        questionArray[i].QnDenominatorPower +
                        `</sup></div>
                           </div></td> 
                 </tr>
                 
                 </table>
               <br></div><br><br> <div>
                 
                 Answer: <span class="math-field" id='input${i}></span>
     
                 
                 
                 
                 </div>`;
                } else {
                    content +=
                        `<div class="small col-md-5">
             <table><tr>
  
             
             <td>
             <div style="float:left;">Simplify <br></div></td>
             <td> <div style="float:left">
                         <div style="border-bottom:1px solid;font-size:small;text-align:center;">` +
                        questionArray[i].QnNumerator +
                        `<sup>` +
                        questionArray[i].QnNumeratorPower +
                        `</sup></div>
                         <div style="font-size:small;text-align:center;">` +
                        questionArray[i].QnDenominator +
                        `<sup>` +
                        questionArray[i].QnDenominatorPower +
                        `</sup></div>
                       </div></td> 
             </tr>
             
             </table>
           <br></div><br><br> <div>
             
             Answer: <span class="math-field" id='input${i}></span>
 
             
             
             
             </div>`;
                }

                content += `<div class='col-md-2 reviewClass'></div></div>`;
                content += `<div class='col-md-12 reviewClass justify-content-center align-items-center text-center'><span id='review${i}'></span></div></div><br><br>`;
            }
        }

        if (quizData.skill_code == "ALGEBRA_EXPANSION") {
            for (let i = 0; i < questionArray.length; i++) {
                content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5"><div class="small col-md-4">Question ${
                    i + 1
                }</div>`;

                content +=
                    `<div class="row col-md-6">Expand ` +
                    questionArray[i].qn +
                    ` <br></div><br><br> <div align-items-center>Answer: <input class="text-center" size = "6" id='input${i}'></div>`;

                content += `<div class='col-md-2 reviewClass'><span id='review${i}'></span></div></div>`;
            }
        }
        if (quizData.skill_code == "ALGEBRA_LINEAR_EQUATION") {
            for (let i = 0; i < questionArray.length; i++) {
                content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5"><div class="small col-md-4">Question ${
                    i + 1
                }</div>`;

                content +=
                    `<div>Solve for 𝑥 in this equation. ` +
                    questionArray[i].qn +
                    `</div> <div align-items-center>
             Answer: <span class="math-field" id='input${i}></span>
             </div>`;

                content += `<div class='col-md-2 reviewClass'></div></div>`;
                content += `<div class='col-md-12 reviewClass justify-content-center align-items-center text-center'><span id='review${i}'></span></div></div><br><br>`;
            }
        }

        return content;
    },
    markQuiz: () => {
        let score;
        let easy = 0;
        let medium = 0;
        let difficult = 0;
        let questions = [];

        const numOfQ = quizData.num_of_qn,
            percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);
        const numOfDifficult = numOfQ * (percentDifficulty[2] / 100);

        for (let i = 0; i < numOfQ; i++) {
            let review = '<i class="fas fa-check"></i>';
            let difficulty = "difficult";
            let isCorrect = false;
            let studentAns = {};

            //console.log(document.getElementsByClassName("math-field mq-editable-field mq-math-mode")[i].innerText)

            let input;
            

            if (quizData.skill_code == "ALGEBRA_MULTIPLICATION") {
                input =
                    "ans" in questionArray[i]
                        ? document.getElementsByClassName(
                              "math-field mq-editable-field mq-math-mode"
                          )[i].innerText
                        : undefined;
                input = input.replace("−", "-");
                input = input.replace("−", "-");
                input = input.replace("−", "-");
                input = input.replace("−", "-");
            } else if (quizData.skill_code == "ALGEBRA_DIVISION") {
                input =
                    "ans" in questionArray[i]
                        ? document.getElementsByClassName(
                              "math-field mq-editable-field mq-math-mode"
                          )[i].innerText
                        : undefined;
                input = input.replace("−", "-");
                input = input.replace("−", "-");
                input = input.replace("−", "-");
                input = input.replace("−", "-");
                input = input.replace("-\n", "-");
                if (/[a-z0-9]/.test(input.charAt(input.length - 1)) == false) {
                    input = input.slice(0, -1);
                    input = input.slice(0, -1);
                }
                //ans2 check
                
                if((input == questionArray[i].ans)==false){//not first answer
                    if(/[-0-9]/.test(input.charAt(input.indexOf(questionArray[i].alphabetData)-1)) == false && input.indexOf(questionArray[i].alphabetData)!=0)
                    input=input.replace(input.charAt(input.indexOf(questionArray[i].alphabetData)-2)+input.charAt(input.indexOf(questionArray[i].alphabetData)-1),"\n")
                }
               
            } else if (quizData.skill_code == "ALGEBRA_LINEAR_EQUATION") {
                input =
                    "ans" in questionArray[i]
                        ? document.getElementsByClassName(
                              "math-field mq-editable-field mq-math-mode"
                          )[i].innerText
                        : undefined;
                input = input.replace("−", "-");
                input = input.replace("−", "-");
                input = input.replace("−", "-");
                input = input.replace("−", "-");
                input = input.replace("-\n", "-");
                if (/[0-9]/.test(input.charAt(input.length - 1)) == false) {
                    input = input.slice(0, -1);
                    input = input.slice(0, -1);
                }
            } else {
                input =
                    "ans" in questionArray[i]
                        ? $(`#input${i}`).val()
                        : undefined;
            }

            //let input = ('ans' in questionArray[i]) ? $(`#input${i}`).val() : undefined;

            //let input = ('ans' in questionArray[i]) ? document.getElementsByClassName("math-field mq-editable-field mq-math-mode")[i].innerText : undefined;
            //debugging notes
            
            console.log(
                document.getElementsByClassName(
                    "math-field mq-editable-field mq-math-mode"
                )
            );
            /*
            console.log(input == questionArray[i].ans);
            console.log(input);

            console.log(questionArray[i].ans2);
            console.log(input == questionArray[i].ans2)
            console.log(input.indexOf(questionArray[i].alphabetData)==0)
            console.log("important")
            console.log(input.charAt(2))
            console.log(input.charAt(3))//delete this
            console.log(input.charAt(4))//delte this
            console.log(input.charAt(3))//delete this
            console.log(input.charAt(5))//alphabet
            
            console.log("input string")
            for(let iv1=0;iv1<input.length;iv1++){
                console.log(input[iv1])

            }
            console.log("questionArray[i].ans2")
            for(let iv2=0;iv2<questionArray[i].ans2.length;iv2++){
                console.log(questionArray[i].ans2[iv2])

            }*/

            

            //console.log((/[a-z0-9]/).test(input.charAt(input.length-1)))

            if (input != undefined) studentAns["ans"] = input;

            $(".reviewClass").css("display", "block");

            if (
                input == questionArray[i].ans ||
                input == questionArray[i].ans2 ||
                input == questionArray[i].ans3 ||
                input == questionArray[i].ans4 ||
                input == questionArray[i].ans5 ||
                input == questionArray[i].ans6  
            ) {
                if (i < numOfEasy) {
                    difficulty = "easy";
                    easy++;
                } else if (i < numOfEasy + numOfMedium) {
                    difficulty = "medium";
                    medium++;
                } else {
                    difficult++;
                }
                isCorrect = true;
            } else {
                review = '<i class="fas fa-times"></i>  Ans: ';
                if (
                    questionArray[i].type == "hardv2" ||
                    questionArray[i].type == "mediumv2" ||
                    questionArray[i].type == "easyv2"
                ) {
                    if (quizData.skill_code == "ALGEBRA_MULTIPLICATION") {
                        if ("ans" in questionArray[i])
                            review +=
                                `${questionArray[i].ansFirstTerm}` +
                                "<sup>" +
                                `${questionArray[i].ansFirstPower}` +
                                "</sup>" +
                                `${questionArray[i].ansSecondTerm}` +
                                "<sup>" +
                                `${questionArray[i].ansSecondPower}` +
                                "</sup>" +
                                " or " +
                                `${questionArray[i].ans2FirstTerm}` +
                                "<sup>" +
                                `${questionArray[i].ans2FirstPower}` +
                                "</sup>" +
                                `${questionArray[i].ans2SecondTerm}` +
                                "<sup>" +
                                `${questionArray[i].ans2SecondPower}` +
                                "</sup>";
                    } else {
                        if ("ans" in questionArray[i])
                            review +=
                                `${questionArray[i].ans}` +
                                " or " +
                                `${questionArray[i].ans2}`;
                    }
                } else if (questionArray[i].type == "hardv6") {
                    if ("ans" in questionArray[i])
                        review +=
                            `${questionArray[i].ans}` +
                            " or " +
                            `${questionArray[i].ans2}` +
                            " or " +
                            `${questionArray[i].ans3}` +
                            " or " +
                            `${questionArray[i].ans4}` +
                            " or " +
                            `${questionArray[i].ans5}` +
                            " or " +
                            `${questionArray[i].ans6}`;
                } else {
                    if (quizData.skill_code == "ALGEBRA_MULTIPLICATION") {
                        if ("ans" in questionArray[i])
                            review +=
                                `${questionArray[i].ansFirstTerm}` +
                                "<sup>" +
                                `${questionArray[i].ansFirstPower}` +
                                "</sup>";
                    } else if (quizData.skill_code == "ALGEBRA_DIVISION") {
                        if (questionArray[i].type == "hard") {
                            if (questionArray[i].fraction == "Yes") {
                                if ("ans" in questionArray[i])
                                    review +=
                                        ' <div style="float:right;padding-right:520px;"><div style="border-bottom:1px solid;font-size:small;">' +
                                        `${questionArray[i].AnsNumerator}` +
                                        "<sup>" +
                                        `${questionArray[i].AnsNumeratorPower}` +
                                        "</sup>" +
                                        `${questionArray[i].AnsNumerator2}` +
                                        "<sup>" +
                                        `${questionArray[i].AnsNumeratorPower2}` +
                                        "</sup>" +
                                        '</div> <div style="font-size:small;text-align:center;">' +
                                        `${questionArray[i].AnsDenominator}` +
                                        "<sup>" +
                                        `${questionArray[i].AnsDenominatorPower}` +
                                        "</sup></div> </div>";
                            } else {
                                if ("ans" in questionArray[i])
                                    review +=
                                        `${questionArray[i].AnsNumerator}` +
                                        "<sup>" +
                                        `${questionArray[i].AnsNumeratorPower}` +
                                        "</sup>" +
                                        `${questionArray[i].AnsNumerator2}` +
                                        "<sup>" +
                                        `${questionArray[i].AnsNumeratorPower2}` +
                                        "</sup>";
                            }
                        } else {
                            if (questionArray[i].fraction == "Yes") {
                                if ("ans" in questionArray[i])
                                    review +=
                                        ' <div style="float:right;padding-right:520px;"><div style="border-bottom:1px solid;font-size:small;">' +
                                        `${questionArray[i].AnsNumerator}` +
                                        "<sup>" +
                                        `${questionArray[i].AnsNumeratorPower}` +
                                        '</sup></div> <div style="font-size:small;text-align:center;">' +
                                        `${questionArray[i].AnsDenominator}` +
                                        "<sup>" +
                                        `${questionArray[i].AnsDenominatorPower}` +
                                        "</sup></div> </div>";
                            } else {
                                if ("ans" in questionArray[i])
                                    review +=
                                        `${questionArray[i].AnsNumerator}` +
                                        "<sup>" +
                                        `${questionArray[i].AnsNumeratorPower}` +
                                        "</sup>";
                            }
                        }
                    } else if (
                        quizData.skill_code == "ALGEBRA_LINEAR_EQUATION"
                    ) {
                        if (questionArray[i].fraction == "No") {
                            if ("ans" in questionArray[i])
                                review += `${questionArray[i].ans}`;
                        } else {
                            if ("ans" in questionArray[i])
                                review +=
                                    ' <div style="float:right;padding-right:520px;"><div style="border-bottom:1px solid;font-size:small;">' +
                                    `${questionArray[i].numerator}` +
                                    '</div> <div style="font-size:small;text-align:center;">' +
                                    `${questionArray[i].denominator}` +
                                    "</div> </div>";
                        }
                    } else {
                        if ("ans" in questionArray[i])
                            review += `${questionArray[i].ans}`;
                    }
                }
            }

            document.getElementById(`review${i}`).innerHTML = review;
            //document.getElementsByClassName("math-field mq-editable-field mq-math-mode")[i].innerText-review;
            let correctAnswer = "";
            if (
                questionArray[i].type == "hardv2" ||
                questionArray[i].type == "mediumv2" ||
                questionArray[i].type == "easyv2"
            ) {
                correctAnswer =
                    questionArray[i].ans + " or " + questionArray[i].ans2;
            } else if (questionArray[i].type == "hardv6") {
                correctAnswer =
                    questionArray[i].ans +
                    " or " +
                    questionArray[i].ans2 +
                    " or " +
                    questionArray[i].ans3 +
                    " or " +
                    questionArray[i].ans4 +
                    " or " +
                    questionArray[i].ans5 +
                    " or " +
                    questionArray[i].ans6;
            } else {
                correctAnswer = questionArray[i].ans;
            }

            questions.push({
                skill_id: quizData.skillId,
                question_number: i + 1,
                question: algebra2.stringQuestion(questionArray[i]),
                answer: algebra2.stringAnswer(studentAns),
                correct_answer: correctAnswer,
                isCorrect: isCorrect,
                difficulty: difficulty,
            });
        }

        score = {
            easy: (easy / numOfEasy) * 100,
            medium: (medium / numOfMedium) * 100,
            difficult: (difficult / numOfDifficult) * 100,
        };
        score["total"] =
            (((score.easy / 100) * numOfEasy +
                (score.medium / 100) * numOfMedium +
                (score.difficult / 100) * numOfDifficult) /
                numOfQ) *
            100;

        let points = easy * 5 + medium * 10 + difficult * 15;
        return [questions, score, points];
    },
};

const funcs = {
    Fractions: fraction,
    Approximation: roundingOff,
    Integers: integers,
    "Ordering Numbers": ordering,
    "Real Numbers": rationalNumbers,
    Decimals: decimal,
    Algebra: algebra2,
};

// misc functions
function confetti() {
    console.log("calling confetti");
    var myCanvas = document.createElement("canvas");
    document.appendChild(myCanvas);

    var myConfetti = confetti.create(myCanvas, {
        resize: true,
        useWorker: true,
    });
    myConfetti({
        particleCount: 80,
        spread: 200,
    });
}
