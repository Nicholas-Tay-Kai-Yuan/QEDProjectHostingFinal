import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { List } from 'react-native-paper';
import ControlNestedTableRow from "./ControlNestedTableRow";
import { FontAwesome5 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import editTopic from "../../axios/topic-api/editTopic";
import deleteTopic from "../../axios/topic-api/deleteTopic";

export default ControlAccordion = ({topic, setUpdate}) => {

    let arrow = "chevron-right";

    const [modalVisible, setModalVisible] = useState(false);
    const [topicName, setTopicName] = useState(topic.topic_name);
    const [errorMsg, setErrorMsg] = useState();

    function updateTopic() {

        setErrorMsg();

        let data = { 'topic_name': topicName }

        editTopic(topic._id, data)
        .then(() => {
            setUpdate(prevState => prevState + 1);
        })
        .catch((response) => {
            if (response.code == "INVALID_REQUEST") {
                response.error.map((msg, index) => {
                    setErrorMsg(prevState => [prevState, <Text style={styles.errorMsg} key={index}>{msg}</Text>])
                })            
            }
        })
        .catch((response) => {
            if (response.code == "INVALID_REQUEST") {
                response.error.map((msg, index) => {
                    setErrorMsg(prevState => [prevState, <Text style={styles.errorMsg} key={index}>{msg}</Text>])
                })            
            }
        });
    }

    function removeTopic() {
        deleteTopic(topic._id)
        .then(() => {
            setUpdate(prevState => prevState + 1);
        })
    }

    return (
        <View>
            <List.Accordion
                left={props => <List.Icon {...props} icon={arrow} />}
                right={props => <Text>(Hold to edit)</Text>}
                title={topic.topic_name}
                titleStyle={styles.itemLabel}
                style={styles.listItem}
                onPress={() => {
                    arrow = arrow === "chevron-right" ?  "chevron-down" : "chevron-right"
                }}
                onLongPress={() => {
                    setModalVisible(true)
                }}>
                    
                <ControlNestedTableRow topic={topic} setUpdate={setUpdate}></ControlNestedTableRow>

            </List.Accordion>
            <Modal isVisible={modalVisible}>
                <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                    <View style={styles.modalContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.modalHeader}>Edit Topic</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <FontAwesome5 name="times" size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text style={[styles.modalHeader, {fontSize: 25}]}>Topic Name</Text>
                            <TextInput 
                                style={styles.input}
                                onChangeText={(e) => setTopicName(e)}
                                value={topicName} />
                            {errorMsg}
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity style={[styles.btn, {backgroundColor: '#fa5858'}]} onPress={() => removeTopic()}>
                                    <Text style={styles.btnText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn, {backgroundColor: '#6696ca'}]} onPress={() => updateTopic()}>
                                    <Text style={styles.btnText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    itemLabel: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'black',
    },
    listItem: {
        backgroundColor:'white',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
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
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 7,
        marginTop: 30,
        marginHorizontal: 5
    },
    btnText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center'
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
