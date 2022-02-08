
const integers = {

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
                        value += generateRandomNumber(quizData[key].min, quizData[key].max)
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
                            value += generateRandomNumber(quizData[key].min, quizData[key].max)
                        }
                    }
                    else {
                        if (l % 2 == 0 ) {
                            value += generateRandomNumber(quizData[key].min, quizData[key].max)
                        }
                        else {
                            value += generateRandomString(operationArray)
                        }
                    }
                    

                }
            }

            question = "Evaluate " + value;

            answer = eval(value.replaceAll("--", "- -"));

            array.push(question);
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
                                        <p style="font-size: 18px">Q${i + 1}. ${(questionArray[i][0]).toString().replaceAll("-", "−")}</p>
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

            let input = $(`#input${i}`).val();

            $(".reviewClass").css("display", "block");


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

            let solution = questionArray[i][1]
            if (!isCorrect) {
                review = '<i class="fas fa-times" style="color: #FF0505"></i>  Ans: ';
                review += solution.toString().replace("-", "−");
            }
          
            document.getElementById(`review${i}`).innerHTML = review;

            questions.push({
                "skill_id": quizData.skillId,
                "question_number": i + 1,
                "question": questionArray[i][0],
                "answer": input,
                "correct_answer": solution,
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