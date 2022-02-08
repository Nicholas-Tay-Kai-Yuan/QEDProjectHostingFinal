import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Sidebar from "../../common/side-navigations/Sidebar";
import Headers from "../../common/headers/Header";
import LearningResourcesTitle from "../../learning-resources-components/LearningResourcesTitle";
import LearningResourcesLevelButton from "../../learning-resources-components/LearningResourcesLevelButton";
import LearningResourcesSchoolItem from "../../learning-resources-components/LearningResourcesSchoolItem";
import Topbar from "../../common/top-navigations/Topbar"
import { useNavigate } from "react-router-native";

export default LearningResourcesLevel = () => {
    const navigate = useNavigate();
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Sidebar currentPage="Learning Resources"></Sidebar>
                <ScrollView style={{ flexDirection: 'column' }}>
                    <View style={styles.topbar}>
                        <Topbar navigate={navigate} />
                    </View>

                    <Headers text={"Learning Resources"}></Headers>

                    <View style={{ flexDirection: 'row', paddingHorizontal: 30, paddingTop: 20, justifyContent: 'space-evenly' }}>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Dunman_High_School.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Hwa_Chong_Institution.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Raffles_Institution.png')}></LearningResourcesSchoolItem>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 30, paddingTop: 20, paddingBottom: 50, justifyContent: 'space-evenly' }}>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Anderson_Secondary_School.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Singapore_Chinese_Girls_School.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Chong_Cheng_High_Secondary.jpg')}></LearningResourcesSchoolItem>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: '100%'
    },
    topbar: {
        height: 60,
    },
})
