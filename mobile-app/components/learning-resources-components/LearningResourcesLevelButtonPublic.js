import React from "react";
import { Text, View, Button, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-native";

const LearningResourcesLevelButton = (primaryText) => {
    const navigate = useNavigate();
    return (
        <View style={{elevation: 1}}>
            <TouchableOpacity style={styles.buttons} onPress={() =>navigate("../LearningResourcesPublic")} >
                <Text style={styles.buttonText}>{primaryText.level}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttons: {
        borderRadius: 12,
        backgroundColor: '#3DB3FF',
        width: Dimensions.get('window').width * 0.2,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
    },
    buttonText: {
        fontSize: 30,
        color: '#FFFFFF',
        fontWeight: 'bold'
    }
})

export default LearningResourcesLevelButton;