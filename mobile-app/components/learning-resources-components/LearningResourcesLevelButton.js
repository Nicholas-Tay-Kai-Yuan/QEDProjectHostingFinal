import React from "react";
import { Text, View, Button, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-native";

const LearningResourcesLevelButton = (primaryText) => {
    const navigate = useNavigate();
    const commonFunc = () => {
        if (primaryText.level.includes("Primary")) {
            navigate("/LearningResourcesPrimary");
        }
        else if (primaryText.level.includes("Secondary")) {
            navigate("/LearningResourcesSecondary");
        }
    }
    return (
        <View>
            <TouchableOpacity style={styles.buttons} onPress={() => commonFunc()} >
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