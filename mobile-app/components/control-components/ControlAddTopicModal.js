import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from "react-native";
import Modal from "react-native-modal";
import { FontAwesome5 } from "@expo/vector-icons";
import addSkill from "../../axios/topic-api/addTopic";

export default ControlAddTopicModal = ({selectedLevel, setUpdate}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [topic, setTopic] = useState("");
    const [errorMsg, setErrorMsg] = useState();

    function addNewTopic() {
        setErrorMsg();
        let data = {
            'topic_name': topic
        }

        addSkill(selectedLevel._id, data)
        .then(() => {
            setUpdate(prevState => prevState + 1)
        })
        .catch((response) => {
            if (response.code == "INVALID_REQUEST") {
                response.error.map((msg, index) => {
                    setErrorMsg(prevState => [prevState, <Text style={styles.errorMsg} key={index}>{msg}</Text>])
                })            
            }
        });
    }

    return (
        <View>
            <TouchableOpacity style={styles.addTopicBtn} onPress={() => setModalVisible(true)}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: "bold"}}>Add Topic</Text>
            </TouchableOpacity>
            <Modal isVisible={modalVisible}>
                <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                    <View style={styles.modalContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.modalHeader}>Add Topic</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <FontAwesome5 name="times" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={[styles.modalHeader, {fontSize: 25}]}>Topic Name</Text>
                            <TextInput 
                                style={styles.input}
                                onChangeText={(e) => setTopic(e)}
                                value={topic} />
                            {errorMsg}
                            <TouchableOpacity style={styles.submitBtn} onPress={() => addNewTopic()}>
                                <Text style={styles.submitBtnText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    addTopicBtn: {
        backgroundColor: '#6696ca',
        paddingVertical: 8, 
        paddingHorizontal: 30,
        alignSelf: 'center',
        borderRadius: 7,
        marginTop: 30
    },
    modalContainer: {
        backgroundColor: "white",
        alignSelf: 'center',
        borderRadius: 5,
        padding: 30,
        width: "50%",
        justifyContent: 'center',
    },
    modalHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20
    },
    submitBtn: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 7,
        backgroundColor: '#6696ca',
        marginTop: 30
    },
    submitBtnText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold'
    },
    input: {
        borderRadius: 20,
        backgroundColor: '#f3f3f3',
        padding: 7,
        width: 400,
        height: 50,
        fontSize: 20,
        textAlign: 'center'
    },
    errorMsg: {
        fontSize: 20,
        marginVertical: 20,
        fontWeight: 'bold',
        color: 'red'
    },
});
