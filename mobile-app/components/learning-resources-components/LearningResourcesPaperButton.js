import React from "react";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';


export default LearningResourcesPaperButton = (paperText) => {
    return (
        <View>
            <TouchableOpacity style={styles.buttons}>
                <Text style={styles.buttonText}>{paperText.text}<FontAwesome5 name="download" size={20} color="black" /></Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    buttons: {
        backgroundColor: '#ABFAFF',
        margin: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    }
})

