import { LinearGradient } from "expo-linear-gradient";
import { DataTable } from "react-native-paper";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

import React from "react";

export default LeaderboardRow = ({ lbData, data, index, type, isLong }) => {
    return (
        <LinearGradient
            key={index}
            style={index === lbData.length - 1 ? styles.lastRow : {}}
            colors={["#a7bfe8", "#6190e8"]}
        >
            <DataTable.Row>
                <DataTable.Cell
                    style={{
                        ...styles.rank,
                        justifyContent: "center",
                    }}
                >
                    <Text style={styles.cellText}>{isLong ? `${index + 4}       `: `${index + 1}       `}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.name}>
                    <Text style={styles.cellText}>
                        {data.first_name + " " + data.last_name}
                    </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.school}>
                    <Text style={styles.cellText}>
                        {data.school
                            .split(" ")
                            .map(
                                (w) =>
                                    w[0].toUpperCase() +
                                    w.substr(1).toLowerCase()
                            )
                            .join(" ")}
                    </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.level}>
                    <Text style={styles.cellText}>
                        {data.grade > 6
                            ? `S${data.grade - 6}`
                            : `P${data.grade}`}
                    </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.stats}>
                    <Text style={styles.cellText}>
                        {type === 1
                            ? data.average_score
                                ? data.average_score.toFixed(0)
                                : ""
                            : type === 2
                            ? data.average_time_taken
                                ? data.average_time_taken.toFixed(2) + " min(s)"
                                : ""
                            : data.num_of_quiz}
                    </Text>
                </DataTable.Cell>
            </DataTable.Row>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    lastRow: {
        borderBottomRightRadius: 7,
        borderBottomLeftRadius: 7,
    },
    rank: {
        flex: 1,
    },
    name: {
        flex: 3,
    },
    school: {
        flex: 4,
    },
    level: {
        flex: 2,
        justifyContent: "center",
    },
    stats: {
        flex: 2,
        justifyContent: "center",
    },
    cellText: {
        fontFamily: "Feather",
        color: "white",
        fontSize: 17,
    },
});
