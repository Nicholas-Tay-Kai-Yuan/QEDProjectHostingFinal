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

export default integers = {

    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);        

        questionArray = []

        for (let i = 0; i < numOfQ; i++) {

            let key = "difficult_values";
            let question = "";
            let value = "";
            let answer = "";
            let array = [];
            let operationArray = ["+", "-"];
            let integerCount = 0;
            let operationCount = 0;
            let bracketCount = 0;

            if (i <  numOfEasy) {
                key = "easy_values";
            }
            else if (i < numOfEasy + numOfMedium) {
                key = "medium_values";
            }
            
            if (key == "easy_values") {
                integerCount = 3;
                operationCount = 2;
            }
            else if (key == "medium_values") {
                integerCount = 4;
                operationCount = 3;
            }
            else {
                integerCount = 4;
                operationCount = 3;
                bracketCount = 2;
            }

            for (var l = 0; l < integerCount + operationCount + bracketCount; l++) {
                if (bracketCount == 0) {
                    if (l % 2 == 0) {
                        value += generateRandomNumber(-9, 9)
                    }
                    else {
                        value += generateRandomString(operationArray);
                    }
                }
                else {
                    if (l == 2) {
                        value += "(";
                    }
                    else if (l == 6) {
                        value += ")";
                    }
                    else if (l > 2 && l < 6) {
                        if (l % 2 == 0 ) {
                            value += generateRandomString(operationArray)
                        }
                        else {
                            value += generateRandomNumber(-9, 9)
                        }
                    }
                    else {
                        if (l % 2 == 0 ) {
                            value += generateRandomNumber(-9, 9)
                        }
                        else {
                            value += generateRandomString(operationArray)
                        }
                    }
                    

                }
            }

            question = "Evaluate " + value;

            if (value.includes("--")) {
                value = value.replace(/--/g, "- -")
            }
            answer = eval(value);

            array.push(question);
            array.push(answer);

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

        for (let i = 0; i < numOfQ; i++) {
            let difficulty = 'difficult';
            let isCorrect = false;

            let input = answerArray[i] ? answerArray[i].ans ? answerArray[i].ans : "" : "";


            if (questionArray[i][1] == input && input != "") {
                if (i < numOfEasy) {
                    difficulty = 'easy';
                    easy++;
                }
                else if (i < numOfEasy + numOfMedium) {
                    difficulty = 'medium'
                    medium++;
                }
                else {
                    difficult++;
                }
                isCorrect = true;
            }          

            questions.push({
                "skill_id": quizData.skillId,
                "question_number": i + 1,
                "question": questionArray[i][0],
                "answer": input,
                "correct_answer": questionArray[i][1],
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