import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native";
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import getLevel from "../../../axios/level-api/getLevel";
import { useNavigate } from "react-router-native";
import SelectDropdown from 'react-native-select-dropdown'
import { FontAwesome5 } from '@expo/vector-icons';


export default QuizLevelDropdown = ({levels, text, color}) => {
    const navigate = useNavigate()
    const [skills, setSkills] = useState([]);
    const [skillsID, setSkillsID] = useState([]);
    const [topics, setTopics] = useState([]);
    const [newLevel, setNewLevel] = useState();
    let tempSkillsID;
    let topicName;

    
    useEffect(() => {
        let skillsJson;
        let skillsArray = [];
        let skillsIDArray = [];
        let topicsArray = [];
        let levelsArray = [];

        for (let i = 0; i < levels.topics.length; i++) {
            skillsJson = levels.topics[i].skills;
            topicsArray.push(levels.topics[i].topic_name);
            for (let y = 0; y < levels.topics[i].skills.length; y++) {
                skillsArray.push(levels.topics[i].skills[y].skill_name);
                skillsIDArray.push(levels.topics[i].skills[y]._id)
            }
        }

        if (skillsJson == undefined || skillsJson.length == 0) {
            skillsArray.push("No topics available")
        }
        // else {
        //     for (let i = 0; i < skillsJson.length; i++) {
        //         // console.log(skillsJson[i].skill_name);
        //         skillsArray.push(skillsJson[i].skill_name);
        //         skillsIDArray.push(skillsJson[i]._id);
        //     }
        // }
        
        {levels.level>=7 ?  setNewLevel(levels.level - 6) : 
        setNewLevel(levels.level)}
        
        setSkills(skillsArray);
        console.log(skillsArray);
        setSkillsID(skillsIDArray);
        setTopics(topicsArray);

    }, []);

    return (
        <View>
            <SelectDropdown
                data={skills}
                // disabled={skills.length == 1 ? true : false}
                defaultButtonText= {text + " " + newLevel}
                buttonStyle= {[styles.button, {backgroundColor: color}]}
                buttonTextStyle= {styles.buttonText}
                onSelect={(selectedItem, index) => {
                    if (selectedItem == "No topics available") {
                    }
                    else {
                   
                        tempSkillsID = skillsID[index];
                        topicName = topics[0];
                        
                        navigate("/QuizInstruction", {state: {levels: levels, tempSkillsID: tempSkillsID, topicName: topicName}})
                    }
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return "Primary " + levels.level
                }}
                rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item
                }}
            />
        </View>
        
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: Dimensions.get('window').width * 0.238,
        marginHorizontal: 25,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'left'
    }
})