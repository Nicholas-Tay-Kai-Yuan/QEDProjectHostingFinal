import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-native";

export default SidebarItem = ({ label, icon, isActive, directory }) => {
    const navigate = useNavigate()

    return (
        <View>
            <TouchableOpacity
                style={isActive ? styles.activeStyle : styles.inactiveStyle}
                onPress={() => navigate(directory)}
            >
                <Text style={styles.buttonText}>
                    {icon}
                    {` ${label}`}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 25,
        paddingTop: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    inactiveStyle: {
        paddingVertical: 5,
    },
    activeStyle: {
        paddingVertical: 5,
        backgroundColor: "white",
    },
});
