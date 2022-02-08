import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import LeaderboardRow from "./LeaderboardRow";

export default LeaderboardTable = ({ lbData, type, isLong }) => {
    return (
        <DataTable style={styles.table}>
            <LinearGradient
                style={styles.gradient}
                colors={["#009ffd", "#5762d5"]}
            >
                <DataTable.Header>
                    <DataTable.Title style={styles.rank}>
                        <Text style={styles.headerText}>Rank</Text>
                    </DataTable.Title>
                    <DataTable.Title style={styles.name}>
                        <Text style={styles.headerText}>Name</Text>
                    </DataTable.Title>
                    <DataTable.Title style={styles.school}>
                        <Text style={styles.headerText}>School</Text>
                    </DataTable.Title>
                    <DataTable.Title style={styles.level}>
                        <Text style={styles.headerText}>Level</Text>
                    </DataTable.Title>
                    <DataTable.Title style={styles.stats}>
                        <Text style={styles.headerText}>
                            {type === 1
                                ? "Avg Score"
                                : type === 2
                                ? "Avg Time Taken"
                                : "Quiz Attempted"}
                        </Text>
                    </DataTable.Title>
                </DataTable.Header>
            </LinearGradient>
            {!lbData ? (
                <View></View>
            ) : (
                lbData.map((data, index) => (
                    <LeaderboardRow key={index} isLong={isLong} lbData={lbData} data={data} index={index} type={type} />
                ))
            )}
        </DataTable>
    );
};

const styles = StyleSheet.create({
    table: {
        borderRadius: 7,
        fontSize: 20,
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 25,
        marginRight: 25,
        width: "94%",
    },
    gradient: {
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
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
    headerText: {
        fontFamily: "Feather",
        color: "white",
        fontSize: 18,
    },
    cellText: {
        fontFamily: "Feather",
        color: "white",
        fontSize: 17,
    },
});
