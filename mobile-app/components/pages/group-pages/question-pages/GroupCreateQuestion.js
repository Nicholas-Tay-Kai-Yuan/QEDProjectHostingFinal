import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigate, useLocation } from "react-router-native";
import SideBar from "../../../common/side-navigations/Sidebar";
import GroupQuestionButton from "../../../group-components/question/GroupQuestionButton";
import GroupTopbar from "../../../common/group/topbar-component/GroupTopbar";
import * as ImagePicker from 'expo-image-picker';
import Topbar from "../../../common/top-navigations/Topbar"

export default GroupCreateQuestion = () => {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [imgName, setImgName] = useState("No file chosen")
    const [imageURI, setImageURI] = useState(null);

    let navigate = useNavigate();
    const { state } = useLocation();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImageURI(result.uri);

            let imgName = (result.uri).slice((result.uri).indexOf("ImagePicker/") + "ImagePicker/".length);
            setImgName(imgName);
        }
    };

    return (
        <View style={styles.container}>
            <SideBar currentPage="My Groups"></SideBar>
            <View style={styles.qnaContainer}>
                <View style={styles.topbar}>
                    <Topbar navigate={navigate} />
                </View>
                <GroupTopbar item={2} heading={"Ask a Question"} groupId={state.groupId} groupName={state.groupName} groupImg={state.groupImg}></GroupTopbar>
                <View style={styles.askQnForm}>
                    <Text style={{ fontSize: 25, marginBottom: 5 }}>Title</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setTitle(e)}
                        value={title}
                    />
                    <Text style={{ fontSize: 25, marginTop: 20, marginBottom: 5 }}>Body</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => setBody(e)}
                        value={body}
                        numberOfLines={15}
                        multiline={true}
                    />
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        <Text style={[styles.imgText, { backgroundColor: '#e9ecef', borderRightColor: 'black', borderRightWidth: 1 }]}>Choose File</Text>
                        <Text style={styles.imgText}>{imgName}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                        <GroupQuestionButton groupId={state.groupId} groupName={state.groupName} title={title} body={body} navigate={navigate} imageURI={imageURI} action="question"></GroupQuestionButton>
                        <TouchableOpacity style={styles.btn} onPress={() => navigate("/groupqna", { state: { groupId: state.groupId, groupName: state.groupName } })}>
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    askQnForm: {
        paddingVertical: 40,
        paddingHorizontal: 50,
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        textAlignVertical: 'top',
        borderRadius: 5,
        padding: 10,
        fontSize: 20,
    },
    qnaContainer: {
        flex: 1
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
    imagePicker: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 30
    },
    imgText: {
        padding: 10,
        fontSize: 20
    },
    topbar: {
        height: 60,
    },
})