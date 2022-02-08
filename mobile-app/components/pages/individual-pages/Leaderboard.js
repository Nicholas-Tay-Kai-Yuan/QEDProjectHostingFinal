import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, ScrollView } from "react-native";
import SideBar from "../../common/side-navigations/Sidebar";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native-gesture-handler";
import getLeaderboard from "../../../axios/quiz-api/getLeaderboard";
import { Picker } from "@react-native-picker/picker";
import LeaderboardTop from "../../leaderboard-components/LeaderboardTop";
import LeaderboardTable from "../../leaderboard-components/LeaderboardTable";
import Topbar from "../../common/top-navigations/Topbar"
import { useNavigate } from "react-router-native";

export default Leaderboard = () => {
    const [school, setSchool] = useState("Secondary");
    const [leaderboard, setLeaderboard] = useState([]);
    const [type, setType] = useState(1);
    const [scope, setScope] = useState(1);
    const [level, setLevel] = useState("Primary");
    const navigate = useNavigate();
    const [top3, setTop3] = useState([]);
    const [lbData, setLbData] = useState([]);

    useEffect(() => {
        getLeaderboard(level, type, scope)
            .then((res) => {
                let lb = res;
                if (lb.length < 3) setLeaderboard(lb);
                else {
                    const [firstItem, secondItem] = lb;
                    lb[0] = secondItem;
                    lb[1] = firstItem;
                    setLeaderboard(lb);
                }
            })
            .catch((e) => console.log(e));
    }, [scope, level, type]);

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
            <SideBar currentPage="Leaderboard" />
            <ScrollView>
            <Topbar navigate={navigate} />
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

                    <TouchableHighlight
                        style={styles.buttonContainer}
                        onPress={() => {
                            setSchool((prev) =>
                                prev === "Secondary" ? "Primary" : "Secondary"
                            );
                            setLevel((prev) =>
                                prev === "Primary" ? "Secondary" : "Primary"
                            );
                        }}
                    >
                        <Text style={styles.changeSchoolText}>
                            <FontAwesome5
                                style={styles.syncAltIcon}
                                name="sync-alt"
                            />
                            {"  Change to " + school + " School"}
                        </Text>
                    </TouchableHighlight>

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
                        <View style={styles.dropdowns}>
                            <Text style={styles.textDropdown}>Scope: </Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={styles.picker}
                                    selectedValue={scope}
                                    onValueChange={(itemValue) => {
                                        setScope(itemValue);
                                    }}
                                >
                                    <Picker.Item label="Global" value={1} />
                                    <Picker.Item label="School" value={2} />
                                    <Picker.Item label="Level" value={3} />
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
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
