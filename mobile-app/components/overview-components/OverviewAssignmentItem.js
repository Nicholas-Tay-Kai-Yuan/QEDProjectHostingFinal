import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import getLevel from "../../axios/level-api/getLevel";

const displayDate = (dt) => {
    const date = new Date(dt);
    const tempAry = date.toDateString().split(" ");
    return `${tempAry[2]} ${tempAry[1]} ${tempAry[3]} ${tempAry[0]}`;
};


export default OverviewAssignmentItem = ({ assignment, navigate }) => {

    const [levels, setLevels] = useState([]);

    useEffect(() => {
        getLevel()
          .then((data) => {
            setLevels(data);
          })
      }, []);

    return (
        <Pressable
            onPress={() => {
                navigate(
                    "/QuizInstruction",
                    {
                        state: {
                            levels: levels,
                            tempSkillsID: assignment.skill_id,
                            topicName: assignment.skill_name, 
                            assignmentId: assignment._id
                        },
                    }
                );
            }}
        >
            <View style={styles.cardContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.topRow}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={
                                    assignment.pfp
                                        ? { uri: assignment.pfp }
                                        : require("../../assets/avatars/cat.png")
                                }
                            />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>
                                {assignment.title}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.bottomRow}>
                        <View style={styles.topicLabelContainer}>
                            <Text style={styles.topicLabelText}>
                                {assignment.skill_name}
                            </Text>
                        </View>
                        <View style={styles.dateLabelContainer}>
                            <Text style={styles.dateLabelText}>
                                <MaterialCommunityIcons
                                    size={15}
                                    style={styles.dateIcon}
                                    name="clock"
                                />
                                {" " + displayDate(assignment.deadline)}
                            </Text>
                        </View>
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
    cardContainer: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: "white",
        marginBottom: 20,
        borderRadius: 10,
        overflow: "hidden",
        height: 110,
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
        flex: 2,
        marginBottom: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    bottomRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    topicLabelContainer: {
        backgroundColor: "#ffc83c",
        borderRadius: 1000,
        overflow: "hidden",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        justifyContent: "center",
    },
    topicLabelText: {
        color: "white",
        fontFamily: "Coolvetica",
        fontSize: 15,
        textAlignVertical: "center",
    },
    dateLabelContainer: {
        backgroundColor: "#7b61ff",
        borderRadius: 1000,
        overflow: "hidden",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        justifyContent: "center",
        flexDirection: "row",
    },
    dateLabelText: {
        color: "white",
        fontFamily: "Coolvetica",
        fontSize: 15,
        textAlignVertical: "center",
    },
    iconContainer: {
        flex: 1,
        backgroundColor: "#6696ca",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
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
    titleContainer: {
        justifyContent: "flex-start",
        flexDirection: "row",
        marginLeft: 15,
    },
    titleText: {
        fontFamily: "Coolvetica",
        textAlignVertical: "center",
        fontSize: 22,
    },
});
