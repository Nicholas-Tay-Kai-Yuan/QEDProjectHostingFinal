import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigate } from "react-router-native";

const GroupItem = ({groupId, groupName, ownerName, groupImg, ownerPic, latestPost}) => {

    const navigate = useNavigate()
    
    const [image, setImage] = useState();
    const [profile, setProfile] = useState();
    const [postOwner, setPostOwner] = useState();
    const [postContent, setPostContent] = useState();

    function displayPic(groupImg, ownerPic) {
        if (groupImg == undefined) {
            setImage(
            <Image
                style={styles.groupImg}
                source={require("../../../assets/sample_groupimg.png")}>
            </Image>
            )
        }
        else {
            setImage(
            <Image
                style={styles.groupImg}
                source={{uri: groupImg}}>
            </Image>
            )
        }

        if (ownerPic == "default") {
            setProfile(
                <Image
                    style={styles.ownerImg}
                    source={require("../../../assets/avatars/frog.png")}>
                </Image>
            )
        }
        else {
            setProfile(
                <Image
                    style={styles.ownerImg}
                    source={{uri: ownerPic}}>
                </Image>
            )
        }

        if (latestPost.pfp[0] == undefined) {
            setPostOwner(
                <Image
                    style={styles.postOwnerImg}
                    source={require("../../../assets/avatars/frog.png")}>
                </Image>
            )
        }
        else {
            setPostOwner(
                <Image
                    style={styles.postOwnerImg}
                    source={{uri: latestPost.pfp[0]}}>
                </Image>
            )
        }

        if (latestPost.content == undefined) {
            setPostContent("No Messages")
        }
        else {
            setPostContent(latestPost.content)
        }
    }

    return (
        <TouchableOpacity style={styles.groupContainer} onLayout={() => displayPic(groupImg, ownerPic)} onPress={() => navigate("/group_announcement", {state: {groupId: groupId, groupName: groupName, groupImg: groupImg}})}>
            <View style={{flexDirection: 'row', paddingBottom: 10}}>
                <View style={{ alignSelf: 'center'}}> 
                {image}
                </View>
                <View style={{marginLeft: 20, justifyContent: 'center'}}>
                    <View>
                        <Text style={{fontSize: 20}}>{groupName}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
                        {postOwner}
                        <Text style={{fontSize: 20}}>   {postContent}</Text>
                    </View>
                </View>
            </View>
            <View style={{paddingTop: 10, borderTopColor: 'black', borderTopWidth: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{textAlignVertical:'center', fontSize: 18}}>Owner: </Text>
                {profile}
                <Text style={{fontSize: 18}}>  {ownerName}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    groupContainer: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 10,
        padding: 15,
        marginVertical: 20,
        alignSelf: 'center'
    },
    groupImg: {
        width: 100,
        height: 100,
        borderRadius: 100
    },
    ownerImg: {
        width: 40,
        height: 40,
        borderRadius: 40
    },
    postOwnerImg: {
        width: 35,
        height: 35,
        borderRadius: 35
    }
})

export default GroupItem;