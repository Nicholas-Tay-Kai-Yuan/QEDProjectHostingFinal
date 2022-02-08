import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default OverviewNotificationItem = ({ notification, navigate }) => {
    const isGroup = notification.content.slice(0, 5) === "There" ? true : false;

    return (
        <Pressable
            onPress={() =>
                isGroup
                    ? navigate("/group_leaderboard", {
                          state: { groupId: notification.group[0]._id },
                      })
                    : navigate("/quiz", {
                          state: {
                              skill: notification.skill_id,
                              assignment: notification.assignment_id,
                          },
                      })
            }
        >
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.topRow}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={
                                    isGroup
                                        ? notification.group[0]
                                            ? notification.group[0].pfp
                                                ? {
                                                      uri: notification.group[0]
                                                          .pfp,
                                                  }
                                                : require("../../assets/avatars/panda (1).png")
                                            : require("../../assets/avatars/panda (1).png")
                                        : notification.teacher[0]
                                        ? notification.teacher[0].pfp
                                            ? {
                                                  uri: notification.teacher[0]
                                                      .pfp,
                                              }
                                            : require("../../assets/avatars/panda (1).png")
                                        : require("../../assets/avatars/panda (1).png")
                                }
                            />
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameText}>
                                {isGroup
                                    ? notification.group[0]
                                        ? notification.group[0].group_name
                                        : "Deleted Group"
                                    : notification.teacher[0]
                                    ? `${notification.teacher[0].first_name} ${notification.teacher[0].last_name}`
                                    : "Deleted Teacher"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.bottomRow}>
                        <Text style={styles.notificationContent}>
                            {notification.content}
                        </Text>
                    </View>
                </View>
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="angle-right" size={30} color="white" />
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 10,
        width: "90%",
        borderRadius: 15,
        overflow: "hidden",
        elevation: 3,
        backgroundColor: "white",
        borderTopWidth: 0.1,
        borderLeftWidth: 0.1,
    },
    contentContainer: {
        flex: 12,
        paddingTop: 5,
        paddingLeft: 12,
        paddingBottom: 10,
        paddingRight: 10,
        flexDirection: "column",
    },
    topRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    imageContainer: {
        width: 40,
        height: 40,
        borderRadius: 1000,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        aspectRatio: 1,
    },
    nameContainer: {
        justifyContent: "flex-start",
        flexDirection: "row",
        marginLeft: 15,
    },
    nameText: {
        fontFamily: "Coolvetica",
        textAlignVertical: "center",
        fontSize: 22,
    },
    bottomRow: {
        flex: 1,
        flexDirection: "row",
    },
    iconContainer: {
        flex: 1,
        backgroundColor: "#bc66ca",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },
});
