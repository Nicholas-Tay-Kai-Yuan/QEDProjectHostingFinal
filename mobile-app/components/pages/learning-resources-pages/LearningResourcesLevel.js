import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Sidebar from "../../common/side-navigations/Sidebar";
import Headers from "../../common/headers/Header";
import LearningResourcesTitle from "../../learning-resources-components/LearningResourcesTitle";
import LearningResourcesLevelButton from "../../learning-resources-components/LearningResourcesLevelButton";
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

                    {/* Primary School */}
                    <LearningResourcesTitle title='Primary'></LearningResourcesTitle>

                    <View style={{ flexDirection: 'row', paddingHorizontal: 60, justifyContent: 'space-between' }}>
                        <LearningResourcesLevelButton level='Primary 1'></LearningResourcesLevelButton>
                        <LearningResourcesLevelButton level='Primary 2'></LearningResourcesLevelButton>
                        <LearningResourcesLevelButton level='Primary 3'></LearningResourcesLevelButton>
                    </View>

                    <View style={{ flexDirection: 'row', paddingHorizontal: 60, justifyContent: 'space-between' }}>
                        <LearningResourcesLevelButton level='Primary 4'></LearningResourcesLevelButton>
                        <LearningResourcesLevelButton level='Primary 5'></LearningResourcesLevelButton>
                        <LearningResourcesLevelButton level='Primary 6'></LearningResourcesLevelButton>
                    </View>

                    {/* Secondary School */}
                    <LearningResourcesTitle title='Secondary'></LearningResourcesTitle>

                    <View style={{ flexDirection: 'row', paddingHorizontal: 60, justifyContent: 'space-between' }}>
                        <LearningResourcesLevelButton level='Secondary 1'></LearningResourcesLevelButton>
                        <LearningResourcesLevelButton level='Secondary 2'></LearningResourcesLevelButton>
                        <LearningResourcesLevelButton level='Secondary 3'></LearningResourcesLevelButton>
                    </View>

                    <View style={{ flexDirection: 'row', paddingHorizontal: 60, paddingBottom: 50, justifyContent: 'space-between' }}>
                        <LearningResourcesLevelButton level='Secondary 4'></LearningResourcesLevelButton>
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
