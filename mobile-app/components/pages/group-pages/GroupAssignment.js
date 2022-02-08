import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button, Alert, TouchableOpacity, Modal, ScrollView, } from "react-native";
import { List } from 'react-native-paper';
import GroupTopbar from "../../common/group/topbar-component/GroupTopbar";
import SideBar from "../../common/side-navigations/Sidebar";
import { useLocation } from "react-router-native";
import NewQuizModal from "../../group-components/assignment/GroupAssignQuizModal";
import GroupAssignmentAccordian from "../../group-components/assignment/GroupAssignmentAccordion";
import getGroupAssignment from "../../../axios/group-api/getGroupAssignment";
import checkUser from "../../../axios/user-api/checkUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getOutstandingAssignment from "../../../axios/assignment-api/getOutstandingAssignment";
import Topbar from "../../common/top-navigations/Topbar"
import { useNavigate } from "react-router-native";

export default GroupAssignment = () => {
    const { state } = useLocation();
    const [modalVisible, setModalVisible] = useState(false);

    const [pendingAsg, setPendingAsg] = useState([]);
    const [overdueAsg, setOverdueAsg] = useState([]);
    const [completedAsg, setCompletedAsg] = useState([]);
    const [isAdmin, setisAdmin] = useState(false);
    const [userid, setuserid] = useState();
    const [needsUpdate, setUpdate] = useState(0);
    const [userRole, setUserRole] = useState();
    const [allAsg, setAllAsg] = useState([]);
    const navigate = useNavigate();

    const getUserData = async () => {
        const data = await AsyncStorage.getItem("userInfo");
        return JSON.parse(data)
    };

    useEffect(() => {
        getUserData()
            .then((data) => {
                setuserid(data._id)
                setUserRole(data.role)
            })
        checkUser(state.groupId)
            .then((data) => {
                if (data.group_role == "owner" || data.group_role == "admin") {
                    setisAdmin(true);
                }
                else {
                    setisAdmin(false);
                }
            })
        getGroupAssignment(state.groupId).then((res) => {

            for (let assignment of res.assignments) {

                const assignmentDeadline = new Date(assignment.deadline);

                const currentDateTime = new Date();

                if (assignment.completed_quiz === false) {
                    if (currentDateTime < assignmentDeadline)
                        setPendingAsg((prev) => [...prev, assignment]);
                    else setOverdueAsg((prev) => [...prev, assignment]);
                } else setCompletedAsg((prev) => [...prev, assignment]);

            }
        });

        getOutstandingAssignment(state.groupId).then((res) => {
            for (let assignment of res.assignments) {

                setAllAsg((prev) => [...prev, assignment]);
            }
        })

    }, [needsUpdate]);

    return (
        <View style={styles.container}>
            <SideBar currentPage="My Groups"></SideBar>
            <View style={{ flex: 1 }}>
                <View style={styles.topbar}>
                    <Topbar navigate={navigate} />
                </View>
                <GroupTopbar item={1} heading={"Group Assignments"} groupId={state.groupId} groupName={state.groupName} groupImg={state.groupImg}></GroupTopbar>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.Assignment}>
                        <NewQuizModal isAdmin={isAdmin} userId={userid} groupId={state.groupId} setUpdate={setUpdate}></NewQuizModal>
                        <List.Section>
                            <View style={styles.styledAccordian}>
                            {pendingAsg.length <= 0 && overdueAsg <= 0 && completedAsg <= 0? <Text style={{ alignSelf: 'center', fontSize: 30, paddingTop: 100,}}>No Assignments Available</Text>:
                                <List.Section style={styles.Section}>
                                    {userRole == "student" ?
                                        <View>
                                            <GroupAssignmentAccordian
                                                assignments={overdueAsg}
                                                type="Overdue"
                                                groupId={state.groupId}
                                            />
                                            <GroupAssignmentAccordian
                                                assignments={pendingAsg}
                                                type="Pending"
                                                groupId={state.groupId}
                                            />
                                            <GroupAssignmentAccordian
                                                assignments={completedAsg}
                                                type="Completed"
                                                groupId={state.groupId}
                                            />
                                        </View>
                                        :
                                        <GroupAssignmentAccordian
                                            assignments={allAsg}
                                            type=""
                                            groupId={state.groupId}
                                        />
                                    }
                                </List.Section>
                                }   
                            </View>
                        </List.Section>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        zIndex: 1
    },

    assignmentContainer: {
        flex: 1
    },
    topbar: {
        height: 60,
    },

});