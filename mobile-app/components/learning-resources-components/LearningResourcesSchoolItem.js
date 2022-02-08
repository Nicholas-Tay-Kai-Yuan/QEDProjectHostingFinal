import React from "react";
import { Text, View, Button, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import LearningResourcesPaperButton from "./LearningResourcesPaperButton";


export default LearningResourcesSchoolItem = ({imageURL}) => {
    return (
        <View style={styles.container}>
            <LinearGradient 
            colors={['#36D1DC', '#5B86E5']}>
                <Image style={styles.image} source={imageURL}></Image>     
                <LearningResourcesPaperButton text='Paper 1 '></LearningResourcesPaperButton>
                <LearningResourcesPaperButton text='Paper 2 '></LearningResourcesPaperButton>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 460,
        width: Dimensions.get('window').width * 0.2,
        backgroundColor: '#3DB3FF',
        borderRadius: 7,
        marginTop: 30
    },
    image: {
        resizeMode: 'contain',
        width: 'auto',
        height: '70%',
        backgroundColor: '#FFFFFF',
        margin: 10,
    }
    
})

