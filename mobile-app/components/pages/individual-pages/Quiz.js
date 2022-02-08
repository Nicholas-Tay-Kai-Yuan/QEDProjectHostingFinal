import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Sidebar from "../../common/side-navigations/Sidebar";
import Headers from "../../common/headers/Header";
import getAllQuizzes from "../../../axios/quiz-api/getAllQuizzes"
import getLevel from "../../../axios/level-api/getLevel";
import QuizLevelDropdown from "../../quiz-components/components/QuizLevelDropdown";
import Topbar from "../../common/top-navigations/Topbar"
import { useNavigate } from "react-router-native";

export default Quiz = () => {
    // const [topicName, setTopicName] = useState();
    // const [levelName, setLevelName] = useState();
    // const [levelButton, setLevelButton] = useState();
    const [notes, setNotes] = useState([]);
    const [primaryLevels, setPrimaryLevels] = useState([])
    const [secondaryLevels, setSecondaryLevels] = useState([])
    const [levels, setLevels] = useState([]);
    const navigate = useNavigate();

    //Fractions
    let questionArray = [];
    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to generated decimal between min, max and precision (both included)
    function generateRandomDecimal(min, max, precision) {
        var value = Math.random() * (max - min + 1) + min;

        return value.toFixed(precision);
    }

    function generateRandomString(array) {
        var value = array[generateRandomNumber(0, array.length - 1)];

        return value;
    }

    useEffect(() => {
        getLevel()
            .then((data) => {
                // setInfo(data);
                setLevels(data);
                for (let note of data) {
                    if (note.level > 0 && note.level < 7) setPrimaryLevels(prev => [...prev, note])
                    else setSecondaryLevels(prev => [...prev, note])
                }
            })
    }, []);


    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Sidebar currentPage="Quiz"></Sidebar>                    
                <ScrollView>
                    <View style={styles.topbar}>
                        <Topbar navigate={navigate} />
                    </View>
                    {levels.length <= 0 ? <Text style={{ alignSelf: 'center', fontSize: 30, paddingTop: 400 }}>No Quiz Available</Text> :
                        <View>
                            <Headers text={"Quiz"}></Headers>
                            <View style={styles.schoolContainers}>

                                <View style={styles.primaryContainer}>
                                    <LinearGradient
                                        colors={['#7F7FD5', '#86A8E7', '#91EAE4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.containerGradient}>
                                        <Text style={styles.headerText}>Primary</Text>
                                        <Image style={styles.image} source={require('../../../assets/primary_img.png')}></Image>
                                        <View style={styles.primaryLevelContainer}>
                                            <Text style={styles.selectLevel}>Select Level</Text>
                                        </View>
                                        {primaryLevels.length <= 0 ? <View></View> :
                                            primaryLevels.map((levels, index) => (
                                                <QuizLevelDropdown key={index} levels={levels} text="Primary" color="#BC66CA" />
                                            ))
                                        }
                                    </LinearGradient>
                                </View>

                                <View style={styles.primaryContainer}>
                                    <LinearGradient
                                        colors={['#3494E6', '#EC6EAD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.containerGradient}>
                                        <Text style={styles.headerText}>Secondary</Text>
                                        <Image style={styles.image} source={require('../../../assets/secondary_img.png')}></Image>
                                        <View style={styles.primaryLevelContainer}>
                                            <Text style={styles.selectLevel}>Select Level</Text>
                                        </View>
                                        {secondaryLevels.length <= 0 ? <View></View> :
                                            secondaryLevels.map((levels, index) => (
                                                <QuizLevelDropdown key={index} levels={levels} text="Secondary" color="#3DB3FF" />
                                            ))
                                        }
                                    </LinearGradient>
                                </View>
                            </View>
                        </View>
                    }
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
    schoolContainers: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 30
    },
    primaryContainer: {
        height: 650,
        width: Dimensions.get('window').width * 0.3,
        paddingLeft: 30,
    },
    containerGradient: {
        borderRadius: 15,
        paddingBottom: 50
    },
    headerText: {
        fontSize: 30,
        color: '#FFFFFF',
        paddingVertical: 20,
        alignSelf: 'center'
    },
    image: {
        resizeMode: 'contain',
        marginLeft: 25,
        borderRadius: 10,
        marginBottom: 15
    },
    primaryLevelContainer: {
        backgroundColor: '#654EA3',
        marginHorizontal: 25,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 30
    },
    selectLevel: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center'
    },
    quizContainer: {
        backgroundColor: '#C9B3CE',
        marginHorizontal: 25,
        marginBottom: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    topbar: {
        height: 60,
    },
});

