import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Picker, TouchableOpacityBase, TouchableOpacity } from "react-native";
import { WebView } from 'react-native-webview'
import { Title } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import getPastQuizzes from "../../../axios/quiz-api/getPastQuizzes";
import Sidebar from "../../common/side-navigations/Sidebar";
import { useLocation } from "react-router-native";

export default ViewPastQuiz = () => {

    const { state } = useLocation();
    const [answers, setAnswers] = useState();

    useEffect(() => {
        getPastQuizzes(state.quizId)
            .then((data) => {
                setAnswers(data);
            })
    }, [])

    function formatToFraction(text) {
        let x = (text).split(" ");
        let fraction = <Text style={styles.tableContentTotal}>{text}</Text>;

        if (x.length == 1) {
            if (x[0].includes('/')) {
                let y = x.toString().split('/');
                fraction = <View style={{ alignSelf: 'center' }}><Text style={styles.numerator}>{y[0]}</Text><Text style={styles.denominator}>{y[1]}</Text></View>;
            }
        }
        else if (x.length == 2) {
            let y = x[1].toString().split('/');
            fraction = <View style={{ flexDirection: 'row', alignSelf: 'center' }}><Text style={{ textAlignVertical: 'center' }}>{x[0]}</Text><View><Text style={styles.numerator}>{y[0]}</Text><Text style={styles.denominator}>{y[1]}</Text></View></View>;
        }
        else if (x.length == 3) {
            let y = x[0].toString().split('/');
            let z = x[2].toString().split('/');
            fraction =
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <View>
                        <Text style={styles.numerator}>{y[0]}</Text>
                        <Text style={styles.denominator}>{y[1]}</Text>
                    </View>
                    <Text style={styles.operator}>{x[1]}</Text>
                    <View>
                        <Text style={styles.numerator}>{z[0]}</Text>
                        <Text style={styles.denominator}>{z[1]}</Text>
                    </View>
                </View>
        }
        else if (x.length == 5) {
            let first = x[0].toString().split('/');
            let second = x[2].toString().split('/');
            let third = x[4].toString().split('/');

            fraction =
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <View>
                        <Text style={styles.numerator}>{first[0]}</Text>
                        <Text style={styles.denominator}>{first[1]}</Text>
                    </View>
                    <Text style={styles.operator}>{x[1]}</Text>
                    <View>
                        <Text style={styles.numerator}>{second[0]}</Text>
                        <Text style={styles.denominator}>{second[1]}</Text>
                    </View>
                    <Text style={styles.operator}>{x[3]}</Text>
                    <View>
                        <Text style={styles.numerator}>{third[0]}</Text>
                        <Text style={styles.denominator}>{third[1]}</Text>
                    </View>
                </View>
        }
        else if (x.length == 7) {
            if (x[2].includes("(")) {
                let first = x[0].toString().split('/');
                let second = (x[2].toString()).replace("(", "").split('/')
                let third = (x[4].toString()).replace(")", "").split('/')
                let fourth = x[6].toString().split('/');

                fraction =
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View>
                            <Text style={styles.numerator}>{first[0]}</Text>
                            <Text style={styles.denominator}>{first[1]}</Text>
                        </View>
                        <Text style={styles.operator}>{x[1]}(</Text>
                        <View>
                            <Text style={styles.numerator}>{second[0]}</Text>
                            <Text style={styles.denominator}>{second[1]}</Text>
                        </View>
                        <Text style={styles.operator}>{x[3]}</Text>
                        <View>
                            <Text style={styles.numerator}>{third[0]}</Text>
                            <Text style={styles.denominator}>{third[1]}</Text>
                        </View>
                        <Text style={styles.operator}>){x[5]}</Text>
                        <View>
                            <Text style={styles.numerator}>{fourth[0]}</Text>
                            <Text style={styles.denominator}>{fourth[1]}</Text>
                        </View>
                    </View>
            }
            else {
                let first = x[0].toString().split('/');
                let second = x[2].toString().split('/')
                let third = x[4].toString().split('/')
                let fourth = x[6].toString().split('/');

                fraction =
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View>
                            <Text style={styles.numerator}>{first[0]}</Text>
                            <Text style={styles.denominator}>{first[1]}</Text>
                        </View>
                        <Text style={styles.operator}>{x[1]}</Text>
                        <View>
                            <Text style={styles.numerator}>{second[0]}</Text>
                            <Text style={styles.denominator}>{second[1]}</Text>
                        </View>
                        <Text style={styles.operator}>{x[3]}</Text>
                        <View>
                            <Text style={styles.numerator}>{third[0]}</Text>
                            <Text style={styles.denominator}>{third[1]}</Text>
                        </View>
                        <Text style={styles.operator}>{x[5]}</Text>
                        <View>
                            <Text style={styles.numerator}>{fourth[0]}</Text>
                            <Text style={styles.denominator}>{fourth[1]}</Text>
                        </View>
                    </View>

            }
        }

        return fraction
    }

    function formatRational(text) {
        let rational = <Text style={styles.tableContentTotal}>{text}</Text>
        let data = text.toString().split("?");
        let optionArray;
        // Rational Number

        // question
        if (data.length == 2) {
            optionArray = data[1];
        }

        //answer
        else {
            optionArray = data[0];
        }

        let optionsString = [];
        let options = (optionArray.toString()).replace("<br/>", "");
        if (data.length == 2) {
            options = options.substring(1, options.length - 1)
        }
        let optionsArray = options.toString().split(",");
        for (let i = 0; i < optionsArray.length; i++) {

            // squareroot || cuberoot || fraction
            if (optionsArray[i].includes("<")) {

                // cuberoot
                if (optionsArray[i].includes("&#8731")) {
                    let value = optionsArray[i].replace("&#8731;<span style=\"text-decoration: overline\">", "")
                    value = value.replace("</span>", "");
                    optionsString.push(<View style={{ flexDirection: 'row' }}><Text>∛</Text><View style={{ borderTopWidth: 1, borderTopColor: 'black' }}><Text>{value}</Text></View></View>);
                }
                // squareroot
                else if (optionsArray[i].includes("&radic")) {
                    let value = optionsArray[i].replace("&radic;<span style=\"text-decoration: overline\">", "")
                    value = value.replace("</span>", "");
                    optionsString.push(<View style={{ flexDirection: 'row' }}><Text>√</Text><View style={{ borderTopWidth: 1, borderTopColor: 'black' }}><Text>{value}</Text></View></View>);
                }
                // fraction
                else {
                    let fraction = optionsArray[i].toString().split("&frasl;")
                    let numerator = fraction[0];
                    let denominator = fraction[1];

                    numerator = numerator.replace("<sup>", "");
                    numerator = numerator.replace("</sup>", "");

                    if (denominator != undefined) {
                        denominator = denominator.replace("<sub>", "");
                        denominator = denominator.replace("</sub>", "");
                    }

                    optionsString.push(<View><Text style={styles.numerator}>{numerator}</Text><Text style={styles.denominator}>{denominator}</Text></View>);
                }
            }
            // π or number
            else {
                optionsString.push(<Text>{optionsArray[i]}</Text>);
            }

            if (i != optionsArray.length - 1) {
                optionsString.push(<Text>,</Text>);
            }

        }

        if (data.length == 2) {
            rational = <View style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ textAlign: 'center' }}>{data[0]}?</Text><View style={{ flexDirection: 'row', alignItems: 'center' }}><Text>{'{'}</Text>{optionsString}<Text>{'}'}</Text></View></View>;
        }
        else {
            rational = <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>{optionsString}</View>;
        }

        return rational;
    }

    function formatOrdering(solution) {

        let optionsString = [];
        let optionsArray = solution.toString().split(",");

        for (let i = 0; i < optionsArray.length; i++) {

            // squareroot || cuberoot || fraction
            if (optionsArray[i].includes("<")) {

                // cuberoot
                if (optionsArray[i].includes("&#8731") || optionsArray[i].includes("∛")) {
                    let value;
                    if (optionsArray[i].includes("&#8731")) {
                        value = optionsArray[i].replace("&#8731;<span style=\"text-decoration: overline\">", "")
                    }
                    else {
                        value = optionsArray[i].replace("∛<span style=\"text-decoration: overline\">", "")
                    }
                    value = value.replace("</span>", "");
                    optionsString.push(<View style={{ flexDirection: 'row', alignSelf: 'center' }}><Text style={{ fontSize: 20 }}>∛</Text><View style={{ borderTopWidth: 1, borderTopColor: 'black' }}><Text style={{ fontSize: 20 }}>{value}</Text></View></View>);
                }
                // squareroot
                else if (optionsArray[i].includes("&radic") || optionsArray[i].includes("√")) {
                    let value;
                    if (optionsArray[i].includes("&radic")) {
                        value = optionsArray[i].replace("&radic;<span style=\"text-decoration: overline\">", "")
                    }
                    else {
                        value = optionsArray[i].replace("√<span style=\"text-decoration: overline\">", "")
                    }
                    value = value.replace("</span>", "");
                    optionsString.push(<View style={{ flexDirection: 'row', alignSelf: 'center' }}><Text style={{ fontSize: 20 }}>√</Text><View style={{ borderTopWidth: 1, borderTopColor: 'black' }}><Text style={{ fontSize: 20 }}>{value}</Text></View></View>);
                }
                // fraction
                else {
                    let fraction;
                    let numerator;
                    let denominator
                    if(optionsArray[i].toString().includes("&frasl;")) {
                        fraction = optionsArray[i].toString().split("&frasl;")
                        numerator = fraction[0];
                        denominator = fraction[1];

                        numerator = numerator.replace("<sup>", "");
                        numerator = numerator.replace("</sup>", "");

                        if (denominator != undefined) {
                            denominator = denominator.replace("<sub>", "");
                            denominator = denominator.replace("</sub>", "");
                        }
                    }
                    else {
                        fraction = optionsArray[i].toString().split(">⁄<");
                        numerator = fraction[0];
                        denominator = fraction[1];

                        numerator = numerator.replace("<sup>", "");
                        numerator = numerator.replace("</sup", "");

                        if (denominator != undefined) {
                            denominator = denominator.replace("sub>", "");
                            denominator = denominator.replace("</sub>", "");
                        }
                        
                    }               

                    optionsString.push(<View><Text style={[styles.numerator, { fontSize: 20 }]}>{numerator}</Text><Text style={[styles.denominator, { fontSize: 20 }]}>{denominator}</Text></View>);
                }
            }
            // π or number
            else {
                optionsString.push(<Text style={{ fontSize: 20, textAlignVertical: 'center' }}>{optionsArray[i]}</Text>);
            }

            if (i != optionsArray.length - 1) {
                optionsString.push(<Text style={{ fontSize: 20, marginRight: 10, textAlignVertical: 'center' }}>,</Text>);
            }

        }

        optionsString = [
        <View style={{ flexDirection: 'row' }}>
            {optionsString}
        </View>]

        return optionsString;
    }

    return (
        <View style={styles.container}>
            <Sidebar />
            <ScrollView>
                <View style={[styles.tableHeaderTotal, { paddingVertical: 10 }]}>
                    <View style={styles.tableHeader}><Text style={styles.tableHeaderText}>No.</Text></View>
                    <View style={styles.tableHeader}><Text style={styles.tableHeaderText}>Question</Text></View>
                    <View style={styles.tableHeader}><Text style={styles.tableHeaderText}>Attempted Ans</Text></View>
                    <View style={styles.tableHeader}><Text style={styles.tableHeaderText}>Answer</Text></View>
                    <View style={styles.tableHeader}><Text style={styles.tableHeaderText}></Text></View>
                </View>

                {answers != undefined ?
                    answers.questions.map((questions, index) => (
                        <View style={styles.tableHeaderTotal}>
                            <View style={styles.tableContent}><Text style={styles.tableContentText}>{index + 1}</Text></View>
                            <View style={styles.tableContent}>{answers.topic_name == "Fractions" ? formatToFraction(questions.question) : answers.topic_name == "Real Numbers" ? formatRational(questions.question) : answers.topic_name == "Ordering Numbers" ? formatOrdering(questions.question) : <Text style={styles.tableContentTotal}>{questions.question}</Text>}</View>
                            <View style={styles.tableContent}>{answers.topic_name == "Fractions" ? formatToFraction(questions.answer) : answers.topic_name == "Real Numbers" ? formatRational(questions.answer) : answers.topic_name == "Ordering Numbers" ? formatOrdering(questions.answer) : <Text style={styles.tableContentTotal}>{questions.answer}</Text>}</View>
                            <View style={styles.tableContent}>{answers.topic_name == "Fractions" ? formatToFraction(questions.correct_answer) : answers.topic_name == "Real Numbers" ? formatRational(questions.correct_answer) : answers.topic_name == "Ordering Numbers" ? formatOrdering(questions.correct_answer) : <Text style={styles.tableContentTotal}>{questions.correct_answer}</Text>}</View>
                            <View style={[styles.tableContent, { alignItems: 'center' }]}><FontAwesome5 name={questions.isCorrect ? "check-circle" : "times-circle"} size={24} color={questions.isCorrect ? 'green' : 'red'} /></View>
                        </View>
                    ))
                    : <View></View>}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row'
    },
    tableHeader: {
        flex: 1,
    },

    tableHeaderText: {
        fontWeight: 'bold',
        fontSize: 20,

        textAlign: 'center',
    },

    tableContent: {
        flex: 1,
        alignSelf: 'center',
        marginVertical: 15,
    },

    tableContentText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20
    },

    tableContentTotal: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20
    },

    tableHeaderTotal: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },

    denominator: {
        textAlign: 'center',
    },

    numerator: {
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },

    operator: {
        textAlignVertical: 'center',
        marginHorizontal: 10
    }

})