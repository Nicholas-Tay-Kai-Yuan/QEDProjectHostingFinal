import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    ImageBackground,
} from "react-native";
import SideBar from "../../common/side-navigations/Sidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OverviewButton from "../../overview-components/OverviewButton";
import getUserAssignment from "../../../axios/assignment-api/getUserAssignment";
import getUserNotifications from "../../../axios/notification-api/getUserNotifications";
import OverviewAssignmentItem from "../../overview-components/OverviewAssignmentItem";
import OverviewNotificationItem from "../../overview-components/OverviewNotificationItem";
import getRecommendation from "../../../axios/quiz-api/getRecommendation";
import { useNavigate } from "react-router-native";
import getPopularQuiz from "../../../axios/quiz-api/getPopularQuiz";
import Topbar from "../../common/top-navigations/Topbar"


export default Overview = () => {
    const [pfpUrl, setPfpUrl] = useState("");
    const [username, setUsername] = useState("");
    const [assignment, setAssignment] = useState([]);
    const [notification, setNotification] = useState([]);
    const navigate = useNavigate();

    useEffect(async () => {
        const userInfo = await AsyncStorage.getItem("userInfo");
        const { pfp, first_name, last_name } = JSON.parse(userInfo);
        if (pfp) setPfpUrl(pfp);
        if (first_name && last_name) setUsername(`${first_name} ${last_name}`);
    }, []);

    useEffect(() => {
        getUserAssignment()
            .then((res) => setAssignment(res.slice(0, 3)))
            .catch((e) => console.log(e));
        getUserNotifications()
            .then((res) => setNotification(res))
            .catch((e) => console.log(e));
    }, []);

    return (
        <View style={styles.container}>
            <SideBar currentPage="Overview"/>
            <ScrollView>
                <Topbar navigate={navigate}/>
                <View style={styles.headingContainer}>
                    <Text style={styles.heading}>Overview</Text>
                </View>
                <View style={styles.cardContainer}>
                    {/* Every Card on the left hand side */}
                    <View style={styles.leftContainer}>
                        {/* Welcome Card */}
                        <View style={styles.welcomeContainer}>
                            <LinearGradient
                                colors={["#ff99e9", "#00daf7"]}
                                style={styles.pfpLGContainer}
                            >
                                <View style={styles.pfpContainer}>
                                    <Image
                                        source={
                                            pfpUrl === ""
                                                ? require("../../../assets/avatars/frog.png")
                                                : { uri: pfpUrl }
                                        }
                                        style={styles.pfpImage}
                                    />
                                </View>
                                <View style={styles.avatarBorderContainer}>
                                    <Image
                                        style={styles.avatarBorder}
                                        source={require("../../../assets/border.png")}
                                    />
                                </View>
                            </LinearGradient>
                            <View style={styles.welcomeTextContainer}>
                                <Text style={styles.welcomeText}>
                                    Welcome Back!
                                    {`\n${username}`}
                                </Text>
                            </View>
                        </View>

                        {/* Attempt Daily Quiz Card */}
                        <View style={styles.dailyQuizContainer}>
                            <LinearGradient
                                colors={["#9796f0", "#fbc7d4"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.dailyQuizLGContainer}
                            >
                                <View style={styles.dailyQuizImageContainer}>
                                    <Image
                                        style={styles.dailyQuizImage}
                                        source={require("../../../assets/readyforaquiz.png")}
                                    />
                                </View>

                                <View style={styles.dailyQuizButtonContainer}>
                                    <OverviewButton
                                        onPress={() => {
                                            getRecommendation().then((res) => {
                                                const { weakest3 } = res;
                                                if (weakest3.length > 0)
                                                    navigate("/quiz", {
                                                        state: {
                                                            skill: weakest3[0]
                                                                ._id,
                                                        },
                                                    });
                                                else {
                                                    getPopularQuiz().then(
                                                        (res) => {
                                                            navigate(
                                                                `/quiz/skill=${res[i]._id}`
                                                            );
                                                        }
                                                    );
                                                }
                                            });
                                        }}
                                        text="Attempt Daily Quiz!"
                                        color="#3db3ff"
                                    />
                                </View>
                            </LinearGradient>
                        </View>

                        {/* View Leaderboard Card */}
                        <View style={styles.leaderboardContainer}>
                            <LinearGradient
                                colors={["#a1ffce", "#faffd1"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.leaderboardLGContainer}
                            >
                                <View style={styles.leaderboardImageContainer}>
                                    <Image
                                        style={styles.leaderboardImage}
                                        source={require("../../../assets/podium.png")}
                                    />
                                </View>

                                <View style={styles.leaderboardButtonContainer}>
                                    <OverviewButton
                                        onPress={() => navigate("/leaderboard")}
                                        text="View Leaderboard"
                                        color="#ffba52"
                                    />
                                </View>
                            </LinearGradient>
                        </View>

                        {/* Play Dots Card */}
                        <View style={styles.playDotsImageContainer}>
                            <ImageBackground
                                source={require("../../../assets/game.png")}
                                style={styles.playDotsImage}
                            >
                                <Text style={styles.playDotsText}>
                                    Play Dots
                                </Text>
                            </ImageBackground>
                        </View>
                    </View>

                    {/* Every card on the right hand side */}
                    <View style={styles.rightContainer}>
                        {/* Assignment Card */}
                        <View style={styles.assignmentContainer}>
                            <LinearGradient
                                colors={["#83a4d4", "#b6fbff"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.assignmentLGContainer}
                            >
                                <View
                                    style={
                                        styles.assignmentHeadingTextContainer
                                    }
                                >
                                    <Text style={styles.assignmentHeadingText}>
                                        Assignments
                                    </Text>
                                </View>

                                {/* Inside this view contains the 3 assignment cards */}
                                <View style={styles.assignmentCardContainer}>
                                    {assignment.length <= 0 ? (
                                    <View style={styles.noAssignmentContainer}>
                                        <Text style={styles.noAssignmentText}>
                                            No Assignments Found
                                        </Text>
                                    </View>
                                    ) 
                                    :
                                    assignment.map((data, index) => (
                                        <OverviewAssignmentItem
                                            key={index}
                                            assignment={data}
                                            navigate={navigate}
                                        />
                                    ))}
                                </View>
                                <View style={styles.assignmentButtonContainer}>
                                    <OverviewButton
                                        onPress={() => navigate("/assignment")}
                                        text="View All Assignments"
                                        color="#81c6ed"
                                    />
                                </View>
                            </LinearGradient>
                        </View>

                        {/* Notifications Card */}
                        <View style={styles.notificationContainer}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.notificationLGContainer}
                                colors={["#654ea3", "#eaafc8"]}
                            >
                                <View
                                    style={
                                        styles.notificationHeadingTextContainer
                                    }
                                >
                                    <Text
                                        style={styles.notificationHeadingText}
                                    >
                                        Notifications
                                    </Text>
                                </View>
                                <ScrollView
                                    style={styles.notificationCardContainer}
                                    contentContainerStyle={{
                                        alignItems: "center",
                                    }}
                                    nestedScrollEnabled={true}
                                >
                                    {notification.length <= 0 ? (
                                        <View></View>
                                    ) : (
                                        notification.map((notiItem, index) => (
                                            <OverviewNotificationItem
                                                notification={notiItem}
                                                key={index}
                                                navigate={navigate}
                                            />
                                        ))
                                    )}
                                </ScrollView>
                            </LinearGradient>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "row",
    },
    headingContainer: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },
    heading: {
        fontSize: 36,
        fontFamily: "Coolvetica",
        zIndex: 1
    },
    cardContainer: {
        marginTop: 50,
        flex: 1,
        flexDirection: "row",
    },
    leftContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },
    welcomeContainer: {
        backgroundColor: "#e0eafc",
        width: "85%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    pfpLGContainer: {
        width: "90%",
        borderRadius: 15,
        marginTop: 15,
        marginBottom: 15,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        flexDirection: "row",
    },
    pfpContainer: {
        position: "absolute",
        width: 150,
        height: 150,
        alignItems: "center",
        justifyContent: "center",
    },
    pfpImage: {
        flex: 1,
        width: "100%",
        height: "100%",
        borderRadius: 1000,
    },
    avatarBorderContainer: {
        position: "absolute",
        width: 190,
        height: 190,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarBorder: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    welcomeTextContainer: {
        marginTop: 30,
        marginBottom: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },
    welcomeText: {
        fontSize: 27,
        fontFamily: "Feather",
        color: "#3db3ff",
        textAlign: "center",
    },
    dailyQuizContainer: {
        marginTop: 30,
        width: "85%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    dailyQuizLGContainer: {
        width: "100%",
        borderRadius: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    dailyQuizImageContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "90%",
    },
    dailyQuizImage: {
        borderRadius: 15,
        marginTop: 15,
        width: "100%",
        aspectRatio: 649 / 402,
        borderRadius: 15,
    },
    dailyQuizButtonContainer: {
        width: "90%",
        marginTop: 30,
        marginBottom: 15,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    leaderboardContainer: {
        marginTop: 30,
        width: "85%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    leaderboardLGContainer: {
        width: "100%",
        borderRadius: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    leaderboardImageContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "90%",
    },
    leaderboardImage: {
        borderRadius: 15,
        marginTop: 15,
        width: "100%",
        aspectRatio: 430 / 417,
        borderRadius: 15,
    },
    leaderboardButtonContainer: {
        width: "90%",
        marginTop: 30,
        marginBottom: 15,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    playDotsImageContainer: {
        width: "85%",
        backgroundColor: "white",
        marginTop: 30,
        marginBottom: 30,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        flex: 1,
        elevation: 1,
    },
    playDotsImage: {
        width: "100%",
        aspectRatio: 1265 / 742,
        justifyContent: "center",
        alignItems: "center",
    },
    playDotsText: {
        fontSize: 40,
        fontFamily: "Poppins",
        textAlign: "center",
        textAlignVertical: "center",
        fontWeight: "bold",
    },
    rightContainer: {
        flex: 1,
        alignItems: "center",
        alignContent: "center",
    },
    assignmentContainer: {
        width: "85%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    assignmentLGContainer: {
        width: "100%",
        borderRadius: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    assignmentHeadingTextContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection: "row",
        marginTop: 20,
    },
    assignmentHeadingText: {
        fontFamily: "Feather",
        textAlign: "center",
        textAlignVertical: "center",
        color: "white",
        fontSize: 25,
    },
    assignmentCardContainer: {
        width: "90%",
        marginTop: 30,
        alignItems: "center",
        flex: 1,
        flexDirection: "column",
    },
    noAssignmentContainer: {
        height: 390,
    },
    noAssignmentText: {
        fontSize: 25,
        fontFamily: "Coolvetica",
        color: "#003844",
    },
    assignmentButtonContainer: {
        width: "90%",
        marginTop: 10,
        marginBottom: 15,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    notificationContainer: {
        marginTop: 30,
        width: "85%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    notificationLGContainer: {
        width: "100%",
        borderRadius: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    notificationHeadingTextContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection: "row",
        marginTop: 20,
    },
    notificationHeadingText: {
        fontFamily: "Feather",
        textAlign: "center",
        textAlignVertical: "center",
        color: "white",
        fontSize: 25,
    },
    notificationCardContainer: {
        backgroundColor: "white",
        width: "85%",
        borderRadius: 15,
        paddingBottom: 30,
        flexDirection: "column",
        marginTop: 30,
        marginBottom: 30,
        height: 820,
    },
})
