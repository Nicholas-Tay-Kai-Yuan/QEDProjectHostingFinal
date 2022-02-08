import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import SideBar from "../../common/side-navigations/Sidebar";
import GroupTopbar from "../../common/group/topbar-component/GroupTopbar";
import { useLocation, useNavigate } from "react-router-native";
import { FontAwesome5 } from '@expo/vector-icons';
import getGroupQuestionsById from "../../../axios/qna-api/getGroupQuestionsById";
import GroupQuestionPostItem from "../../group-components/question/GroupQuestionPostItem";
import Spinner from 'react-native-loading-spinner-overlay';
import Topbar from "../../common/top-navigations/Topbar"

export default GroupAskAQuestion = () => {
    const { state } = useLocation();

    const [isReady, setReady] = useState(true);
    const [content, setContent] = useState(
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyQnA}>There are currently no questions. Go ask one now!</Text>
            <TouchableOpacity style={styles.qnaBtn} onPress={() => createQuestion()}>
                <FontAwesome5 name="question" size={25} color='white'></FontAwesome5>
                <Text style={styles.qnaBtnText}>Ask a Question</Text>
            </TouchableOpacity>
        </View>
    )

    let navigate = useNavigate();

    function createQuestion() {
        navigate("/group_create_question", { state: { groupId: state.groupId, groupName: state.groupName } });
    }

    useEffect(() => {
        getGroupQuestionsById(state.groupId)
            .then((data) => {
                if (data.length > 0) {
                    setContent();
                    setContent(
                        <TouchableOpacity style={[styles.qnaBtn, { alignSelf: 'flex-end', marginHorizontal: 40, marginVertical: 20 }]} onPress={() => createQuestion()}>
                            <FontAwesome5 name="question" size={25} color='white'></FontAwesome5>
                            <Text style={styles.qnaBtnText}>Ask a Question</Text>
                        </TouchableOpacity>
                    );
                    for (let i = 0; i < data.length; i++) {
                        setContent(prevState => [prevState, <GroupQuestionPostItem data={data[i]} groupId={state.groupId} groupName={state.groupName}></GroupQuestionPostItem>])
                    }

                    setContent(prevState => <ScrollView style={{ marginVertical: 20 }}>{prevState}</ScrollView>)
                }
                else {

                }
            })
            .catch(() => {
                setContent(
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyQnA}>There are currently no questions. Go ask one now!</Text>
                        <TouchableOpacity style={styles.qnaBtn} onPress={() => createQuestion()}>
                            <FontAwesome5 name="question" size={25} color='white'></FontAwesome5>
                            <Text style={styles.qnaBtnText}>Ask a Question</Text>
                        </TouchableOpacity>
                    </View>
                )
            })
            .finally(() => {
                setReady(false);
            })
    }, []);

    return (
        <View style={styles.container}>
            <Spinner visible={isReady} textContent="Loading..."></Spinner>
            <SideBar currentPage="My Groups"></SideBar>
            <View style={styles.qnaContainer}>
                <View style={styles.topbar}>
                    <Topbar navigate={navigate} />
                </View>
                <GroupTopbar item={2} heading={"Ask a Question"} groupId={state.groupId} groupName={state.groupName} groupImg={state.groupImg}></GroupTopbar>
                {content}
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
        flex: 1
    },
    topbar: {
        height: 60,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyQnA: {
        fontSize: 25
    },
    qnaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3DB3FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 7,
        marginTop: 20,
    },
    qnaBtnText: {
        fontSize: 25,
        marginLeft: 10,
        color: 'white'
    },
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
        borderRadius: 7,
        marginLeft: 20
    },
    btnText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold'
    },
});