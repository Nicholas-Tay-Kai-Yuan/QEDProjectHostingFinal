import React, { useEffect, useState } from "react";
import { List } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import AssignmentBox from "./AssignmentItem";

const AssignmentAccordian = ({ assignments = [], type }) => {
    const [arrow, setArrow] = useState("chevron-right");

    return (
        <List.Accordion
            style={styles.List}
            title={`${type} Assignment (${assignments.length})`}
            titleStyle={styles.Title}
            onPress={() =>
                setArrow((prev) =>
                    prev === "chevron-right" ? "chevron-down" : "chevron-right"
                )
            }
            left={(props) => <List.Icon {...props} icon={arrow} />}
            right={() => <Text></Text>}
        >
            {assignments.map((assignment, index) => (
                <AssignmentBox
                    key={index}
                    post={assignment}
                    assignmentStatus={type}
                />
            ))}
        </List.Accordion>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    Test: {
        marginTop: 50,
        marginBottom: 15,
        alignItems: "center",
    },
    List: {
        backgroundColor: "white",
    },
    Section: {
        marginHorizontal: 50,
    },

    Title: {
        color: "black",
    },
});

export default AssignmentAccordian;
