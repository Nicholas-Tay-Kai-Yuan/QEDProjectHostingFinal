import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeAuthenticationButton from "../../home-components/HomeAuthenticationButton";
import HomeNavItem from "../../home-components/HomeNavItem";
import LearningResourcesTitle from "../../learning-resources-components/LearningResourcesTitle";
import LearningResourcesLevelButtonPublic from "../../learning-resources-components/LearningResourcesLevelButtonPublic";
import { ScrollView } from "react-native-gesture-handler";

export default LearningResourcesLevelPublic = () => {
    return (
        <SafeAreaView>
            <ScrollView>        
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image style={styles.image} source={require('../../../assets/Psleonline_logo_transparent.png')}></Image>     
                        <HomeNavItem></HomeNavItem>
                        <HomeAuthenticationButton></HomeAuthenticationButton>        
                    </View>

                    {/* Primary School */}
                    <LearningResourcesTitle title='Primary'></LearningResourcesTitle>

                    <View style={{flexDirection: 'row', paddingHorizontal: 60, justifyContent: 'space-evenly'}}>
                        <LearningResourcesLevelButtonPublic level='Primary 1'></LearningResourcesLevelButtonPublic>
                        <LearningResourcesLevelButtonPublic level='Primary 2'></LearningResourcesLevelButtonPublic>
                        <LearningResourcesLevelButtonPublic level='Primary 3'></LearningResourcesLevelButtonPublic>
                    </View>

                    <View style={{flexDirection: 'row', paddingHorizontal: 60, justifyContent: 'space-evenly'}}>
                        <LearningResourcesLevelButtonPublic level='Primary 4'></LearningResourcesLevelButtonPublic>
                        <LearningResourcesLevelButtonPublic level='Primary 5'></LearningResourcesLevelButtonPublic>
                        <LearningResourcesLevelButtonPublic level='Primary 6'></LearningResourcesLevelButtonPublic>
                    </View>

                    {/* Secondary School */}
                    <LearningResourcesTitle title='Secondary'></LearningResourcesTitle>

                    <View style={{flexDirection: 'row', paddingHorizontal: 60, justifyContent: 'space-evenly'}}>
                        <LearningResourcesLevelButtonPublic level='Secondary 1'></LearningResourcesLevelButtonPublic>
                        <LearningResourcesLevelButtonPublic level='Secondary 2'></LearningResourcesLevelButtonPublic>
                        <LearningResourcesLevelButtonPublic level='Secondary 3'></LearningResourcesLevelButtonPublic>
                    </View>

                    <View style={{flexDirection: 'row', paddingHorizontal: 60, justifyContent: 'space-evenly'}}>
                        <LearningResourcesLevelButtonPublic level='Secondary 4'></LearningResourcesLevelButtonPublic>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f1f9fc',
        height: 1000
    },
    header: {
        height: 150,
        backgroundColor: "#f1f9fc",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    image: {
        width: '25%',
        height: '100%',
        resizeMode: 'contain',
        marginLeft: 40,
        marginRight: 50
    },
});

