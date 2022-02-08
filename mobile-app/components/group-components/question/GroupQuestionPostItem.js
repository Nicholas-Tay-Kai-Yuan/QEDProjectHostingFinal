import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { List } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { useNavigate } from "react-router-native";

const GroupQuestionPostItem = ({data, groupId, groupName}) => {

    let navigate = useNavigate();

    const [profilePic, setPic] = useState(
    <Image
        style={styles.image}
        source={require("../../../assets/avatars/frog.png")}>
    </Image>
    );

    useEffect(() => {
        displayPic(data)
    }, []);
    
    function displayPic(data) {
        if (data.made_by[0].pfp == undefined) {
            setPic(
            <Image
                style={styles.image}
                source={require("../../../assets/avatars/frog.png")}>
            </Image>
            )
        }
        else {
            setPic(
            <Image
                style={styles.image}
                source={{uri: data.made_by[0].pfp}}>
            </Image>
            )
        }
    }

    function displayQuestion() {
        navigate("/group_show_question", {state: {groupId: groupId, groupName: groupName, questionData: data }})
    }

    return (
        <TouchableOpacity style={styles.postItem} onPress={() => displayQuestion()}>
            <View>
                <Text style={styles.postHeader}>{data.title}</Text>
                <View style={styles.postOwner}>
                    {profilePic}
                    <Text style={styles.postOwnerText}>{data.made_by[0].first_name + " " +data.made_by[0].last_name}</Text>
                </View>
            </View>
            <View style={{alignSelf: 'center'}}>
                <View style={styles.postCount}>
                    <Text style={{color: 'white', fontSize: 25}}>{data.answers}</Text>
                    <Text style={{color: 'white'}}>answers(s)</Text>
                </View>
            </View>
        </TouchableOpacity>  
    )
};

const styles = StyleSheet.create({
    postItem: {
        flexDirection: 'row',
        borderColor: '#C4C4C4',
        justifyContent: 'space-between',
        marginHorizontal: 40,
        borderRadius: 10,
        borderWidth: 1,
        padding: 20,
        marginVertical: 20,
        // shadowColor: 'black',
        // shadowOpacity:  0.25,
        // shadowOffset: {
        //     width: 0,
        //     height: 10
        // },
        // shadowRadius: 100,
    },
    postHeader: {
        marginBottom: 20,
        fontSize: 30
    },
    postOwner: {
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10,
        alignItems: 'center'
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 100
    },
    postOwnerText: {
        fontWeight: 'bold',
        marginLeft: 20,
        fontSize: 20
    },
    postCount: {
        backgroundColor: '#5eba7d',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 5,
    }
});

export default GroupQuestionPostItem;