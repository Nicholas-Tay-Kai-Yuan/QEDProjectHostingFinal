import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';

export default Headers = (headerText) => {
    return (
        <View>
            <Text style={styles.header}>{headerText.text}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        fontSize: 35,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingTop: 25
    }
})
