import React from "react";
import { Text, StyleSheet } from "react-native";

const GroupMessageTimeStamp = ({time}) => {

    function displayTime(dt) {
        let time = new Date(dt);
        let hStr = ((time.getHours() < 10) ? "0" : "") + time.getHours();
        let mStr = ((time.getMinutes() < 10) ? "0" : "") + time.getMinutes();
    
        return hStr + ":" + mStr;
    }

    return (
        <Text style={styles.msgTime}>{displayTime(time)}</Text>
    );
};

const styles = StyleSheet.create({
    msgTime: {

    },
})

export default GroupMessageTimeStamp;