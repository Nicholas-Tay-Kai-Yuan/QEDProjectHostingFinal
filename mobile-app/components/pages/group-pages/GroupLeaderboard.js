import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, ScrollView } from "react-native";
import SideBar from "../../common/side-navigations/Sidebar";
import GroupTopbar from "../../common/group/topbar-component/GroupTopbar";
import { useLocation, useNavigate } from "react-router-native";
import { Picker } from "@react-native-picker/picker";
import LeaderboardTop from "../../leaderboard-components/LeaderboardTop";
import LeaderboardTable from "../../leaderboard-components/LeaderboardTable";
import TopBar from "../../common/top-navigations/Topbar";
import getGroupLeaderboard from "../../../axios/group-api/getGroupLeaderboard";

export default GroupLeaderboard = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [leaderboard, setLeaderboard] = useState([]);
    const [type, setType] = useState(1);
    const [top3, setTop3] = useState([]);
    const [lbData, setLbData] = useState([]);

    useEffect(() => {
        getGroupLeaderboard(type, state.groupId)
            .then(({ leaderboard }) => {
                let lb = leaderboard;
                if (lb.length < 3) setLeaderboard(lb);
                else {
                    const [firstItem, secondItem] = lb;
                    lb[0] = secondItem;
                    lb[1] = firstItem;
                    setLeaderboard(lb);
                }
            })
            .catch((e) => console.log(e));
    }, [type]);

    useEffect(() => {
        if (leaderboard.length >= 3) {
            setTop3(leaderboard.slice(0, 3));
            if (leaderboard.length !== 3) {
                setLbData(leaderboard.slice(3));
            } else setLbData([]);
        } else {
            setLbData(leaderboard);
            setTop3([]);
        }
    }, [leaderboard]);

    return (
        <View style={styles.container}>
            <SideBar currentPage="My Groups"></SideBar>
            <View style={styles.rightContainer}>
                <View style={styles.topbarContainer}>
                    <TopBar navigate={navigate} />
                </View>
                <GroupTopbar
                    item={4}
                    heading={"Group Leaderboard"}
                    groupId={state.groupId}
                    groupName={state.groupName}
                    groupImg={state.groupImg}
                ></GroupTopbar>

                <ScrollView>
                    <View style={styles.leaderboardContainer}>
                        <View style={styles.topContainer}>
                            <View style={styles.headingContainer}>
                                <Image
                                    style={styles.badge}
                                    source={require("../../../assets/badge.png")}
                                />
                                <Text style={styles.leaderboardHeading}>
                                    Leaderboard
                                </Text>
                                <Image
                                    style={styles.badge}
                                    source={require("../../../assets/badge.png")}
                                />
                            </View>
                        </View>

                        {/* Top 3 Places for Leaderboard */}
                        {!top3 ? (
                            <View></View>
                        ) : (
                            <View style={styles.top3}>
                                {top3.map((lbData, index) => (
                                    <LeaderboardTop
                                        key={index}
                                        lbData={lbData}
                                        index={index}
                                        type={type}
                                    />
                                ))}
                            </View>
                        )}

                        <View style={styles.typeDropdown}>
                            <View style={styles.dropdowns}>
                                <Text style={styles.textDropdown}>Type: </Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        style={styles.picker}
                                        selectedValue={type}
                                        onValueChange={(itemValue) => {
                                            setType(itemValue);
                                        }}
                                    >
                                        <Picker.Item
                                            label="Average Score"
                                            value={1}
                                        />
                                        <Picker.Item
                                            label="Average Time Taken"
                                            value={2}
                                        />
                                        <Picker.Item
                                            label="Quizzes Attempted"
                                            value={3}
                                        />
                                    </Picker>
                                </View>
                            </View>
                        </View>
                        {lbData.length <= 0 ? (
                            <View></View>
                        ) : (
                            <LeaderboardTable
                                isLong={leaderboard.length >= 3}
                                lbData={lbData}
                                type={type}
                            />
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        zIndex: 1
    },
    rightContainer: {
        flex: 1,
    },
    topbarContainer: {
        height: 60,
        width: "100%",
        backgroundColor: "yellow",
    },
    leaderboardContainer: {
        flex: 1,
        alignItems: "flex-start",
    },
    topContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    headingContainer: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },
    leaderboardHeading: {
        fontSize: 36,
        fontFamily: "Coolvetica",
    },
    badge: {
        width: 50,
        height: 50,
    },
    buttonContainer: {
        justifyContent: "center",
        backgroundColor: "#f58c8c",
        borderRadius: 5,
        shadowOffset: { width: 0, height: -2 },
        shadowColor: "black",
        shadowOpacity: 0.25,
        elevation: 1,
        paddingTop: 5,
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 5,
        marginTop: 5,
        marginLeft: 20,
    },
    changeSchoolText: {
        fontFamily: "Coolvetica",
        color: "white",
    },
    top3: {
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 50,
        marginBottom: 20,
    },
    typeDropdown: {
        fontSize: 20,
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 25,
    },
    textDropdown: {
        fontFamily: "Poppins",
        height: 20,
    },
    dropdowns: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },
    picker: {
        width: 500,
        height: 20,
    },
    pickerContainer: {
        width: 500,
        height: 40,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "rgb(239,239,239)",
    },
});
