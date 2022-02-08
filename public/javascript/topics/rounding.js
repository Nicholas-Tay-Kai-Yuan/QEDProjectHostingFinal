const roundingOff = {

    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);        

        for (let i = 0; i < numOfQ; i++) {

            let key = "difficult_values";
            let question = "";
            let value = null;
            let answer = "";
            let array = [];
            let answerArray = [];

            if (i <  numOfEasy) {
                key = "easy_values";
            }
            else if (i < numOfEasy + numOfMedium) {
                key = "medium_values";
            }
            
            if (key == "easy_values") {
                // value = generateRandomDecimal(quizData[key].min, quizData[key].max, 3);
                value = generateRandomDecimal(quizData[key].min, quizData[key].max, 3)
                question = "Round off " + value + " to 2 decimal places.";
                answer = Math.round(value * 100) / 100;
                answerArray.push(answer);
            }
            else if (key == "medium_values") {
                // value = generateRandomDecimal(quizData[key].min, quizData[key].max, 3);
                value = generateRandomDecimal(quizData[key].min, quizData[key].max, generateRandomNumber(0, 3))
                question = "Round off " + value + " to 3 significant figures.";
                answer = Number.parseFloat(value).toPrecision(3);
                answerArray.push(answer);
            }
            else {
                // value = generateRandomDecimal(quizData[key].min, quizData[key].max, 2);
                value = generateRandomDecimal(quizData[key].min, quizData[key].max, 2)
                question = "Given that " + value + " is a number rounded off to two decimal places, state the range of values (to 3 d.p) of the original number.";
                answer = (parseFloat(value) - 0.005).toFixed(3);
                answerArray.push(answer);
                answer = (parseFloat(value) + 0.004).toFixed(3);
                answerArray.push(answer);
            }

            array.push(question);
            array.push(answerArray);

            questionArray.push(array);

        }
    },

    arrangeQuestion: () => {
        let content = `<div class="col-12 scrollbar border rounded" id="scrollQuestions" style="border-radius: 7px;">`;
        let form = ``
        for (let i = 0; i < questionArray.length; i++) {
            if (questionArray[i][1].length == 2) {
                form = `<input class="text-center" id="inputA${i}" size="2">&nbsp; to &nbsp;<input class="text-center" id="inputB${i}" size="2">`
            }
            else {
                form = `<input class="text-center" id="input${i}" size="2">`;
            }
            
            content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5 question">
                            <div class="col">
                                <div class="row justify-content-center align-items-center">
                                    <div class="small col-md-8 mt-3">
                                        <p style="font-size: 18px">Q${i + 1}. ${questionArray[i][0]}</p>
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
            let studentAns = '';
            let correctAns = '';

            let input = ``;

            $(".reviewClass").css("display", "block");

            for (var l = 0; l < questionArray[i][1].length; l++) {
                if (questionArray[i][1].length == 1) {     
                    input = $(`#input${i}`).val();       
                    correctAns = questionArray[i][1][0];
                    studentAns = input;
                }
                else {
                    correctAns = questionArray[i][1][0] + " to " + questionArray[i][1][1];
                    if (l == 0) {
                        input = $(`#inputA${i}`).val();
                        studentAns = input;
                    }
                    else {
                        input = $(`#inputB${i}`).val();
                        studentAns += " to " +input;
                    }
                    
                }

                if (input == questionArray[i][1][l]) {
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

            if (!isCorrect) {
                review = '<i class="fas fa-times" style="color: #FF0505"></i>  Ans: ';
                if (questionArray[i][1].length == 1) {
                    review += questionArray[i][1][0]
                }
                else {
                    review += questionArray[i][1][0] + ' to ' + questionArray[i][1][1]; 
                }
            }
          
            document.getElementById(`review${i}`).innerHTML = review;

            questions.push({
                "skill_id": quizData.skillId,
                "question_number": i + 1,
                "question": questionArray[i][0],
                "answer": studentAns,
                "correct_answer": correctAns,
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