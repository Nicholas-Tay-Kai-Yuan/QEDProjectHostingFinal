const ordering = {

    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);        

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
            let key = "difficult_values";

            // Generate number 

            number = generateRandomNumber(quizData[key].min, quizData[key].max);
            squareroot = generateRandomNumber(quizData[key].min <= 0 ? 1 : quizData[key].min, quizData[key].max);
            cuberoot = generateRandomNumber(quizData[key].min <= 0 ? 1 : quizData[key].min, quizData[key].max);
            numerator = generateRandomNumber(quizData[key].min <= 0 ? 1 : quizData[key].min, quizData[key].max);
            denominator = generateRandomNumber(quizData[key].min <= 1 ? 2 : quizData[key].min, quizData[key].max);

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
    },

    arrangeQuestion: () => {
        let content = `<div class="col-12 scrollbar border rounded" id="scrollQuestions" style="border-radius: 7px;">`;
        let form = ``
        for (let i = 0; i < questionArray.length; i++) {
    
            form = `<input class="text-center" id="input${i}" size="2">`;
            
            content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5 question">
                            <div class="col" id="question${i+1}">
                                <div class="row justify-content-center align-items-center">
                                    <div class="small col-md-8 mt-3">
                                        <p style="font-size: 18px">Q${i + 1}. Arrange the following in ascending order: </p>
                                    </div>
                                </div>
                                <div class="row justify-content-center align-items-center">
                                    <div class="small col-1 mt-3 orderingOptions" ondrop="drop(event)" ondragover="allowDrop(event)">
                                        <p class="p-3 m-0" id="opt1" draggable="true" ondragstart="drag(event)">&#8508;</p>
                                    </div>
                                    <div class="small col-1 mt-3 orderingOptions" ondrop="drop(event)" ondragover="allowDrop(event)">
                                        <p class="p-3 m-0" id="opt2" draggable="true" ondragstart="drag(event)">${questionArray[i][0][0].toString().replace("-", "−")}</p>
                                    </div>
                                    <div class="small col-1 mt-3 orderingOptions" ondrop="drop(event)" ondragover="allowDrop(event)">
                                        <p class="p-3 m-0" id="opt3" draggable="true" ondragstart="drag(event)">&radic;<span style="text-decoration: overline">${questionArray[i][0][1]}</span></p>
                                    </div>
                                    <div class="small col-1 mt-3 orderingOptions" ondrop="drop(event)" ondragover="allowDrop(event)">
                                        <p class="p-3 m-0" id="opt4" draggable="true" ondragstart="drag(event)">&#8731;<span style="text-decoration: overline">${questionArray[i][0][2]}</span></p>
                                    </div>
                                    <div class="small col-1 mt-3 orderingOptions" ondrop="drop(event)" ondragover="allowDrop(event)">
                                        <p class="p-3 m-0" id="opt5" draggable="true" ondragstart="drag(event)"><sup>${questionArray[i][0][3]}</sup>&frasl;<sub>${questionArray[i][0][4]}</sub></p>
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

            let input1 = $(`#question${i+1} #opt1`).html();
            let input2 = $(`#question${i+1} #opt2`).html();
            let input3 = $(`#question${i+1} #opt3`).html();
            let input4 = $(`#question${i+1} #opt4`).html();
            let input5 = $(`#question${i+1} #opt5`).html();

            $(".reviewClass").css("display", "block");

            let inputArray = [input1, input2, input3, input4, input5];
            let displayArray = [input1, input2, input3, input4, input5];
            let solutionArray = [];

            for (let x = 0; x < inputArray.length; x++) {
                if (inputArray[x][0] == "ℼ") {
                    inputArray[x] = Math.PI;
                }
                else if (inputArray[x][0] == "√") {
                    inputArray[x] = Math.sqrt($(`#question${i+1} #opt${x+1}`).children().html());
                }
                else if (inputArray[x][0] == "∛") {
                    inputArray[x] = Math.cbrt($(`#question${i+1} #opt${x+1}`).children().html());
                }
                else if (inputArray[x][0] == "<") {
                    inputArray[x] = $(`#question${i+1} #opt${x+1}`).children()[0].innerHTML/$(`#question${i+1} #opt${x+1}`).children()[1].innerHTML;
                }
                else {
                    inputArray[x] = parseInt(inputArray[x])
                }
            }

            for (let l = 0; l < questionArray[i][1].length; l++) {
                if (questionArray[i][1][l] == inputArray[l]) {
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
                    solutionArray.push(wholeNumber.toString().replace("-", "−"));
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
                    solutionArray.push(`<sup>${questionArray[i][0][3].toString().replace("-", "−")}</sup>&frasl;<sub>${questionArray[i][0][4]}</sub>`);
                    fractionCount++;
                }
            }

            if (!isCorrect) {
                review = '<i class="fas fa-times" style="color: #FF0505"></i>  Ans: ';
                review += solutionArray;
            }
          
            document.getElementById(`review${i}`).innerHTML = review;

            let allQuestionsArray = [];

            allQuestionsArray[0] = "ℼ";
            allQuestionsArray[1] = questionArray[i][0][0];
            allQuestionsArray[2] = `&radic;<span style="text-decoration: overline">${questionArray[i][0][1]}</span>`;
            allQuestionsArray[3] = `&#8731;<span style="text-decoration: overline">${questionArray[i][0][2]}</span>`;
            allQuestionsArray[4] = `<sup>${questionArray[i][0][3]}</sup>&frasl;<sub>${questionArray[i][0][4]}</sub>`;

            questions.push({
                "skill_id": quizData.skillId,
                "question_number": i + 1,
                "question": allQuestionsArray.toString(),
                "answer": displayArray.toString(),
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