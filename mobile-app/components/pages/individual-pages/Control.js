import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from "react-native";
import Sidebar from "../../common/side-navigations/Sidebar";
import { LinearGradient } from 'expo-linear-gradient';
import getLevel from "../../../axios/level-api/getLevel";
import { TouchableOpacity } from "react-native-gesture-handler";
import ControlLevelButton from "../../control-components/ControlLevelButton";
import Spinner from 'react-native-loading-spinner-overlay';
import ControlAddTopicModal from "../../control-components/ControlAddTopicModal";
import ControlAccordion from "../../control-components/ControlAccordion";
import { List } from 'react-native-paper';

export default Control = () => {

    const [levels, setLevels] = useState([]);
    const [primaryLevels, setPrimaryLevels] = useState([]);
    const [secondaryLevels, setSecondaryLevels] = useState([]);
    const [isReady, setReady] = useState(true);
    const [currentPage, setCurrentPage] = useState("main");
    const [selectedLevel, setSelectedLevel] = useState();
    const [needsUpdate, setUpdate] = useState(0);

    useEffect(() => {
        setCurrentPage("main");
        setPrimaryLevels([]);
        setSecondaryLevels([]);

        getLevel()
            .then((data) => {
                setLevels(data);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].level > 6) {
                        setSecondaryLevels(prevState => [...prevState, data[i]])
                    }
                    else {
                        setPrimaryLevels(prevState => [...prevState, data[i]])
                    }
                }
            })
            .finally(() => {
                setReady(false);
            })
    }, [needsUpdate]);

    return (
        <SafeAreaView>
            <Spinner visible={isReady} textContent="Loading..."></Spinner>
            <View style={styles.container}>
                <Sidebar currentPage={"Quiz Control Panel"}></Sidebar>
                <ScrollView>
                    <Text style={styles.heading}>Quiz Control Panel</Text>
                        {currentPage == "main" ? levels.length <= 0 ? 
                        <View style={{marginTop: 100}}>
                            <Text style={{ alignSelf: 'center', fontSize: 20}}>No Levels Available</Text>
                            <TouchableOpacity style={styles.setDefaultBtn}>
                                <Text style={{fontSize: 20}}>Set Default</Text>
                            </TouchableOpacity>
                        </View> :                
                        <View style={styles.educationContainer}>
                            <View>
                                <LinearGradient
                                    colors={['#7F7FD5', '#86A8E7', '#91EAE4']} style={styles.containerGradient}>
                                    <Text style={styles.educationType}>Primary</Text>
                                    <Image
                                        style={styles.image}
                                        source={require("../../../assets/primary_img.png")}
                                    ></Image>
                                    <View style={[styles.levelContainer, {backgroundColor: '#c9b3ce'}]}>
                                        <View style={[styles.levelLabelContainer, {backgroundColor: '#654EA3'}]}>
                                            <Text style={styles.selectLevel}>Select Level</Text>
                                        </View>
                                        <View style={{padding: 7}}>
                                            {primaryLevels.length <= 0 ? <View></View> :
                                                primaryLevels.map((levels, index)=> (
                                                    <ControlLevelButton key={index} levels={levels} setPage={setCurrentPage} selectLevel={setSelectedLevel}/>
                                                ))
                                            }
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                            <View>
                                <LinearGradient
                                    colors={['#3494E6', '#EC6EAD']} style={styles.containerGradient}>
                                    <Text style={styles.educationType}>Secondary</Text>
                                    <Image
                                        style={styles.image}
                                        source={require("../../../assets/secondary_img.png")}
                                    ></Image>
                                    <View style={[styles.levelContainer, {backgroundColor: '#e1f1ff'}]}>
                                        <View style={[styles.levelLabelContainer, {backgroundColor: '#81c6ed'}]}>
                                            <Text style={styles.selectLevel}>Select Level</Text>
                                        </View>
                                        <View style={{padding: 7}}>
                                            {secondaryLevels.length <= 0 ? <View></View> :
                                                secondaryLevels.map((levels, index)=> (
                                                    <ControlLevelButton key={index} levels={levels} setPage={setCurrentPage} selectLevel={setSelectedLevel}/>
                                                ))
                                            }
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                        </View>
                        : currentPage == "Topics" ? 
                        <View>
                            <Text style={styles.levelHeader}>{selectedLevel.level > 6 ? "Secondary " + (selectedLevel.level - 6) : "Primary " +selectedLevel.level}</Text>
                            <ControlAddTopicModal selectedLevel={selectedLevel} setUpdate={setUpdate}></ControlAddTopicModal>
                            {selectedLevel.topics.length > 0 ? 
                            <List.Section title="" style={{marginHorizontal: 40, marginVertical: 50}}>
                                {selectedLevel.topics.map((topic, index) => (
                                    <ControlAccordion
                                        setUpdate={setUpdate}
                                        key={index}
                                        topic={topic}
                                    />
                                ))}
                            </List.Section>
                            : <View></View>}
                        </View>
                        : 
                        <View></View>}
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
    educationType: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15
    },
    heading: {
        marginTop: 50,
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyContainer: {

    },
    educationContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        marginVertical: 30
    },
    setDefaultBtn: {
        alignSelf: 'center', 
        backgroundColor: '#ffc107',
        paddingVertical: 10, 
        paddingHorizontal: 150,
        borderRadius: 15
    },
    containerGradient: {
        borderRadius: 15,
        padding: 15
    },
    levelContainer: {
        marginTop: 20,
        borderRadius: 10
    },
    selectLevel: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 5
    },
    levelLabelContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    levelHeader: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        marginVertical: 10
    }
})