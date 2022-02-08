import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import SideBar from "../../common/side-navigations/Sidebar"
import GroupTopbar from "../../common/group/topbar-component/GroupTopbar";
import { useLocation } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import GroupMemberAccordion from "../../group-components/member/GroupMemberAccordion";
import getGroupMembers from "../../../axios/group-api/getGroupMembers";
import GroupManageModal from "../../group-components/member/GroupManageModal";
import { useNavigate } from "react-router-native";
import removeMemberFromGroup from "../../../axios/group-api/removeMemberFromGroup";
import Topbar from "../../common/top-navigations/Topbar"

export default GroupMember = () => {

    const getUserData = async () => {
        const data = await AsyncStorage.getItem("userInfo");
        return JSON.parse(data)
    };

    const { state } = useLocation();
    const [isReady, setReady] = useState(true);
    const [modal, setModal] = useState();
    const [needsUpdate, setUpdate] = useState(0);
    const [groupImg, setGroupImg] = useState(state.groupImg);
    const [leaveGroupBtn, setLeaveGroupBtn] = useState();

    let navigate = useNavigate();

    useEffect(() => {
        let ownerId;
        let groupMembers;

        getGroupMembers(state.groupId)
            .then((data) => {
                ownerId = data.owner._id;
                groupMembers = data.members;
                getUserData()
                    .then((data) => {
                        if (data._id == ownerId) {
                            setModal(<GroupManageModal groupId={state.groupId} group_name={state.groupName} setUpdate={setUpdate} groupImg={groupImg} setGroupImg={setGroupImg} navigate={navigate}></GroupManageModal>)
                        }

                        checkIfAdmin(groupMembers, data._id);
                    });
            })
    }, [needsUpdate]);

    function checkIfAdmin(membersArray, userId) {
        for (let i = 0; i < membersArray.length; i++) {
            if (membersArray[i].user_id == userId) {
                setLeaveGroupBtn(
                    <TouchableOpacity style={styles.leaveGroupBtn} onPress={() => leaveGroup(userId)}>
                        <Text style={{ fontSize: 25, color: "#f39aa7" }}>Leave Group</Text>
                    </TouchableOpacity>
                );
                if (membersArray[i].is_admin) {
                    setModal(<GroupManageModal groupId={state.groupId} group_name={state.groupName} setUpdate={setUpdate} groupImg={groupImg} setGroupImg={setGroupImg} navigate={navigate}></GroupManageModal>)
                }
            }
        }
    }

    function leaveGroup(userId) {
        removeMemberFromGroup(state.groupId, userId)
            .then(() => {
                navigate("/group_listing");
            })
    }

    return (
        <View style={styles.container}>
            <Spinner visible={isReady} textContent="Loading..."></Spinner>
            <SideBar currentPage="My Groups"></SideBar>
            <View style={styles.memberContainer}>
                <View style={styles.topbar}>
                    <Topbar navigate={navigate} />
                </View>
                <GroupTopbar item={3} heading={"Members"} groupId={state.groupId} groupName={state.groupName} groupImg={groupImg}></GroupTopbar>
                <ScrollView>
                    <View style={styles.contentContainer}>
                        <GroupMemberAccordion state={state} loading={setReady} update={needsUpdate}></GroupMemberAccordion>
                    </View>
                </ScrollView>
                {leaveGroupBtn}
                {modal}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        zIndex: 1
    },
    memberContainer: {
        flex: 1
    },
    contentContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        flex: 1,
    },
    leaveGroupBtn: {
        borderWidth: 1,
        borderColor: "#f39aa7",
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 120,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 70,
    },
    topbar: {
        height: 60,
    },
});