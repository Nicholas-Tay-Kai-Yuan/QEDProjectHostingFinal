let questionArray = [];
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

export default rationalNumbers = {

    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);        

        questionArray = []
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
                wholeNumber = generateRandomNumber(-9, 9);
                squareroot = generateRandomNumber(1, 9);
                cuberoot = generateRandomNumber(1, 30);
                numerator = generateRandomNumber(1, 9);
                denominator = generateRandomNumber(2, 9);
            }
            else {
                wholeNumber = generateRandomNumber(-9, 9);
                squareroot = generateRandomNumber(1, 20);
                cuberoot = generateRandomNumber(1, 30);

                do {
                    numerator = generateRandomNumber(-9, 9);
                } while (numerator == 0)

                denominator = generateRandomNumber(2, 9);
            }

            questionDisplayArray = ["π", wholeNumber, `&radic;<span style="text-decoration: overline">${squareroot}</span>`, `&#8731;<span style="text-decoration: overline">${cuberoot}</span>`, `<sup>${numerator}</sup>&frasl;<sub>${denominator}</sub>` ]
            
            questionValueArray = [Math.PI, wholeNumber, Math.sqrt(squareroot), Math.cbrt(cuberoot), numerator/denominator];

            var removedOption = generateRandomNumber(0, questionDisplayArray.length - 1);

            questionDisplayArray.splice(removedOption, 1);

            questionValueArray.splice(removedOption, 1);
            for (var l = 0; l < questionDisplayArray.length; l++) {
                if (key == "easy_values") {
                    question = "Which of the following are integers?<br/>{" + questionDisplayArray + "}";
                }
                else {
                    question = "Which of the following are rational numbers?<br/>{" + questionDisplayArray + "}";
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

        
        return questionArray;
    },

    markQuiz: (quizData, questionArray, answerArray) => {
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
        console.log("answerarray is");
        console.log(answerArray);
        console.log("questionarray is");
        console.log(questionArray)
        for (let i = 0; i < numOfQ; i++) {
            let difficulty = 'medium';
            let isCorrect = false;
            if (answerArray[i] != undefined && questionArray[i][1][0].length == Object.keys(answerArray[i]).length) {
                for (var l = 0; l < questionArray[i][1][0].length; l++) {
                    let optionName = Object.keys(answerArray[i]).sort()[l];

                    if (questionArray[i][1][0][l] == answerArray[i][optionName]) {                    
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
                correctAnswer = questionArray[i][1][0];
            }

            let inputArray = [];

            for (let p = 0; p < Object.keys(answerArray[i]).length; p++) {
                inputArray.push((answerArray[i])[Object.keys(answerArray[i])[p]]);
            }
            
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