import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigate } from "react-router-native";

const HomeNavItem = () => {
    const navigate = useNavigate();
    return (
        <View style={styles.text}>
            <Text style={styles.text} onPress={() => navigate("/")}>Home</Text>
            <Text style={styles.text} onPress={() => navigate("")}>About Us</Text>
            <Text style={styles.text} onPress={() => navigate("")}>How It Works</Text>
            <Text style={styles.text} onPress={() => navigate("")}>Contact Us</Text>
            <Text style={styles.text} onPress={() => navigate("/LearningResourcesLevelPublic")}>Learning Resources</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        paddingTop: 30,
        marginHorizontal: 10,
        fontSize: 20,
        flexDirection: 'row'
    }
});

export default HomeNavItem;
