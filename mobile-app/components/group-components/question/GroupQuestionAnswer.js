import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; 
import getQuestionById from "../../../axios/qna-api/getQuestionById";
import AsyncStorage from "@react-native-async-storage/async-storage";
import likeAnswer from "../../../axios/qna-api/likeAnswer";
import unlikeAnswer from "../../../axios/qna-api/unlikeAnswer";

export default GroupQuestionAnswer = ({userInfo, content, likes, questionId, answerId, update}) => {
    
    const [image, setImage] = useState();
    const [iconColor, setIconColor] = useState("grey");
    const [likeCount, setLikeCount] = useState(0);

    const getUserData = async () => {
        const data = await AsyncStorage.getItem("userInfo");
        return JSON.parse(data)
    };

    function displayImage(data) {
        if (data == undefined) {
            setImage(
            <Image
                style={styles.image}
                source={require("../../../assets/avatars/frog.png")}>
            </Image>
            )
        }
        else {
            setImage(
            <Image
                style={styles.image}
                source={{uri: data}}>
            </Image>
            )
        }
    }

    function toggleLikeBtn() {
        let date = new Date();

        getUserData()
        .then((result) => {
            let data = {
                member_id: result._id,
                question_id: questionId,
                created_at: date.toISOString()
            }
            
            if (iconColor == "grey") {    
                let data = {
                    member_id: result._id,
                    question_id: questionId,
                    created_at: date.toISOString()
                }     
                likeAnswer(answerId, data)
                .then(() => {
                    update(prevState => prevState + 1);
                })
            }
            else {
                unlikeAnswer(answerId, data)
                .then(() => {
                    update(prevState => prevState + 1);
                });
            }
        })

    }

    function displayLike(data) {
        if (data.length > 0) {
            setLikeCount(data.length)

            getUserData()
            .then((result) => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].member_id == result._id) {
                        setIconColor("red");
                        break;
                    }
                    else {
                        setIconColor("grey");
                    }
                }
            });
            
        }
        else {
            setIconColor("grey");
            setLikeCount(0);
        }
    }

    return (
        <View style={styles.container} onLayout={() => {displayLike(likes), displayImage(userInfo[0].pfp)}}>
            <View style={{alignItems: 'center', marginRight: 20}}>
                <FontAwesome color={iconColor} name="heart" size={35} onPress={() => toggleLikeBtn()}></FontAwesome>
                <Text>{likeCount}</Text>
            </View>
            <View style={{justifyContent: 'space-between', flexDirection: 'row', flex: 1}}>
                <View>
                    <Text style={styles.content}>{content}</Text>
                    <Text style={styles.answerOwner}>Answered by: {userInfo[0].first_name + " " + userInfo[0].last_name}</Text>  
                </View>
                <View style={{alignSelf: 'flex-end'}}>
                    {image}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 50,
        flexDirection: 'row',
        flex: 1,
        marginTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#C4C4C4',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 100,
    },
    content: {
        fontSize: 20,
        margin: 0,
        padding: 0,
        marginBottom: 100,
    },
    answerOwner: {
        fontSize: 20
    }
});