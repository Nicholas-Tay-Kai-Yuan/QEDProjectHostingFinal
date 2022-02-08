const math = require('mathjs');

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

export default ordering = {

    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);        

        questionArray = []

        for (let i = 0; i < numOfQ; i++) {

            let question = "";
            let answer = "";
            let array = [];
            let number;
            let squareroot;
            let cuberoot;
            let numerator;
            let denominator;
            let optionsArray = [];

            // Generate number 

            number = generateRandomNumber(-9, 9);
            squareroot = generateRandomNumber(1, 9);
            cuberoot = generateRandomNumber(1, 30);
            numerator = generateRandomNumber(1, 9);
            denominator = generateRandomNumber(2, 9);

            optionsArray.push(number);
            optionsArray.push(squareroot);
            optionsArray.push(cuberoot);
            optionsArray.push(numerator);
            optionsArray.push(denominator);

            question = `Arrange the following in ascending order: <br/>{&#8508;, ${number}, &radic;<span style="text-decoration: overline">${squareroot}</span>, &#8731;<span style="text-decoration: overline">${cuberoot}</span>, <sup>${numerator}</sup>&frasl;<sub>${denominator}</sub>}`;

            answer = math.sort([Math.PI, number, Math.sqrt(squareroot), Math.cbrt(cuberoot), numerator/denominator]);

            array.push(optionsArray);
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

            let inputArray = [];

            for (let p = 0; p < Object.keys(answerArray[i]).length; p++) {
                if (answerArray[i][p][0] == "√") {
                    let value = answerArray[i][p].toString().replace("√", '√<span style="text-decoration: overline">');
                    value = value.toString().replace("\u0305", "</span>");
                    inputArray.push(value);
                }
                else if (answerArray[i][p][0] == "∛") {
                    let value = answerArray[i][p].toString().replace("∛", '∛<span style="text-decoration: overline">');
                    value = value.toString().replace("\u0305", "");
                    value = value.toString().replace("\u0305", "</span>");
                    inputArray.push(value);
                }
                else {
                    inputArray.push((answerArray[i])[Object.keys(answerArray[i])[p]]);
                }
            }

            // let review = '<i class="fas fa-check" style="color: #42FE00"></i>';
            let difficulty = 'difficult';
            let isCorrect = false;

            // let input1 = $(`#question${i+1} #opt1`).html();
            // let input2 = $(`#question${i+1} #opt2`).html();
            // let input3 = $(`#question${i+1} #opt3`).html();
            // let input4 = $(`#question${i+1} #opt4`).html();
            // let input5 = $(`#question${i+1} #opt5`).html();

            // $(".reviewClass").css("display", "block");

            // let inputArray = [input1, input2, input3, input4, input5];
            let solutionArray = [];

            for (let x = 0; x < answerArray[i].length; x++) {
                if (answerArray[i][x][0] == "ℼ") {
                    answerArray[i][x] = Math.PI;
                }
                else if (answerArray[i][x][0] == "√") {
                    // answerArray[x] = Math.sqrt($(`#question${i+1} #opt${x+1}`).children().html());
                    let value = answerArray[i][x].toString().replace("√", "");
                    value = value.toString().replace("\u0305", "");
                    answerArray[i][x] = Math.sqrt(value);
                }
                else if (answerArray[i][x][0] == "∛") {
                    let value = answerArray[i][x].toString().replace("∛", "");
                    value = value.toString().replace("\u0305", "");
                    value = value.toString().replace("\u0305", "");

                    answerArray[i][x] = Math.cbrt(value);
                }
                else if (answerArray[i][x][0]== "<") {
                    let fraction = answerArray[i][x].toString().split(">⁄<");
                    let numerator = fraction[0];
                    let denominator = fraction[1];

                    numerator = numerator.replace("<sup>", "");
                    numerator = numerator.replace("</sup", "");

                    denominator = denominator.replace("sub>", "");
                    denominator = denominator.replace("</sub>", "");

                    answerArray[i][x] = numerator/denominator;

                }
                else {
                    answerArray[i][x] = parseInt(answerArray[i][x])
                }
            }

            for (let l = 0; l < questionArray[i][1].length; l++) {
                if (questionArray[i][1][l] == answerArray[i][l]) {
                    if (l+1 == questionArray[i][1].length) {
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
                              
                }
                else {
                    isCorrect = false;
                    break;
                }
            }

            var wholeNumber = questionArray[i][0][0];
            var squareroot = Math.sqrt(questionArray[i][0][1]);
            var cuberoot = Math.cbrt(questionArray[i][0][2]);
            var fraction = questionArray[i][0][3]/questionArray[i][0][4];
            var piCount = 0;
            var wholenumberCount = 0;
            var squarerootCount = 0;
            var cuberootCount = 0;
            var fractionCount = 0;

            for (let p = 0; p < questionArray[i][1].length; p++) {
                if (questionArray[i][1][p] == Math.PI && piCount == 0) {
                    solutionArray.push("ℼ");
                    piCount++;
                }
                else if (questionArray[i][1][p] == wholeNumber && wholenumberCount == 0) {
                    solutionArray.push(wholeNumber);
                    wholenumberCount++;
                } 
                else if (questionArray[i][1][p] == squareroot && squarerootCount == 0) {
                    solutionArray.push(`&radic;<span style="text-decoration: overline">${questionArray[i][0][1]}</span>`);
                    squarerootCount++;
                }
                else if (questionArray[i][1][p] == cuberoot && cuberootCount == 0) {
                    solutionArray.push(`&#8731;<span style="text-decoration: overline">${questionArray[i][0][2]}</span>`);
                    cuberootCount++;
                }
                else if (fractionCount == 0) {
                    solutionArray.push(`<sup>${questionArray[i][0][3]}</sup>&frasl;<sub>${questionArray[i][0][4]}</sub>`);
                    fractionCount++;
                }
            }

            if (!isCorrect) {
                review = '<i class="fas fa-times" style="color: #FF0505"></i>  Ans: ';
                review += solutionArray;
            }
          
            // document.getElementById(`review${i}`).innerHTML = review;

            let allQuestionsArray = [];

            allQuestionsArray[0] = "ℼ";
            allQuestionsArray[1] = questionArray[i][0][0];
            allQuestionsArray[2] = `&radic;<span style="text-decoration: overline">${questionArray[i][0][1]}</span>`;
            allQuestionsArray[3] = `&#8731;<span style="text-decoration: overline">${questionArray[i][0][2]}</span>`;
            allQuestionsArray[4] = `<sup>${questionArray[i][0][3]}</sup>&frasl;<sub>${questionArray[i][0][4]}</sub>`;

            console.log("inputArray is");
            console.log(inputArray.toString());

            questions.push({
                "skill_id": quizData.skillId,
                "question_number": i + 1,
                "question": allQuestionsArray.toString(),
                "answer": inputArray.toString(),
                "correct_answer": solutionArray.toString(),
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