import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeAuthenticationButton from "../../home-components/HomeAuthenticationButton";
import HomeNavItem from "../../home-components/HomeNavItem";
import LearningResourcesTitle from "../../learning-resources-components/LearningResourcesTitle";
import LearningResourcesSchoolItem from "../../learning-resources-components/LearningResourcesSchoolItem";
import LearningResourcesPaperButton from "../../learning-resources-components/LearningResourcesPaperButton";


const LearningResourcesPublic = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{height: 2600, backgroundColor: '#f1f9fc'}}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Image style={styles.image} source={require('../../../assets/Psleonline_logo_transparent.png')}></Image>     
                        <HomeNavItem></HomeNavItem>
                        <HomeAuthenticationButton></HomeAuthenticationButton>        
                    </View>
                    <Text style={styles.title}>Learning Resources</Text>

                    {/* Primary School */}
                    <LearningResourcesTitle title='Primary'></LearningResourcesTitle>
                    <View style={{flexDirection: 'row', paddingHorizontal: 100, paddingTop:20, justifyContent: 'space-evenly'}}>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/anglo_chinese_school.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Henry_Park_Primary_School_Logo.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/rosyth_primary_school.png')}></LearningResourcesSchoolItem>
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 100, paddingTop:20, justifyContent: 'space-evenly'}}>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Nan_yang_primary_school.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Tao_Nan_Primary_School.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Nan_Hua_Primary.png')}></LearningResourcesSchoolItem>
                    </View>

                    {/* Secondary School */}
                    <LearningResourcesTitle title='Secondary'></LearningResourcesTitle>
                    <View style={{flexDirection: 'row', paddingHorizontal: 100, paddingTop:20, justifyContent: 'space-evenly'}}>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Dunman_High_School.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Hwa_Chong_Institution.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Raffles_Institution.png')}></LearningResourcesSchoolItem>
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 100, paddingTop:20, justifyContent: 'space-evenly'}}>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Anderson_Secondary_School.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Singapore_Chinese_Girls_School.png')}></LearningResourcesSchoolItem>
                        <LearningResourcesSchoolItem imageURL={require('../../../assets/Chong_Cheng_High_Secondary.jpg')}></LearningResourcesSchoolItem>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingTop: 15
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


export default LearningResourcesPublic;