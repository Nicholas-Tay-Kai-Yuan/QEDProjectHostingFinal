import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GroupMessageTimeStamp from "./GroupMessageTimeStamp";

const GroupReceivedMessage = ({post}) => {

    return (
        <View style={styles.otherMsg}>
            <Text style={styles.msgOwner}>{post.sender_name}</Text>
            <Text style={styles.msgContent}>{post.content}</Text>
            <GroupMessageTimeStamp time={post.created_at}></GroupMessageTimeStamp>
        </View>
    );
};

const styles = StyleSheet.create({
    otherMsg: {
        padding: 10,
        backgroundColor: '#e5e5e5',
        alignSelf: 'flex-start',
        borderRadius: 12,
        borderBottomLeftRadius: 0,
        paddingRight: 50,
        marginVertical: 10
    },
    msgOwner: {
        fontWeight: 'bold'
    },
    msgContent: {
        fontSize: 20
    },
})

export default GroupReceivedMessage;