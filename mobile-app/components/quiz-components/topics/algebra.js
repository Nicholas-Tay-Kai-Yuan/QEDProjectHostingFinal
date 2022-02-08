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

export default algebra = {

    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);        

        for (let i = 0; i < numOfQ; i++) {

            let key = "difficult_values";
            let question = "";
            let value = "";
            let answer = "";
            let array = [];
            let operationArray = ["+", "-"];
            let integerCount = 0;
            let letterCount = 0;
            let powerCount = 0;
            let letters = "abcdefghijklmnopqrstuvwxyz";
            let expression;

            if (i <  numOfEasy) {
                key = "easy_values";
            }
            else if (i < numOfEasy + numOfMedium) {
                key = "medium_values";
            }
            
            if (key == "easy_values" || key == "medium_values") {
                integerCount = 2;
                letterCount = 2;
                powerCount = 2;
                // question = "Round off " + value + " to 2 decimal places.";
                // answer = Math.round(value * 100) / 100;
                // answerArray.push(answer);
            }
            else {
                integerCount = 2;
                letterCount = 3;
                powerCount = 3;
            }

            for (var l = 0; l < integerCount + letterCount + powerCount; l++) {
                let num = 0;

                //Easy and Medium
                if (letterCount == 2) {
                    if (l == 2 || l == 5) {
                        if (key == "easy_values") {
                            value += "<sup>"+generateRandomNumber(2, 9)+ "</sup>"
                        }
                        else {
                            do {
                                num = generateRandomNumber(-9, 9);
                            }
                            while (num == 0  || num == 1 )
    
                            value += "<sup>" +num+ "</sup>"
                        }
                    }
                    else if (l == 1 || l == 4) {
                        value += generateRandomString(letters);
                    }
                    else {
                        do {
                            num = generateRandomNumber(-9, 9);
                        }
                        while (num == 0  || num == 1 )

                        value += num
                    }
                
                } 

                //Advanced
                else {
                    if (l == 0 || l == 3) {
                        do {
                            num = generateRandomNumber(-9, 9);
                        }
                        while (num == 0  || num == 1 )

                        value += num 
                    }
                    else if (l == 1 || l == 4 || l == 6) {
                        value += generateRandomString(letters);
                    }
                    else {
                        do {
                            num = generateRandomNumber(-9, 9);
                        }
                        while (num == 0  || num == 1 )

                        value += "<sup>" +num+ "</sup>" 
                    }


                    // var numberArray = [1, 4, 6]
                    // var dupe1;
                    // var dupe2; 

                    // do {
                    //     dupe1 = numberArray[generateRandomNumber(0,2)]
                    //     dupe2 = numberArray[generateRandomNumber(0,2)]
                    //     console.log(dupe1);
                    //     console.log(dupe2);
                    // }
                    // while (dupe1 == dupe2)

                    // value[dupe1] = value[dupe2];

                }
            }

            // 2 duplicate letters for Advanced
            if (key == "difficult_values") {
                var indexWithLetters = [];
                for (var x = 0; x < value.length; x++) {
                    if (value[x] == "<" && value[x+4] == ">") {
                        indexWithLetters.push(x-1);
                    }
                }
    
                do {
                    dupe1 = indexWithLetters[generateRandomNumber(0,2)]
                    dupe2 = indexWithLetters[generateRandomNumber(0,2)]
                }
                while (dupe1 == dupe2)
                value = value.substring(0, dupe1) + value[dupe2] + value.substring(dupe1 + 1);
            }
            

            question = "Simplify " + value;

            // answer = eval(value.replaceAll("--", "- -"));

            array.push(question);

            expression = value.replaceAll("<sup>", "^");
            expression = expression.replaceAll("</sup>", "");
            for (var p = 0; p < expression.length; p++) {
                if (expression[p] == "^") {
                    if (expression[p+1] == "-" && p+3 != expression.length) {
                        if (expression[p+3] == "-") {

                        }
                        else {
                            expression = expression.substring(0, p + 3) + "*" + expression.substring(p+3);
                        }
                    }
                    else if (expression[p+1] != "-" && p+2 != expression.length) {
                        if (expression[p+2] == "-") {

                        }
                        else {
                            expression = expression.substring(0, p + 2) + "*" + expression.substring(p+2);
                        }
                    }
                    else {

                    }
                }
            }

            answer = math.simplify(expression).toString();
            array.push(answer);
            questionArray.push(array);

        }
    },

    arrangeQuestion: () => {
        let content = `<div class="col-12 scrollbar border rounded" id="scrollQuestions" style="border-radius: 7px;">`;
        let form = ``
        for (let i = 0; i < questionArray.length; i++) {
    
            form = `<input class="text-center" id="input${i}" size="2">`;
            
            content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5 question">
                            <div class="col">
                                <div class="row justify-content-center align-items-center">
                                    <div class="small col-md-8 mt-3">
                                        Q${i + 1}. ${questionArray[i][0]}
                                    </div>
                                </div>
                                <div class="row justify-content-center align-items-center">
                                    <div class="small col-md-8 mt-3">
                                        Ans: ${form}
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
            let difficulty = 'difficult';
            let isCorrect = false;
            let correctAns = '';

            let input = $(`#input${i}`).val();

            $(".reviewClass").css("display", "block");

            // for (var l = 0; l < questionArray[i][1].length; l++) {
            //     if (questionArray[i][1].length == 1) {     
            //         input = $(`#input${i}`).val();       
            //         correctAns = questionArray[i][1][0];
            //         studentAns = input;
            //     }
            //     else {
            //         correctAns = questionArray[i][1][0] + " to " + questionArray[i][1][1];
            //         if (l == 0) {
            //             input = $(`#inputA${i}`).val();
            //             studentAns = input;
            //         }
            //         else {
            //             input = $(`#inputB${i}`).val();
            //             studentAns += " to " +input;
            //         }
                    
            //     }
            //     console.log(input);

            //     if (input == questionArray[i][1][l]) {
            //         if (l+1 == questionArray[i][1].length) {
                        // if (i < numOfEasy) {
                        //     console.log("ez game")
                        //     difficulty = 'easy';
                        //     easy++;
                        // }
                        // else if (i < numOfEasy + numOfMedium) {
                        //     console.log("med game")
                        //     difficulty = 'medium'
                        //     medium++;
                        // }
                        // else {
                        //     console.log("hard game")
                        //     difficult++;
                        // }
            //             isCorrect = true;
            //         }
            //     }
            //     else {
            //         isCorrect = false;
            //         break;
            //     }    
               
            // }

            if (questionArray[i][1] == input) {
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

            //  Converting ^ to superscript
            if (!isCorrect) {
                review = '<i class="fas fa-times" style="color: #FF0505"></i>  Ans: ';
                // var solution = questionArray[i][1];
                // for (var x = 0; x < solution.length; x++) {
                //     if (solution[x] == "^") {
                //         if (solution[x+1] == "-" ) {
                //             solution = solution.substring(0, x+4) + "</sup>" + solution.substring(x+4);
                //         }
                //         else {
                //             solution = solution.substring(0, x+3) + "</sup>" + solution.substring(x+3);
                //         }
                //     }
                // };

                
                // console.log(solution.replaceAll("^", "<sup>"))
                // review += solution.replaceAll("^", "<sup>");
                review += questionArray[i][1];
            }
          
            document.getElementById(`review${i}`).innerHTML = review;

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