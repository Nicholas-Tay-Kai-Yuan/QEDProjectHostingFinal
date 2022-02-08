
const rationalNumbers = {

    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);        

        //For now, medium and difficult is both counted as medium
        for (let i = 0; i < numOfQ; i++) {

            let key = "medium_values";
            let question = "";
            let array = [];
            let wholeNumber;
            let squareroot;
            let cuberoot;
            let numerator;
            let denominator;
            let questionDisplayArray = [];
            let questionValueArray = []
            let answerDisplayArray = [];
            let answerValueArray = [];
            let finalQuestionArray = [];
            let finalAnswerArray = [];
            let fullQuestionArray = [];

            if (i <  numOfEasy) {
                key = "easy_values";
            }
            
            if (key == "easy_values") {
                wholeNumber = generateRandomNumber(quizData[key].min, quizData[key].max);
                squareroot = generateRandomNumber(quizData[key].min <= 0 ? 1 : quizData[key].min, quizData[key].max);
                cuberoot = generateRandomNumber(quizData[key].min <= 0 ? 1 : quizData[key].min, quizData[key].max);
                numerator = generateRandomNumber(quizData[key].min <= 0 ? 1 : quizData[key].min, quizData[key].max);
                denominator = generateRandomNumber(quizData[key].min <= 1 ? 2 : quizData[key].min, quizData[key].max);
            }
            else {
                wholeNumber = generateRandomNumber(quizData[key].min, quizData[key].max);
                squareroot = generateRandomNumber(quizData[key].min <= 0 ? 1 : quizData[key].min, quizData[key].max);
                cuberoot = generateRandomNumber(quizData[key].min <= 0 ? 1 : quizData[key].min, quizData[key].max);

                do {
                    numerator = generateRandomNumber(quizData[key].min, quizData[key].max);
                } while (numerator == 0)

                denominator = generateRandomNumber(quizData[key].min <= 1 ? 2 : quizData[key].min, quizData[key].max);
            }

            questionDisplayArray = ["π", wholeNumber.toString().replace("-", "−"), `&radic;<span style="text-decoration: overline">${squareroot}</span>`, `&#8731;<span style="text-decoration: overline">${cuberoot}</span>`, `<sup>${numerator.toString().replace("-", "−")}</sup>&frasl;<sub>${denominator}</sub>` ]
            
            questionValueArray = [Math.PI, wholeNumber, Math.sqrt(squareroot), Math.cbrt(cuberoot), numerator/denominator];

            var removedOption = generateRandomNumber(0, questionDisplayArray.length - 1);

            questionDisplayArray.splice(removedOption, 1);

            questionValueArray.splice(removedOption, 1);
            for (var l = 0; l < questionDisplayArray.length; l++) {
                if (key == "easy_values") {
                    question = "Which of the following are integers?<br/>{" + questionDisplayArray.toString().replaceAll(",", ", ") + "}";
                }
                else {
                    question = "Which of the following are rational numbers?<br/>{" + questionDisplayArray.toString().replaceAll(",", ", ") + "}";
                }
                fullQuestionArray.push(question);
            }


            // Generate answers
            for (var x = 0; x < questionValueArray.length; x++) {
                if (key == "easy_values") {
                    if (questionValueArray[x] % 1 == 0) {
                        answerValueArray.push(questionValueArray[x]);
                        answerDisplayArray.push(questionDisplayArray[x]);
                    }
                }
                else {
                    var optionAsStr = questionValueArray[x].toString();

                    if (questionDisplayArray[x].toString().includes("&frasl;")) {
                        answerValueArray.push(questionValueArray[x]);
                        answerDisplayArray.push(questionDisplayArray[x]);  
                    }
                    else if (optionAsStr.includes(".")) {
                        if (optionAsStr.split(".")[1].length >= 10) {

                        }
                        else {
                            answerValueArray.push(questionValueArray[x]);
                            answerDisplayArray.push(questionDisplayArray[x]);                        
                        }
                    }
                    else {
                        answerValueArray.push(questionValueArray[x]);
                        answerDisplayArray.push(questionDisplayArray[x]);
                    }
                }
            }

            if (answerValueArray.length == 0 && answerDisplayArray == 0) {
                answerValueArray.push("None");
                answerDisplayArray.push("None");
            }

            finalQuestionArray.push(question);
            finalQuestionArray.push(questionDisplayArray);
            finalQuestionArray.push(questionValueArray);
            finalAnswerArray.push(answerDisplayArray);
            finalAnswerArray.push(answerValueArray);

            array.push(finalQuestionArray);
            array.push(finalAnswerArray);

            questionArray.push(array);

        }
    },

    arrangeQuestion: () => {
        let content = `<div class="col-12 scrollbar border rounded" id="scrollQuestions" style="border-radius: 7px;">`;
        let form = ``
        for (let i = 0; i < questionArray.length; i++) {
           
            form = `<div class="form-check-inline d-flex align-items-center">
                        <input class="form-check-input" type="checkbox" id="0">
                        <label class="form-check-label" for="option1">
                            <p style="font-size: 18px" class="ms-1 my-auto">${questionArray[i][0][1][0]}</p>
                        </label>
                    </div>
                    <div class="form-check-inline d-flex align-items-center">
                        <input class="form-check-input" type="checkbox" id="1">
                        <label class="form-check-label" for="option2">
                            <p style="font-size: 18px" class="ms-1 my-auto">${questionArray[i][0][1][1]}</p>
                        </label>
                    </div>
                    <div class="form-check-inline d-flex align-items-center">
                        <input class="form-check-input" type="checkbox" id="2">
                        <label class="form-check-label" for="option3">
                            <p style="font-size: 18px" class="ms-1 my-auto">${questionArray[i][0][1][2]}</p>
                        </label>
                    </div>
                    <div class="form-check-inline d-flex align-items-center">
                        <input class="form-check-input" type="checkbox" id="3">
                        <label class="form-check-label" for="option4">
                            <p style="font-size: 18px" class="ms-1 my-auto">${questionArray[i][0][1][3]}</p>
                        </label>
                    </div>
                    <div class="form-check-inline d-flex align-items-center">
                        <input class="form-check-input" type="checkbox" id="4">
                        <label class="form-check-label" for="option5">
                            <p style="font-size: 18px" class="ms-1 my-auto">None</p>
                        </label>
                    </div>`;
            
            content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5 question">
                            <div class="col rationalQ${i + 1}">
                                <div class="row justify-content-center align-items-center">
                                    <div class="small col-md-8 mt-3">
                                        <p style="font-size: 18px">Q${i + 1}. ${questionArray[i][0][0]}</p>
                                    </div>
                                </div>
                                <div class="row justify-content-center align-items-center">
                                    <div class="small col-md-8 mt-3 d-flex align-items-center justify-content-center">
                                        ${form}
                                    </div>
                                </div>
                            </div>
                            <div class='col-md-2 reviewClass'><span id='review${i}'></span></div>
                        </div>`;

        }

        content += `</div>`;
        return content;
    },

    markQuiz: () => {
        let score
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
            let review = '<i class="fas fa-check" style="color: #42FE00"></i>';
            let difficulty = 'medium';
            let isCorrect = false;
            let inputArray = [];
            
            for (var x = 0; x < 5; x++) {
                input = $(`.rationalQ${i+1}`).children().eq(1)[0].children[0].children[x].children[0].checked;
                if (input == true) {
                    var input = $(`.rationalQ${i+1}`).children().eq(1)[0].children[0].children[x].children[1].children[0].innerHTML;
                    input = (input.replaceAll("\n", "")).trim();
                    console.log(input);
                    //squareroot
                    if (input[0] == "√") {
                        input = input.replaceAll("√", "&radic;")
                    }
                    //cuberoot
                    else if (input[0] == "∛") {
                        input = input.replaceAll("∛", "&#8731;")
                    }
                    //fraction
                    else if (input[0] == "<") {
                        input = input.replaceAll(">⁄<", ">&frasl;<")
                    }
                    // //whole number
                    else if (input.length == 1 || input.length == 2) {

                    }
                    else {
                        input = "None";
                    }

                    inputArray.push(input);
                }
            }
                        
            $(".reviewClass").css("display", "block");

            console.log(questionArray[i][1][0])
            console.log(inputArray)
            if (questionArray[i][1][0].length == inputArray.length) {
                for (var l = 0; l < questionArray[i][1][0].length; l++) {
                    if (questionArray[i][1][0][l] == inputArray[l]) {
                        //Mark as correct when all checkboxes are correct
                        if (l+1 == questionArray[i][1][0].length) {
                            if (i < numOfEasy) {
                                difficulty = 'easy';
                                easy++;
                            }
                            else {
                                medium++;
                            }
                            isCorrect = true;
                        }
                        
                    }
                    else {
                        isCorrect = false;
                        break;
                    }
                }
            }
            else {

            }

            var correctAnswer;
            
            if (questionArray[i][1][0].length == 0) {
                correctAnswer = "None";
            }
            else {
                console.log(questionArray[i][1][0])
                correctAnswer = questionArray[i][1][0].toString().includes("&radic") || questionArray[i][1][0].toString().includes("&#8731") ? questionArray[i][1][0] : questionArray[i][1][0].toString().replace("-", "−");
            }

            if (!isCorrect) {
                review = '<i class="fas fa-times" style="color: #FF0505"></i>  Ans: ';
                review += correctAnswer;
            }
          
            document.getElementById(`review${i}`).innerHTML = review;        

            questions.push({
                "skill_id": quizData.skillId,
                "question_number": i + 1,
                "question": questionArray[i][0][0].toString(),
                "answer": inputArray.toString(),
                "correct_answer": correctAnswer.toString(),
                "isCorrect": isCorrect,
                "difficulty": difficulty
            });
        }

        score = {
            "easy": (easy / numOfEasy) * 100,
            "medium": (medium / numOfMedium) * 100,
            "difficult": (difficult / numOfDifficult) * 100,
        }

        score["total"] = ((score.easy / 100) * numOfEasy + (score.medium / 100) * numOfMedium + (score.difficult / 100) * numOfDifficult) / numOfQ * 100;

        let points = easy * 5 + medium * 10 + difficult * 15;

        return [questions, score, points];
    }
}