import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

export default OverviewButton = ({ text, color, onPress = () => {} }) => {
    return (
        <TouchableHighlight
            onPress={onPress}
            style={{ ...styles.button, backgroundColor: color }}
        >
            <Text style={styles.text}>{text}</Text>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    button: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    text: {
        fontFamily: "Poppins",
        textAlign: "center",
        color: "white",
        width: "100%",
        fontWeight: "600",
        fontSize: 18,
    },
});
