import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import addQuestion from "../../../axios/qna-api/postQuestion";
import addAnswer from "../../../axios/qna-api/postAnswer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigate } from "react-router-native";

export default GroupQuestionButton = ({groupId, groupName, title, body, navigate, answer, action, questionData, imageURI, update}) => {

    const getUserData = async () => {
        const data = await AsyncStorage.getItem("userInfo");
        return JSON.parse(data)
    };

    function postQuestion() {
        let date = new Date();

        getUserData()
        .then((result) => {
            let formData = new FormData();

            
            formData.append("group_id", groupId);
            formData.append("title", title);
            formData.append("content", body);
            formData.append("made_by", result._id);
            formData.append("created_at", date.toISOString());

            if (imageURI != undefined) {
                formData.append("image", {uri: imageURI, name: 'groupimg.jpg', type: 'image/jpeg'});
            }

            addQuestion(groupId, formData)
            .then(() => {
                navigate("/groupqna", {state: {groupId: groupId, groupName: groupName}})        
            });
        })
    }

    function doAction() {
        if (action == "question") {
            postQuestion();
        }
        else {
            postAnswer();
        }
    }

    function postAnswer() {
        let date = new Date();

        getUserData()
        .then((result) => {
            let data = {
                content: answer,
                made_by: result._id,
                created_at: date.toISOString(),
            }
            addAnswer(questionData._id, data)
            .then(() => {
                // navigator("/group_show_question", {state: {groupId: groupId, groupName: groupName, questionData: questionData }})
                update(prevState => prevState + 1);
            })
        })
        
       
    }

    return (
        <TouchableOpacity style={styles.btn} onPress={() => doAction()}>
            <Text style={styles.btnText}>Post</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#ffc107',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 10
        },
        elevation: 10,
        shadowRadius: 100,
        shadowOpacity: 1,
        borderRadius: 7
    },
    btnText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold'
    }
});