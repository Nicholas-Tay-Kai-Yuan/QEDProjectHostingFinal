import React, {useState, useEffect} from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableOpacity} from 'react-native-gesture-handler'
import { useNavigate } from "react-router-native";

export default NotificationItem = ({data}) => {

    let navigate = useNavigate();

    const [img, setImg] = useState();
    console.log(data)

    function getTimeDiff(time){
        const difference = new Date() - time;
        if (difference / 604600000 > 1)
            return Math.floor(difference / 604600000) + "w";
        if (difference / 86400000 > 1)
            return Math.floor(difference / 86400000) + "d";
        if (difference / 3600000 > 1) return Math.floor(difference / 3600000) + "h";
        if (difference / 60000 > 1) return Math.floor(difference / 60000) + "m";

        return Math.floor(difference / 1000) + "s";
    };

    function displayImg() {
        if (data.teacher.length != 0) {
            if (data.teacher[0].pfp != undefined) {
                setImg(
                    <Image
                        style={styles.image}
                        source={{uri: data.teacher[0].pfp}}
                    ></Image>
                )
            }
            else {
                setImg(
                    <Image
                        style={styles.image}
                        source={require("../../../../assets/avatars/frog.png")}
                    ></Image>
                )
            }
        }
        else if (data.group.length != 0) {
            if (data.group[0].pfp != undefined) {
                setImg(
                    <Image
                        style={styles.image}
                        source={{uri: data.group[0].pfp}}
                    ></Image>
                )
            }
            else {
                setImg(
                    <Image
                        style={styles.image}
                        source={require("../../../../assets/sample_groupimg.png")}
                    ></Image>
                )
            }
        }
        else {
            setImg(
                <Image
                    style={styles.image}
                    source={require("../../../../assets/avatars/cobra.png")}
                ></Image>
            )
        }
    }

    function redirect() {
        if (data.assignment_id != undefined) {
            navigate("/quiz")
            // navigate("/QuizInstruction", {state: {levels: levels, tempSkillsID: tempSkillsID, topicName: topicName}})
        }
        else if (data.group[0]._id != undefined) {
            navigate("/group_leaderboard", {state: {groupId: data.group[0]._id, groupName: data.group[0].group_name, groupImg: data.group[0].pfp}})
        }
    }

    return (
        <TouchableOpacity onLayout={() => displayImg()} style={{padding: 10, justifyContent: 'space-between', flexDirection: 'row'}} onPress={() => redirect()}>                
            <View style={{flexDirection: 'row'}}>
                {img}
                <Text style={{width: 300, textAlignVertical: 'center'}}>{data.content}</Text>
            </View>
            <View>
                <Text style={{fontWeight: 'bold'}}>{getTimeDiff(new Date(data.created_at))}</Text>
            </View>
        </TouchableOpacity>

    );
};

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10,
    }
});
