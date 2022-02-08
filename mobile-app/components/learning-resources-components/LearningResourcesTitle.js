import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

const LearningResourcesTitle = (titles) => {
    return (
        <View>
            <Text style={styles.primary}>{titles.title} School Levels</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    primary: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontSize: 40,
        alignSelf: 'center',
        paddingTop: 30
    }
});



export default LearningResourcesTitle;
