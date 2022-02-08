import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GroupMessageTimeStamp from "./GroupMessageTimeStamp";

const GroupSentMessage = ({post}) => {

    return (
        <View style={styles.ownMsg}>
            <Text style={styles.msgOwner}>Me</Text>
            <Text style={styles.msgContent}>{post.content}</Text>
            <GroupMessageTimeStamp time={post.created_at}></GroupMessageTimeStamp>
        </View>
    );
};

const styles = StyleSheet.create({
    ownMsg: {
        padding: 10,
        backgroundColor: '#e1f1ff',
        alignSelf: 'flex-end',
        borderRadius: 12,
        borderBottomRightRadius: 0,
        paddingRight: 50,
        marginVertical: 10,
        marginRight: 40
    },
    msgOwner: {
        fontWeight: 'bold'
    },
    msgContent: {
        fontSize: 20
    },
    modalContainer: {
        display: 'flex',
        backgroundColor: "white",
        width: '50%',
        alignSelf:'center',
        borderRadius: 5,
    },
    modalButton: {
        padding: 15
    },
    btnText: {
        fontSize: 20
    }
})

export default GroupSentMessage;