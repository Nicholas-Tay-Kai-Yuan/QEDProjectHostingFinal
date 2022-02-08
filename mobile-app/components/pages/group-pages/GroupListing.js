import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import GroupTopbar from "../../common/group/topbar-component/GroupTopbar";
import SideBar from "../../common/side-navigations/Sidebar";
import { useLocation } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getGroupsByUser from "../../../axios/group-api/getGroupsByUser";
import { FontAwesome5 } from '@expo/vector-icons'
import GroupItem from "../../group-components/group/GroupItem";
import Spinner from 'react-native-loading-spinner-overlay';
import GroupCreateModal from "../../group-components/group/GroupCreateModal";
import Topbar from "../../common/top-navigations/Topbar"
import { useNavigate } from "react-router-native";

export default GroupAssignment = () => {

    const getUserData = async () => {
        const data = await AsyncStorage.getItem("userInfo");
        return JSON.parse(data)
    };

    const [groups, setGroups] = useState(
        <View style={styles.emptyContainer}>
            <FontAwesome5 style={styles.emptyIcon} name="users" size={100} />
            <Text>You do not belong to any group</Text>
        </View>)

    const [isReady, setReady] = useState(true);
    const [modal, setModal] = useState();
    const [needsUpdate, setNeedsUpdate] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        getUserData()
            .then((data) => {
                console.log(data)
                let role = data.role;
                getGroupsByUser(data._id)
                    .then((data) => {
                        setGroups();
                        if (role == "teacher" || role == "parent") {
                            setModal(<View style={{ alignSelf: 'center' }}><GroupCreateModal setNeedsUpdate={setNeedsUpdate} setLoading={setReady}></GroupCreateModal></View>)
                        }

                        if (data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                displayGroups(data[i])
                            }
                        }
                        else {
                            setGroups(<View><Text style={styles.noGroups}>You do not belong to any group</Text></View>)
                        }
                    })
                    .finally(() => {
                        setReady(false);
                    })
            });
    }, [needsUpdate])

    function displayGroups(data) {
        let ownerPic;

        if (data.owner_pfp == undefined) {
            ownerPic = "default";
        }
        else {
            ownerPic = data.owner_pfp;
        }
        
        setGroups(prevState => [prevState, <GroupItem groupId={data._id} groupName={data.group_name} ownerName={data.owner_name} groupImg={data.pfp} ownerPic={ownerPic} latestPost={data.posts} ></GroupItem>])

    }

    return (
        <View style={styles.container}>
            <Spinner visible={isReady} textContent="Loading..."></Spinner>
            <SideBar currentPage="My Groups"></SideBar>
            <View style={styles.groupsContainer}>
                <ScrollView>
                    <Topbar navigate={navigate} />
                    <View>
                        <Text style={styles.heading}>My Groups</Text>
                        {modal}
                        {groups}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    groupsContainer: {
        flex: 1,
    },
    heading: {
        marginTop: 50,
        marginBottom: 15,
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    emptyIcon: {
        color: '#EF798A',
        textShadowColor: '#98c5ff',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 10,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 600
    },
    noGroups: {
        alignSelf: 'center',
        fontSize: 40
    }
});