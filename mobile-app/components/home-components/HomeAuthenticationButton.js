import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import { useNavigate } from "react-router-native";

const HomeAuthenticationButton = () => {
    const navigate = useNavigate();
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.buttonView}>
                <Button style={styles.button} title="Sign Up" onPress={() => navigate("/SignUp")}/>
            </View>
            <View style={styles.buttonView}>
                <Button style={styles.button} title="Login" onPress={() => navigate("/Login")}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignContent: 'center',
        flexDirection: 'row',
    },
    buttonView: {
        marginHorizontal: 5,
        width: 80,
        paddingTop: 55
    },
});

export default HomeAuthenticationButton;