import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import SideBar from "../../common/side-navigations/Sidebar";
import AssignmentAccordian from "../../assignment-components/AssignmentAccordion";
import NewQuizModal from "../../group-components/assignment/GroupAssignQuizModal";
import { List } from "react-native-paper";
import getAssignment from "../../../axios/assignment-api/getAssignment";
import Topbar from "../../common/top-navigations/Topbar"
import { useNavigate } from "react-router-native";

export default Assignment = () => {
    const [pendingAsg, setPendingAsg] = useState([]);
    const [overdueAsg, setOverdueAsg] = useState([]);
    const [completedAsg, setCompletedAsg] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAssignment().then((res) => {
            for (let assignment of res) {
                const assignmentDeadline = new Date(assignment.deadline);
                const currentDateTime = new Date();

                if (assignment.completed_quiz === false) {
                    if (currentDateTime < assignmentDeadline)
                        setPendingAsg((prev) => [...prev, assignment]);
                    else setOverdueAsg((prev) => [...prev, assignment]);
                } else setCompletedAsg((prev) => [...prev, assignment]);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <SideBar currentPage="Assignment"></SideBar>
            <ScrollView style={styles.scrollView}>
                <Topbar navigate={navigate} />
                <View style={styles.Assignment}>
                    <View>
                        <Text style={styles.heading}>My Assignments</Text>
                    </View>

                    {pendingAsg.length <= 0 && overdueAsg <= 0 && completedAsg <= 0? <Text style={{ alignSelf: 'center', fontSize: 30, paddingTop: 100,}}>No Assignments Available</Text>:
                    <List.Section>
                        <View style={styles.styledAccordian}>
                            <List.Section style={styles.Section}>
                                <AssignmentAccordian
                                    assignments={overdueAsg}
                                    type="Overdue"
                                />
                                <AssignmentAccordian
                                    assignments={pendingAsg}
                                    type="Pending"
                                />
                                <AssignmentAccordian
                                    assignments={completedAsg}
                                    type="Completed"
                                />
                            </List.Section>
                        </View>
                    </List.Section>         
                } 
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },

    heading: {
        marginTop: 50,
        textAlign: "center",
        marginBottom: 15,
        fontSize: 36,
        fontWeight: "500",
        fontFamily: "Coolvetica",
    },

    Assignment: {
        flex: 1,
    },

    // AssignmentBox: {
    //     flex: 2,
    //     backgroundColor: "beige",
    //     borderWidth: 5,
    //     width: 100,
    //     height: 50,
    //     backgroundColor: 'powderblue'
    // },

    styledAccordian: {
        flex: 1,
        marginTop: 100,
    },

    Section: {
        marginHorizontal: 50,
    },
});
