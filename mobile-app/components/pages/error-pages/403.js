import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigate } from "react-router-native";

export default Error403 = () => {
    const navigate = useNavigate();

    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>403 ERROR</Text>
            <Text style={styles.errorDesc}>
                You are not authorized to view this page
            </Text>
            <Text onPress={() => navigate("/")} style={styles.returnText}>
                Back to Safety
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 50,
        fontWeight: "600",
        textAlign: "center",
    },
    errorDesc: {
        fontSize: 20,
        textAlign: "center",
    },
    returnText: {
        fontSize: 20,
        textDecorationColor: "#0d6efd",
        textDecorationLine: "underline",
        color: "#0d6efd",
        textAlign: "center",
    },
});
