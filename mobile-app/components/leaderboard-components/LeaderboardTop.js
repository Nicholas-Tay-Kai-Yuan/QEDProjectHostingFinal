import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


// Gradient colors
const colors = [
    ["#8e9eab", "#eef2f3"],
    ["#b78628", "#ffd667", "#fcc201"],
    ["#6d6027", "#d3cbb8"],
];

export default LeaderboardTop = ({ lbData, index, type }) => {
    return (
        <LinearGradient
            key={index}
            style={
                index === 1
                    ? { ...styles.topRank }
                    : {
                          ...styles.topRank,
                          ...styles.lowerDiv,
                      }
            }
            colors={colors[index]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            
            <Text style={styles.topRankNum}>
                {index === 0 ? "2" : index === 1 ? "1" : "3"}
                {index === 0 ? "nd" : index === 1 ? "st" : "rd"}
            </Text>
            <Image
                style={styles.pfp}
                source={
                    lbData.pfp
                        ? { uri: lbData.pfp }
                        : require("../../assets/avatars/elephant.png")
                }
            />
            <Text style={styles.topName}>
                {lbData.first_name + " " + lbData.last_name}
            </Text>
            <Text style={styles.topSchool}>
                {lbData.grade > 6
                    ? `Secondary ${lbData.grade}`
                    : `Primary ${lbData.grade}`}
            </Text>
            <Text style={styles.topGrade}>
                {lbData.school
                    .split(" ")
                    .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
                    .join(" ")}
            </Text>
            <View style={styles.stats}>
                <Text style={styles.topAvgScoreHeader}>
                    {type === 1
                        ? "Avg Score"
                        : type === 2
                        ? "Avg Time Taken"
                        : "Quiz Attempted"}
                </Text>
                <Text style={styles.topAvgScore}>
                    {type === 1
                        ? lbData.average_score
                            ? lbData.average_score.toFixed(0).trim()
                            : ""
                        : type === 2
                        ? lbData.average_time_taken
                            ? `${lbData.average_time_taken.toFixed(
                                  2
                              )} min(s)`.trim()
                            : ""
                        : lbData.num_of_quiz
                        ? `${lbData.num_of_quiz}`.trim()
                        : ""}
                </Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    topRank: {
        marginLeft: 20,
        marginRight: 20,
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
        width: "25%",
        height: 350,
        borderRadius: 20,
    },
    topRankNum: {
        fontSize: 16,
        fontWeight: "300",
        color: "white",
    },
    pfp: {
        height: 50,
        width: 50,
        borderRadius: 1000,
        margin: "auto",
        aspectRatio: 1,
    },
    topName: {
        color: "white",
        fontFamily: "Feather",
        fontSize: 14,
        paddingTop: 15,
        paddingBottom: 15,
    },
    topGrade: {
        fontSize: 13,
        fontFamily: "Poppins",
        color: "white",
    },
    topSchool: {
        fontSize: 13,
        fontFamily: "Poppins",
        color: "white",
    },
    topAvgScoreHeader: {
        fontSize: 13,
        fontFamily: "Poppins",
        color: "white",
        alignSelf: "center",
    },
    stats: {
        marginTop: 15,
    },
    topAvgScore: {
        fontFamily: "Feather",
        padding: 6,
        width: "33%",
        fontSize: 30,
        color: "white",
        alignSelf: "center",
    },
    lowerDiv: {
        marginTop: 40,
    },
});
