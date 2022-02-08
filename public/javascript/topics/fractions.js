//Fractions
const fraction = {
    getGCD: (a, b) => {
        if (b == 0) {
            return a;
        }
        else {
            return fraction.getGCD(b, a % b);
        }
    },
    add: (array) => {
        // a/b + c/d
        numerator = array.a * array.d + array.b * array.c;
        denominator = array.b * array.d;

        return fraction.proper(numerator, denominator);
    },
    multiply: (array) => {
        // a/b + c/d
        numerator = array.a * array.c;
        denominator = array.b * array.d;

        return fraction.proper(numerator, denominator);
    },
    proper: (numerator, denominator) => {
        let result = { "numerator": numerator, "denominator": denominator };

        if ((numerator >= denominator)) {
            result = {};
            result['whole'] = Math.floor(numerator / denominator);
            if (numerator != denominator && numerator % denominator != 0) {
                result['numerator'] = numerator - (denominator * result['whole']);
                result['denominator'] = denominator;
            }
        }

        return result;
    },
    sort: (array) => {
        let sorted = {};
        const alphabets = ["a", "b", "c", "d"];

        for (let i = 0; i < array.length; i++) {
            sorted[alphabets[i]] = array[i];
        }

        return sorted;
    },
    checkDuplicates: (sorted) => {
        for (let i = 0; i < questionArray.length; i++) {
            var dupes = true;

            for (key in sorted) {
                if (questionArray[i][key] != sorted[key]) {
                    dupes = false;
                    break;
                }
            }
            if (dupes) break;
        }

        return dupes;
    },
    stringQuestion: (question, difficulty) => {
        let result = question.a + "/" + question.b;

        if (quizData.skill_code == `FRAC_ADD_SUB`) {
            if (difficulty == "easy") {
                result = question[0][0] + "/" + question[0][1] + " " + question[1][0] + " " + question[0][2] + "/" + question[0][3] + " " + question[1][1] + " " + question[0][4] + "/" + question[0][5];
            }
            else if (difficulty == "medium") {
                result = question[0][0] + "/" + question[0][1] + " " + question[1][0] + " " + question[0][2] + "/" + question[0][3] + " " + question[1][1] + " " + question[0][4] + "/" + question[0][5] + " " +question[1][2] + " " + question[0][6] + "/" + question[0][7];
            }
            else {
                result = question[0][0] + "/" + question[0][1] + " " + question[1][0] + " (" + question[0][2] + "/" + question[0][3] + " " + question[1][1] + " " + question[0][4] + "/" + question[0][5] + ") " + question[1][2] + " " + question[0][6] + "/" + question[0][7];
            }
        }
        else if (quizData.skill_code != 'FRAC_SIMPLIFY') {
            (quizData.skill_code == 'FRAC_ADD') ? operator = " + " : operator = " x ";
            result = question.a + "/" + question.b + operator + question.c + "/" + question.d;
        }

        return result;
    },
    stringAnswer: (answer) => {
        let result;

        if (quizData.skill_code == `FRAC_ADD_SUB`) {
            if ('ansA' in answer) {
                result = answer.ansA + "/" + answer.ansB;
            }
            else {
                if (answer[2].s == 1) {
                    result = answer[2].n + "/" + answer[2].d;

                }
                else {
                    result = "-" +answer[2].n + "/" + answer[2].d;
                }
            }
        }
        else {
            if ('ansA' in answer) {
                ('ans' in answer) ? result = answer.ans + " " + answer.ansA + "/" + answer.ansB : result = answer.ansA + "/" + answer.ansB;
            }
            else {
                result = answer.ans;
            }
        }
       

        return result;
    },
    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);

        for (let i = 0; i < numOfQ; i++) {
            let gcd;
            let ans;
            let sorted;
            let amount = 4;
            let checkpoint = true;
            let key = "difficult_values";

            if (i < numOfEasy) {
                key = "easy_values";
            }
            else if (i < numOfEasy + numOfMedium) {
                key = "medium_values";
            }

            if (quizData.skill_code == 'FRAC_SIMPLIFY') {
                amount = 2;
            }
            else if (quizData.skill_code == "FRAC_ADD_SUB") {
                if (key == "easy_values") {
                    amount = 6;
                }
                else {
                    amount = 8;
                }
            }

            //  FRAC_ADD_SUB
            if (quizData.skill_code == 'FRAC_ADD_SUB') {
                let numberArray = [];
                let operationArray = [];
                let operations = ["+", "-"];
                let operationCount = 0;
                let equation;
                let fractionA;
                let fractionB;
                let fractionC;
                let fractionD;
                let answer;

                //  Generating numbers
                for (let l = 0; l < amount; l++) {
                    if (l % 2 == 0) {
                        var num;

                        //  Exclude 0
                        do {
                            num = generateRandomNumber(quizData[key].min, quizData[key].max)
                        } while (num == 0) {

                        }
                        numberArray.push(num)
                    }
                    else {
                        numberArray.push(generateRandomNumber(quizData[key].min, quizData[key].max))
                    }
                }

                if (key == "easy_values") {
                    operationCount = 2;
                }
                else {
                    operationCount = 3;
                }

                //  Generating operations
                for (let l = 0; l < operationCount; l++) {
                    operationArray.push(operations[generateRandomNumber(0, 1)])
                }

                fractionA = numberArray[0]+"/"+numberArray[1];
                fractionB = numberArray[2]+"/"+numberArray[3];
                fractionC = numberArray[4]+"/"+numberArray[5];

                if (key != "easy_values") {
                    fractionD = numberArray[6]+"/"+numberArray[7];
                    if (key == "medium_values") {
                        equation = fractionA + operationArray[0] + fractionB + operationArray[1] + fractionC + operationArray[2] + fractionD;
                    }
                    else {
                        equation = fractionA + operationArray[0] + "(" + fractionB + operationArray[1] + fractionC + ")" + operationArray[2] + fractionD;
                    }
                }
                else {
                    equation = fractionA + operationArray[0] + fractionB + operationArray[1] + fractionC;
                }
        
                answer = math.fraction(eval(equation.replaceAll("--", "- -")));
                sorted = [];
                sorted.push(numberArray);
                sorted.push(operationArray);
                sorted.push(answer);
                questionArray.push(sorted);
            }

            // FRAC_SIMPLIFY, FRAC_ADD, FRAC_MULTIPLY
            else {
                while (checkpoint) {
                    let numberArray = [];
    
                    for (let l = 0; l < amount; l++) {
                        numberArray.push(generateRandomNumber(quizData[key].min, quizData[key].max));
                    }
    
                    sorted = fraction.sort(numberArray);
                    let dupes = (questionArray.length != 0) ? fraction.checkDuplicates(sorted) : false;
    
                    if (!dupes) {
                        if (quizData.skill_code == 'FRAC_SIMPLIFY') {
                            gcd = fraction.getGCD(sorted.a, sorted.b);
    
                            if (gcd != 1 && sorted.a != sorted.b) {
                                ans = fraction.proper(sorted.a, sorted.b);
                                checkpoint = false;
                            }
                        }
                        else {
                            if (sorted.a != sorted.b && sorted.c != sorted.d) {
                                (quizData.skill_code == 'FRAC_ADD') ? ans = fraction.add(sorted) : ans = fraction.multiply(sorted);
                                if (ans.numerator != null) gcd = fraction.getGCD(ans.numerator, ans.denominator);
                                checkpoint = false;
                            }
                        }
                    }
                }

                questionArray.push(sorted);
                if ('whole' in ans) questionArray[i].ans = ans.whole;
                if ('numerator' in ans) questionArray[i].ansA = ans.numerator / gcd;
                if ('denominator' in ans) questionArray[i].ansB = ans.denominator / gcd;
            }
            

            
        }
    },
    arrangeQuestion: () => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);
        const numOfDifficult = numOfQ * (percentDifficulty[2] / 100);
        let amount = 3;
        let content = `<div class="col-12 scrollbar border rounded" id="scrollQuestions" style="border-radius: 7px;">`;
        if (quizData.skill_code == 'FRAC_ADD_SUB') {            
            for (let i = 0; i < questionArray.length; i++) {
                if (i < numOfEasy) {
                    amount = 5;
                }
                else if (i < numOfEasy + numOfMedium) {
                    amount = 7;
                }
                else {
                    amount = 9;
                }
                content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5 question"><div class="small col-md-2"><p style="font-size: 18px">Q${i + 1}</p></div>`;

                var count = 0;
                
                for (let l = 0; l < amount; l++) {

                    // Display easy and intermediate questions
                    if (i < numOfEasy + numOfMedium) {
                        if (l % 2 == 0 ) {
                            if (l == 0) {
                                content += `<div class="row col align-items-center">
                                                <div class="col-12">
                                                    <div style="border-bottom: solid 1px" class="pb-1">${questionArray[i][0][2 * l]}</div>
                                                    <div class="pt-1">${questionArray[i][0][2 * l + 1]}</div>
                                                </div>
                                            </div>`
                            }
                            else {
                                content += `<div class="row col align-items-center">
                                                <div class="col-12">
                                                    <div style="border-bottom: solid 1px" class="pb-1">${questionArray[i][0][2 * (l - (1 + count))]}</div>
                                                    <div class="pt-1">${questionArray[i][0][2 * (l-(1+count)) + 1]}</div>
                                                </div>
                                            </div>`
    
                                count++;
                            }
                        }
                        else {
                            let index;

                            switch (l) {
                                case 1 :
                                    index = 0;
                                    break;
                                case 3 :
                                    index = 1;
                                    break;
                                case 5 :
                                    index = 2;
                                    break;
                            }

                            content += `<div class="col">
                                            <div>${(questionArray[i][1][index]).toString().replace("-", "−")}</div>
                                        </div>`
                        }
                    }

                    //  Display advanced questions
                    else {
                        //  Display fractions
                        if (l == 0 || l == 3 || l == 5 || l == 8 ) {
                            let index;

                            switch (l) {
                                case 0 :
                                    index = 0;
                                    break;
                                case 3 :
                                    index = 2;
                                    break;
                                case 5 :
                                    index = 4;
                                    break;
                                case 8 :
                                    index = 6;
                                    break;
                            }

                            content += `<div class="row col align-items-center">
                                                <div class="col-12">
                                                    <div style="border-bottom: solid 1px" class="pb-1">${questionArray[i][0][index]}</div>
                                                    <div class="pt-1">${questionArray[i][0][index + 1]}</div>
                                                </div>
                                            </div>`
                        }

                        //  Display operators
                        else if (l == 1 || l == 4 || l == 7) {
                            let index;
                           
                            switch (l) {
                                case 1 :
                                    index = 0;
                                    break;
                                case 4 :
                                    index = 1;
                                    break;
                                case 7 :
                                    index = 2;
                                    break;
                            }

                            content += `<div class="col">
                                            <div>${(questionArray[i][1][index]).toString().replace("-", "−")}</div>
                                        </div>`
                        }

                        //  Display brackets
                        else {
                            let bracket = ""
                            switch (l) {
                                case 2 :
                                    bracket = "(";
                                    break;
                                case 6 :
                                    bracket = ")";
                                    break;

                            }

                            content += `<div class="col">
                                            <div>${bracket}</div>
                                        </div>`
                        }
                    }
                    
                }

                content += `<div class="col">
                                <div>=</div>
                            </div>`        
                            
                content += `<div class="row col align-items-center">
                                <div class="col p-0">
                                    <div style="border-bottom:solid 1px" class="pb-1">
                                        <input class="text-center" style="font-family: Roboto" size="1" id="inputA${i}">
                                    </div>
                                    <div class="pt-1">
                                        <input class="text-center" style="font-family: Roboto" size="1" id="inputB${i}">
                                    </div>
                                </div>
                            </div>`

                content += `<div class='col-md-2 reviewClass'><span id='review${i}'></span></div>`;

                content += "</div>";

            }

        }
        else {
            if (quizData.skill_code == 'FRAC_SIMPLIFY') amount = 2;
            for (let i = 0; i < questionArray.length; i++) {
                content += `<div class="row col-9 justify-content-center align-items-center text-center m-auto mb-5 question"><div class="small col-md-2"><p style="font-size: 18px">Q${i + 1}</p></div>`;
    
                for (let l = 0; l < amount; l++) {
                    let name = 'col-12';
                    let operator = null;
                    let wholeInput = "";
                    let className = 'col-12';
                    let holderA = questionArray[i].a;
                    let holderB = questionArray[i].b;
    
                    if (l == 1) {
                        holderA = questionArray[i].c;
                        holderB = questionArray[i].d;
                    }
    
                    if (l == amount - 1) {
                        if ('ans' in questionArray[i]) {
                            className = 'col-6 p-0';
    
                            if ('ansA' in questionArray[i]) name = 'col-6 d-flex justify-content-end p-1';
    
                            wholeInput = `<div class="${name}"><input class="text-center" size="1" id='input${i}'></div>`;
                        }
                        if ('ansA' in questionArray[i]) {
                            holderA = `<input class="text-center" style="font-family: Roboto" size = "1" id='inputA${i}'>`;
                            holderB = `<input class="text-center" style="font-family: Roboto" size = "1" id='inputB${i}'>`;
                        }
                        else {
                            holderA = null, holderB = null;
                        }
    
                    }
                    content += `<div class="row col-md-2 align-items-center">` + wholeInput;
    
                    if (holderA != null) {
                        content += `<div class="${className}"><div style="border-bottom:solid 1px" class="pb-1">${holderA}</div><div class="pt-1">${holderB}</div></div>`;
                    }
    
                    content += "</div>";
    
                    if (l == amount - 2) operator = "=";
    
                    if (quizData.skill_code != 'FRAC_SIMPLIFY') {
                        if (l == 0) (quizData.skill_code == 'FRAC_ADD') ? operator = "+" : operator = "x";
                    }
    
                    if (operator != null) {
                        content +=
                            `<div class="col-md-1">
                                <div>${operator}</div>
                            </div>`;
                    }
                }
                content += `<div class='col-md-2 reviewClass'><span id='review${i}'></span></div></div>`;
            }
    
        }
        
        return content;
    },
    markQuiz: () => {
        let score
        let easy = 0;
        let medium = 0;
        let difficult = 0;
        let questions = [];

        const numOfQ = quizData.num_of_qn, percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);
        const numOfDifficult = numOfQ * (percentDifficulty[2] / 100);

        for (let i = 0; i < numOfQ; i++) {
            let review = '<i class="fas fa-check" style="color: #42FE00"></i>';
            let difficulty = 'difficult';
            let isCorrect = false;
            let studentAns = {};
            let currentDifficulty = "difficult";

            if (quizData.skill_code == "FRAC_ADD_SUB") {
                let inputA = $(`#inputA${i}`).val();
                let inputB = $(`#inputB${i}`).val();


                if (i < numOfEasy) {
                    currentDifficulty = 'easy';
                }
                else if (i < numOfEasy + numOfMedium) {
                    currentDifficulty = 'medium';
                }
                else {
                }

                if (inputA != undefined) studentAns['ansA'] = inputA;
                if (inputB != undefined) studentAns['ansB'] = inputB;

                $(".reviewClass").css("display", "block");

                var denominator = questionArray[i][2].d;
                var numerator;

                if (questionArray[i][2].s == 1) {
                    numerator = questionArray[i][2].n;
                }
                else {
                    numerator = -questionArray[i][2].n;
                }

                
                if (inputA == numerator && inputB == denominator) {
                    if (i < numOfEasy) {
                        difficulty = 'easy';
                        easy++;
                    }
                    else if (i < numOfEasy + numOfMedium) {
                        difficulty = 'medium';
                        medium++;
                    }
                    else {
                        difficult++;
                    }
                    isCorrect = true;
                }
                else {
                    review = `<i class="fas fa-times" style="color: #FF0505"></i>  Ans: <sup>${numerator.toString().replace("-", "−")}</sup>&frasl;<sub>${denominator}</sub>`;

                }
            }
            else {
                let input = ('ans' in questionArray[i]) ? $(`#input${i}`).val() : undefined;
                let inputA = ('ansA' in questionArray[i]) ? $(`#inputA${i}`).val() : undefined;
                let inputB = ('ansB' in questionArray[i]) ? $(`#inputB${i}`).val() : undefined;

                if (input != undefined) studentAns['ans'] = input;
                if (inputA != undefined) studentAns['ansA'] = inputA;
                if (inputB != undefined) studentAns['ansB'] = inputB;

                $(".reviewClass").css("display", "block");

                if (inputA == questionArray[i].ansA && inputB == questionArray[i].ansB && input == questionArray[i].ans) {
                    if (i < numOfEasy) {
                        difficulty = 'easy';
                        easy++;
                    }
                    else if (i < numOfEasy + numOfMedium) {
                        difficulty = 'medium';
                        medium++;
                    }
                    else {
                        difficult++;
                    }
                    isCorrect = true;
                }
                else {
                    review = '<i class="fas fa-times" style="color: #FF0505"></i>  Ans: ';

                    if ('ans' in questionArray[i]) review += `${questionArray[i].ans}`;
                    if ('ansA' in questionArray[i]) review += `<sup>${(questionArray[i].ansA).toString().replace("-", "−")}</sup>&frasl;<sub>${questionArray[i].ansB}</sub>`;
                }
            }
            
            document.getElementById(`review${i}`).innerHTML = review;

            questions.push({
                "skill_id": quizData.skillId,
                "question_number": i + 1,
                "question": fraction.stringQuestion(questionArray[i], currentDifficulty),
                "answer": fraction.stringAnswer(studentAns),
                "correct_answer": fraction.stringAnswer(questionArray[i]),
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