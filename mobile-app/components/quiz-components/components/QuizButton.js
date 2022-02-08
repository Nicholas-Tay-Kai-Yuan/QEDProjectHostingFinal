import React, {useState} from "react";
import { Text, View, Button, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-native";

export default QuizButton = ({text, color, topicName, levels, quizData, display, skillName, duration, answer, onClick, children}) => {
    // const navigate = useNavigate();
    // const [color, setColor] = useState();

    // function navigatePage() {
    //     if (text.includes("Begin Quiz")) {
    //         navigate("/DoQuiz", {state: {topicName: topicName, levels: levels, quizData: quizData, display: display, skillName: skillName, duration: duration}});
    //     }
    //     else if (text.includes("Cancel")) {
    //         console.log("Cancelled");
    //         navigate("/Overview");
    //     }
    //     else if (text.includes("Submit")) {
    //         console.log("Submitted");
    //         console.log(answer)
    //         // navigate("/Result");
    //     }

    // }
    return (
        <View>
            <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={onClick}>
                <Text style={styles.buttonText}>{children}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: Dimensions.get('window').width * 0.1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF'
    }
})