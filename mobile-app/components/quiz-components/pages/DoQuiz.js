import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native";
import { useLocation, useSearchParams, useNavigate } from "react-router-native";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import QuizQuestion from "../components/QuizQuestion";
import QuizButton from "../components/QuizButton";
import fraction from "../topics/fractions";
import integers from "../topics/integers";
import ordering from "../topics/ordering";
import rationalNumbers from "../topics/rational";
import roundingOff from "../topics/rounding";
import Modal from "react-native-modal";
import submitQuiz from "../../../axios/quiz-api/submitQuiz";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default DoQuiz = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [questionsData, setQuestionsData] = useState();
    const [answers, setAnswers] = useState(new Array(state.quizData.num_of_qn));
    const [operator, setOperator] = useState(" ");

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [minutes, setMinutes] = useState(state.duration);
    const [seconds, setSeconds] = useState(0);

    const [userId, setUserId] = useState();

    const [currentProgress, setCurrentProgress] = useState(0);

    const funcs = {
        'Fractions': fraction,
        'Approximation': roundingOff,
        'Integers': integers,
        // 'Algebra': algebra,
        'Ordering Numbers': ordering,
        'Real Numbers': rationalNumbers
    };

    const getUserData = async () => {
        const data = await AsyncStorage.getItem("userInfo");
        return JSON.parse(data)
    };

    useEffect(() => {
        // console.log(state.quizData)
        // const funcs = {
        //     'Fractions': fraction,
        //     'Rounding Off': roundingOff,
        //     'Integers': integers,
        //     // 'Algebra': algebra,
        //     'Ordering Numbers': ordering,
        //     'Rational Numbers': rationalNumbers
        // };

        getUserData()
        .then((data) => {
            setUserId(data._id);
        })

        if (state.quizData.skill_code != 'FRAC_SIMPLIFY') {
            setOperator((state.quizData.skill_code == 'FRAC_ADD') ? " + " : " x ");
        }

        let dataArray = funcs[state.quizData.topic_name].generateQuestion(state.quizData);
        setQuestionsData(dataArray);

    }, [state.quizData]);

    useEffect(() => {
        let totalSeconds = state.duration * 60;
        let secondsLeft = minutes * 60 + seconds;
        let secondsPassed = totalSeconds - secondsLeft;

        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }

            
            setCurrentProgress(secondsPassed/totalSeconds * 610);

        }, 1000)
        if (minutes == 0 && seconds == 0) {
            calculateScore();
        }

        return () => {
            clearInterval(myInterval);
        };

    });


    function calculateScore() {
        let result = funcs[state.quizData.topic_name].markQuiz(state.quizData, questionsData, answers);
        // let result = funcs[state.quizData.topic_name].markQuiz(state.quizData, questionsData, questionsData);

        let timeTaken = (state.quizData.duration * 60) - (minutes * 60 + seconds)
        let time =
        Math.floor(timeTaken / 60) +
        "." +
        (timeTaken - Math.floor(timeTaken / 60) * 60);

        const data = {
            skill_id: state.quizData.skillId,
            level: state.quizData.level,
            skill_name: state.quizData.skill_name,
            topic_name: state.quizData.topic_name,
            done_by: userId,
            score: result[1],
            questions: result[0],
            num_of_qn: state.quizData.num_of_qn,
            percent_difficulty: state.quizData.percent_difficulty,
            time_taken: time,
            isCompleted: true,
            created_at: Date.now,
        };

        if (state.assignmentId) {
            data.assignment_id = state.assignmentId;
        }

        submitQuiz(data);

        navigate("/Result", { state: { quizResult: result, questions: questionsData, operator: operator, answers: answers, skillCode: state.quizData.skill_code, percentDifficulty: state.quizData.percent_difficulty } });
        // navigate("/Result", {state: {quizResult: result, questions: questionsData, operator: operator, answers: questionsData, skillCode: state.quizData.skill_code}});
    }

    function validateFields() {
        let validateSuccess = true;
        console.log(answers);
        for (let i = 0; i < answers.length; i++) {
            if (answers[i] == undefined) {
                validateSuccess = false;
                break;
            }
            else if (answers[i].ans == "" || answers[i].ansA == "" || answers[i].ansB == "") {
                validateSuccess = false;
                break;
            }
        }


        if (validateSuccess) {
            calculateScore();
        }
        else {
            setIsModalVisible(true);
        }
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <Image style={styles.image} source={require("../../../assets/Psleonline_logo_transparent.png")} ></Image>
                    <Text style={styles.levelText}>{state.display}</Text>
                    <Text style={styles.skillName}>{state.skillName}</Text>
                    <View style={styles.progressBar}>
                        <FontAwesome5 name="stopwatch" size={24} color="black" />
                        <View style={styles.bar}>
                            <View style={[styles.currentProgress, { width: currentProgress }]}></View>
                        </View>
                    </View>
                    <Text style={styles.duration}>Remaining Time: {minutes < 10 && seconds < 10 ? "0" + minutes + ": 0" + seconds : minutes < 10 ? "0" + minutes + ":" + seconds : seconds < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds} </Text>
                    <View style={styles.questions}>
                        {state.quizData.skill_code == "ORDER_NUM" ?
                        <ScrollView nestedScrollEnabled={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                            {questionsData != undefined ? questionsData.map((question, index) => (
                                <QuizQuestion key={index} index={index} quizData={question} questionNo={index + 1} operator={operator} answers={answers} setAnswers={setAnswers} skillCode={state.quizData.skill_code} percentDifficulty={state.quizData.percent_difficulty}></QuizQuestion>
                            )) : <View></View>}
                        </ScrollView>
                        :
                        <ScrollView nestedScrollEnabled={true} horizontal={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} ref={ref => { this.scrollView = ref }} onContentSizeChange={() => this.scrollView.scrollTo({x: 280, y: 0, animated: true})}>
                            <ScrollView nestedScrollEnabled={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                                {questionsData != undefined ? questionsData.map((question, index) => (
                                    <QuizQuestion key={index} index={index} quizData={question} questionNo={index + 1} operator={operator} answers={answers} setAnswers={setAnswers} skillCode={state.quizData.skill_code} percentDifficulty={state.quizData.percent_difficulty}></QuizQuestion>
                                )) : <View></View>}
                            </ScrollView>
                        </ScrollView>
                        }
                       
                    </View>
                    <View style={styles.buttons}>
                        <View style={styles.quizButton}><QuizButton color="#AAAAAA" onClick={() => {
                            navigate("/quiz");
                        }}>Cancel</QuizButton></View>
                        <View style={styles.quizButton}><QuizButton answer={answers} color="#F7C102" onClick={() => {
                            validateFields();
                            // calculateScore();
                        }} >Submit</QuizButton></View>
                    </View>
                </View>
            </ScrollView>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="exclamation-triangle" size={25} color="red" />
                        <Text style={{ fontSize: 25, marginLeft: 10 }}>Alert!</Text>
                    </View>
                    <Text style={{ fontSize: 20, marginVertical: 10 }}>Complete the quiz!</Text>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => setIsModalVisible(false)}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 950
    },
    image: {
        alignSelf: 'center',
        width: Dimensions.get('window').width * 0.45,
        resizeMode: 'contain',
        height: Dimensions.get('window').width * 0.2
    },
    levelText: {
        fontSize: 30,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    skillName: {
        fontSize: 40,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    progressBar: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20
    },
    duration: {
        fontSize: 20,
        alignSelf: 'center'
    },
    questions: {
        backgroundColor: '#F0F0F0',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 10
        },
        elevation: 10,
        shadowRadius: 100,
        shadowOpacity: 1,
        marginHorizontal: 75,
        marginVertical: 30,
        height: 400,
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center'
    },
    quizButton: {
        paddingHorizontal: 10
    },
    modalContainer: {
        display: 'flex',
        backgroundColor: "white",
        width: '50%',
        alignSelf: 'center',
        borderRadius: 5,
        padding: 30,
    },
    modalBtn: {
        alignSelf: 'flex-end',
        backgroundColor: '#f1f4f4',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    bar: {
        backgroundColor: '#B1DBFF',
        borderRadius: 10,
        height: 15,
        width: 610,
        marginLeft: 20,
        alignSelf: 'center'
    },
    currentProgress: {
        backgroundColor: '#3DB3FF',
        borderRadius: 10,
        height: 15,
    }
});