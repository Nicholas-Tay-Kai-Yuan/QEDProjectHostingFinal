import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, TextInput, ScrollView } from "react-native";
import { useLocation } from "react-router-native";
import getQuestionById from "../../../../axios/qna-api/getQuestionById";
import GroupTopbar from "../../../common/group/topbar-component/GroupTopbar";
import SideBar from "../../../common/side-navigations/Sidebar";
import GroupQuestionAnswer from "../../../group-components/question/GroupQuestionAnswer";
import GroupQuestionButton from "../../../group-components/question/GroupQuestionButton";
import Topbar from "../../../common/top-navigations/Topbar"
import { useNavigate } from "react-router-native";

export default GroupShowQuestion = () => {
    const {state} = useLocation();
    const [image, setImage] = useState();
    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState();
    const [update, setUpdate] = useState(0);
    const [questionImg, setQuestionImg] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setAnswer("");
        displayPic(state.questionData);
        getAnswers();
    }, [update])

    function displayPic(data) {
        if (data.made_by[0].pfp == undefined) {
            setImage(
            <Image
                style={styles.image}
                source={require("../../../../assets/avatars/frog.png")}>
            </Image>
            )
        }
        else {
            setImage(
            <Image
                style={styles.image}
                source={{uri: data.made_by[0].pfp}}>
            </Image>
            )
        }

        if (data.image != undefined) {
            setQuestionImg(
                <Image
                    style={{width: 400, height: 400, resizeMode: 'contain'}}
                    source={{uri: data.image}}>
                </Image>
            );
        }
        else {
            setQuestionImg();
        }
    }

    function getAnswers() {
        let questionId = state.questionData._id;
        getQuestionById(questionId)
        .then(( data ) => {
            if (data.answers[0].user.length > 0) {
                setAnswers(
                <View style={{marginHorizontal: 50, marginBottom: 30}}>
                    <Text style={{fontSize: 25}}>2 Answers</Text>
                </View>);
                for (let i = 0; i < data.answers.length; i++) {
                    displayAnswer(data.answers[i])
                }
            }
            
        })
    }

    function displayAnswer(data) {   
        setAnswers(prevState => [prevState, <GroupQuestionAnswer userInfo={data.user} content={data.content} likes={data.likes} questionId={state.questionData._id} answerId={data._id} update={setUpdate}></GroupQuestionAnswer>]);
    }

    return (
        <View style={styles.container}>
            <SideBar currentPage="My Groups"></SideBar>
            <View style={styles.qnaContainer}>
            <View style={styles.topbar}>
                    <Topbar navigate={navigate} />
                </View>
                <GroupTopbar item={2} heading={"Ask a Question"} groupId={state.groupId} groupName={state.groupName} groupImg={state.groupImg}></GroupTopbar>
                <ScrollView>
                    <View style={styles.questionContainer}>
                        <View>
                            <Text style={styles.title}>{state.questionData.title}</Text>
                            <Text style={styles.content}>{state.questionData.content}</Text>
                            {questionImg}
                            <Text style={styles.madeBy}>Asked by: {state.questionData.made_by[0].first_name + " " + state.questionData.made_by[0].last_name}</Text>
                        </View>
                        <View style={{alignSelf: 'flex-end'}}>
                            {image}
                        </View>
                    </View>
                    {answers}
                    <View style={{marginHorizontal: 50, marginVertical: 30}}>
                        <Text style={styles.answerLabel}>Your Answer</Text>
                        <TextInput 
                                style={styles.input}
                                onChangeText={(e) => setAnswer(e)}
                                value={answer}
                                numberOfLines={10}
                                multiline={true}
                            />              
                        <GroupQuestionButton title={state.questionData.title} body={state.questionData.content} answer={answer} questionData={state.questionData} groupId={state.groupId} groupName={state.groupName} update={setUpdate} action="answer"></GroupQuestionButton>
                    </View>
                </ScrollView>
            </View> 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        zIndex: 1
    },
    qnaContainer: {
        flex: 1,
        justifyContent: 'space-between'
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 100
    },
    title: {
        fontWeight: 'bold',
        fontSize: 40
    },
    content: {
        marginVertical: 20,
        fontSize: 20
    },
    madeBy: {
        marginTop: 30,
        fontSize: 20
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        textAlignVertical: 'top',
        borderRadius: 5,
        padding: 10,
        fontSize: 20,
        marginBottom: 30
    },
    questionContainer: {
        flexDirection: 'row', 
        margin: 50, 
        marginBottom: 20,
        borderBottomColor: '#C4C4C4', 
        borderBottomWidth: 1, 
        paddingVertical: 20, 
        justifyContent: 'space-between'
    },
    answerLabel: {
        fontSize: 25,
        marginBottom: 20
    },
    topbar: {
        height: 60,
    },
});