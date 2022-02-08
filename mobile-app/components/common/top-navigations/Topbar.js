import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import NotificationContainer from "./notifications/NotificationContainer";

export default Topbar = ({navigate}) => {
    const [pfp, setPfp] = useState("");
    const [displayNotifications, setDisplayNotifications] = useState();
    
    useEffect(async () => {
        const userInfo = await AsyncStorage.getItem("userInfo");
        setPfp(JSON.parse(userInfo).pfp);
    }, []);

    function showNotifications() {
        if (displayNotifications == undefined) {
            setDisplayNotifications(<NotificationContainer closeOverlay={setDisplayNotifications}></NotificationContainer>);
        }
        else {
            setDisplayNotifications();
        }   
    }

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>PSLE ONLINE</Text>
            </View>
            <View style={styles.rightContainer}>
                <Pressable onPress={()=>navigate("/profile")}>
                    <View style={styles.pfpImageContainer}>
                        <Image
                            source={
                                pfp
                                    ? { uri: pfp }
                                    : require("../../../assets/avatars/frog.png")
                            }
                            style={styles.pfpImage}
                        />
                    </View>
                </Pressable>
                <Pressable onPress={() => showNotifications()}>
                    <View style={styles.bellImageContainer}>
                        <Image
                            source={require("../../../assets/bell.png")}
                            style={styles.bellImage}
                        />
                    </View>
                </Pressable>
                {displayNotifications}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        height: 60,
        backgroundColor: "#b1dbff",
        zIndex: 20,
    },
    textContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    text: {
        fontFamily: "Feather",
        fontSize: 25,
        paddingLeft: 15,
    },
    rightContainer: {
        flex: 1,
        flexDirection: "row-reverse",
        alignItems: "center",
    },
    bellImageContainer: {
        height: "65%",
        marginRight: 15,
    },
    bellImage: {
        height: "100%",
        aspectRatio: 1,
    },
    pfpImageContainer: {
        height: "70%",
        borderRadius: 1000,
        overflow: "hidden",
        aspectRatio: 1,
        marginRight: 15,
    },
    pfpImage: {
        height: "100%",
    },
});
