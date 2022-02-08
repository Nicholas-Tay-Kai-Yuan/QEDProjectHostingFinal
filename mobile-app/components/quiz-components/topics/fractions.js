const math = require('mathjs');

//Fractions
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

function stringAnswer(quizData, answer) {
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
}

function stringQuestion(quizData , question, difficulty) {
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

    // console.log("result is");
    // console.log(result);
    return result;
}

//Fractions
export default fraction = {
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
  
    generateQuestion: (quizData) => {
        const numOfQ = quizData.num_of_qn;
        const percentDifficulty = quizData.percent_difficulty.split("-");
        const numOfEasy = numOfQ * (percentDifficulty[0] / 100);
        const numOfMedium = numOfQ * (percentDifficulty[1] / 100);

        questionArray = []
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
                            num = generateRandomNumber(-9, 9)
                        } while (num == 0) {

                        }
                        numberArray.push(num)
                    }
                    else {
                        numberArray.push(generateRandomNumber(2, 9))
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

                answer = math.fraction(eval(equation.replace(/--/g, "- -")));
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

        return questionArray;
    },

    markQuiz: (quizData, questionArray, answerArray) => {
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
            let difficulty = 'difficult';
            let isCorrect = false;
            let studentAns = {};
            let currentDifficulty = "difficult";

            if (quizData.skill_code == "FRAC_ADD_SUB") {
                let inputA = answerArray[i] ? answerArray[i].ansA ? answerArray[i].ansA: "" : "";
                let inputB = answerArray[i] ? answerArray[i].ansB ? answerArray[i].ansB: "" : "";


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

                // $(".reviewClass").css("display", "block");

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
                
                }
            }
            else {
                let input = ('ans' in questionArray[i]) ? answerArray[i] ? answerArray[i].ans : "" : "";
                let inputA = ('ansA' in questionArray[i]) ? answerArray[i] ? answerArray[i].ansA : "" : "";
                let inputB = ('ansB' in questionArray[i]) ? answerArray[i] ? answerArray[i].ansB : "": "";

                if (input != "") studentAns['ans'] = input;
                if (inputA != "") studentAns['ansA'] = inputA;
                if (inputB != "") studentAns['ansB'] = inputB;

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

                }
            }
            
            questions.push({
                "skill_id": quizData.skillId,
                "question_number": i + 1,
                "question": stringQuestion(quizData, questionArray[i], currentDifficulty),
                "answer": stringAnswer(quizData, studentAns),
                "correct_answer": stringAnswer(quizData, questionArray[i]),
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