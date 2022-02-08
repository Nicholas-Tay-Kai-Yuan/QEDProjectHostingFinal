import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Entypo, FontAwesome5, Feather, Ionicons } from "@expo/vector-icons";
import SidebarItem from "./SidebarItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

const icons = {
    group: <FontAwesome5 name="users" size={24} color="black" />,
    leaderboard: <FontAwesome5 name="award" size={24} color="black" />,
    learningrss: <FontAwesome5 name="newspaper" size={24} color="black" />,
    overview: <Entypo name="home" size={24} color="black" />,
    quiz: <FontAwesome5 name="atom" size={24} color="black" />,
    assignment: <Feather name="clipboard" size={24} color="black" />,
    statistics: <FontAwesome5 name="chart-bar" size={24} color="black" />,
    control: <Ionicons name="settings" size={24} color="black" />,
};

const directory = {
    overview: "/Overview",
    quiz: "/Quiz",
    assignment: "/Assignment",
    group: "/group_listing",
    statistics: "/Stats",
    leaderboard: "/Leaderboard",
    learningrss: "/LearningResourcesLevel",
    control: "/control",
};

export default Sidebar = ({ currentPage }) => {
    const [userRole, setUserRole] = useState();

    useEffect(async () => {
        const userInfo = await AsyncStorage.getItem("userInfo");
        const { role } = JSON.parse(userInfo);
        setUserRole(role);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require("../../../assets/Psleonline_logo_transparent.png")}
            ></Image>
            {userRole === "teacher" || userRole === "parent" ? (
                <View>
                    <SidebarItem
                        icon={icons.group}
                        label="My Groups"
                        isActive={currentPage === "My Groups"}
                        directory={directory.group}
                    />
                    <SidebarItem
                        icon={icons.leaderboard}
                        label="Leaderboard"
                        isActive={currentPage === "Leaderboard"}
                        directory={directory.leaderboard}
                    />
                    <SidebarItem
                        icon={icons.learningrss}
                        label="Learning Resources"
                        isActive={currentPage === "Learning Resources"}
                        directory={directory.learningrss}
                    />
                </View>
            ) : userRole === "student" ? (
                <View>
                    <SidebarItem
                        icon={icons.overview}
                        label="Overview"
                        isActive={currentPage === "Overview"}
                        directory={directory.overview}
                    />
                    <SidebarItem
                        icon={icons.quiz}
                        label="Quiz"
                        isActive={currentPage === "Quiz"}
                        directory={directory.quiz}
                    />
                    <SidebarItem
                        icon={icons.assignment}
                        label="Assignments"
                        isActive={currentPage === "Assignment"}
                        directory={directory.assignment}
                    />
                    <SidebarItem
                        icon={icons.group}
                        label="My Groups"
                        isActive={currentPage === "My Groups"}
                        directory={directory.group}
                    />
                    <SidebarItem
                        icon={icons.statistics}
                        label="My Statistics"
                        isActive={currentPage === "My Statistics"}
                        directory={directory.statistics}
                    />
                    <SidebarItem
                        icon={icons.leaderboard}
                        label="Leaderboard"
                        isActive={currentPage === "Leaderboard"}
                        directory={directory.leaderboard}
                    />
                    <SidebarItem
                        icon={icons.learningrss}
                        label="Learning Resources"
                        isActive={currentPage === "Learning Resources"}
                        directory={directory.learningrss}
                    />
                </View>
            ) : userRole === "admin" ? (
                <View>
                    <SidebarItem
                        icon={icons.control}
                        label="Quiz Control Panel"
                        isActive={currentPage === "Quiz Control Panel"}
                        directory={directory.control}
                    />
                    <SidebarItem
                        icon={icons.leaderboard}
                        label="Leaderboard"
                        isActive={currentPage === "Leaderboard"}
                        directory={directory.leaderboard}
                    />
                </View>
            ) : (
                <View></View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E1F1FF",
        height: "100%",
        width: "25%",
        paddingTop: 10,
    },
    buttons: {
        paddingVertical: 5,
    },
    buttonlabel: {
        fontFamily: "Poppins",
        fontSize: 25,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    image: {
        width: "100%",
        height: "10%",
    },
});
