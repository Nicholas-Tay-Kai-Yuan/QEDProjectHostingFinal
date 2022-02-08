import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default ControlLevelButton = ({levels, setPage, selectLevel}) => {

    return (
        <View>
            <TouchableOpacity style={(levels.level > 6) ? styles.secondaryBtnColor : styles.primaryBtnColor} onPress={() => {selectLevel(levels), setPage("Topics")}}>
                <Text style={styles.btnText}>{levels.level > 6 ? "Secondary " + (levels.level - 6) : "Primary " +levels.level}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    btnText: {
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 20
    },

    secondaryBtnColor : {
        backgroundColor: '#3db3ff',
        padding: 10, 
        borderRadius: 7, 
        margin: 7
    },

    primaryBtnColor : {
        backgroundColor: '#bc66ca',
        padding: 10, 
        borderRadius: 7, 
        margin: 7
    }
});
